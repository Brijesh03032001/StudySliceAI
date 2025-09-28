import os
import boto3
from flask import Flask, request, jsonify
from flask_cors import CORS
from botocore.exceptions import ClientError, NoCredentialsError
import logging
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# S3 configuration
BUCKET_NAME = "sunhacks25"
FOLDER_NAME = "vids"

def get_s3_client():
    """Initialize and return S3 client using EC2 IAM role"""
    try:
        # boto3 will automatically use the EC2 instance's IAM role
        s3_client = boto3.client(
            's3',
            region_name=os.getenv('AWS_REGION', 'us-east-1')
        )
        return s3_client
    except NoCredentialsError:
        logger.error("AWS credentials not found - ensure EC2 instance has proper IAM role")
        return None

@app.route('/upload', methods=['POST'])
def create_presigned_url():
    """
    Create a presigned URL for uploading a file to S3
    Expects JSON payload with 'filename' field
    """
    try:
        # Get filename from request
        data = request.get_json()
        if not data or 'filename' not in data:
            return jsonify({
                'error': 'Missing filename in request body'
            }), 400
        
        filename = data['filename']
        if not filename:
            return jsonify({
                'error': 'Filename cannot be empty'
            }), 400
        
        # Initialize S3 client
        s3_client = get_s3_client()
        if not s3_client:
            return jsonify({
                'error': 'AWS IAM role not configured properly on EC2 instance'
            }), 500
        
        # Create the S3 key (path) for the file
        s3_key = f"{FOLDER_NAME}/{filename}"
        
        # Generate presigned URL for PUT operation
        try:
            presigned_url = s3_client.generate_presigned_url(
                'put_object',
                Params={
                    'Bucket': BUCKET_NAME,
                    'Key': s3_key,
                    'ContentType': 'application/octet-stream'
                },
                ExpiresIn=3600  # URL expires in 1 hour
            )
            
            return jsonify({
                'presigned_url': presigned_url,
                'bucket': BUCKET_NAME,
                'key': s3_key,
                'expires_in': 3600
            }), 200
            
        except ClientError as e:
            logger.error(f"Error generating presigned URL: {e}")
            return jsonify({
                'error': 'Failed to generate presigned URL',
                'details': str(e)
            }), 500
            
    except Exception as e:
        logger.error(f"Unexpected error: {e}")
        return jsonify({
            'error': 'Internal server error',
            'details': str(e)
        }), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'Flask S3 Upload API'
    }), 200


@app.route('/process-transcript', methods=['POST'])
def process_transcript():
    """
    Endpoint called by Lambda when transcript is ready
    Downloads and processes the transcript JSON
    """
    try:
        data = request.get_json()
        bucket = data['bucket']
        transcript_key = data['transcript_key']
        original_video_name = data['original_video_name']
        
        logger.info(f"Processing transcript for video: {original_video_name}")
        logger.info(f"Transcript location: s3://{bucket}/{transcript_key}")
        
        # Download transcript from S3
        s3_client = get_s3_client()
        if not s3_client:
            return jsonify({'error': 'S3 client not available'}), 500
        
        try:
            # Download the transcript JSON
            response = s3_client.get_object(Bucket=bucket, Key=transcript_key)
            transcript_content = response['Body'].read().decode('utf-8')
            transcript_json = json.loads(transcript_content)
            local_filename = f"transcript_{original_video_name}.json"
            local_path = os.path.join("/tmp", local_filename)  # or your preferred directory
            with open(local_path, 'w') as f:
                json.dump(transcript_json, f, indent=2)
            
            logger.info(f"Downloaded transcript JSON, size: {len(transcript_content)} bytes")
        except Exception as e:
            logger.error(f"Error downloading transcript: {e}")
            return jsonify({'error': str(e)}), 500
    except Exception as e:
        logger.error(f"Error processing transcript: {e}")
        return jsonify({'error': str(e)}), 500
    

@app.route('/get-clips/<video_name>', methods=['GET'])
def get_clips(video_name):
    """
    Get processed clips for a video
    """
    try:
        s3_client = get_s3_client()
        clips_key = f"clips/{video_name}-clips.json"
        
        try:
            response = s3_client.get_object(Bucket=BUCKET_NAME, Key=clips_key)
            clips_content = response['Body'].read().decode('utf-8')
            clips_json = json.loads(clips_content)
            
            return jsonify(clips_json), 200
            
        except ClientError as e:
            if e.response['Error']['Code'] == 'NoSuchKey':
                return jsonify({'error': 'Clips not found - may still be processing'}), 404
            else:
                raise e
                
    except Exception as e:
        logger.error(f"Error getting clips: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/video-status/<video_name>', methods=['GET'])
def get_video_status(video_name):
    """
    Get processing status for a video
    """
    try:
        s3_client = get_s3_client()
        
        # Check if original video exists
        video_key = f"{FOLDER_NAME}/{video_name}"
        video_exists = False
        try:
            s3_client.head_object(Bucket=BUCKET_NAME, Key=video_key)
            video_exists = True
        except ClientError:
            pass
        
        # Check if transcript exists
        transcript_key = f"transcripts/{video_name}-transcript.json"
        transcript_exists = False
        try:
            s3_client.head_object(Bucket=BUCKET_NAME, Key=transcript_key)
            transcript_exists = True
        except ClientError:
            pass
        
        # Check if clips exist
        clips_key = f"clips/{video_name}-clips.json"
        clips_exist = False
        try:
            s3_client.head_object(Bucket=BUCKET_NAME, Key=clips_key)
            clips_exist = True
        except ClientError:
            pass
        
        # Determine status
        if clips_exist:
            status = "completed"
        elif transcript_exists:
            status = "processing_clips"
        elif video_exists:
            status = "transcribing"
        else:
            status = "not_found"
        
        return jsonify({
            'video_name': video_name,
            'status': status,
            'video_exists': video_exists,
            'transcript_exists': transcript_exists,
            'clips_exist': clips_exist
        }), 200
        
    except Exception as e:
        logger.error(f"Error checking video status: {e}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    # Running on EC2 with IAM role - no explicit credentials needed
    logger.info("Starting Flask app - using EC2 IAM role for AWS authentication")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
