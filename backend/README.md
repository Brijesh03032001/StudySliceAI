# Flask S3 Upload API

A simple Flask API that generates presigned URLs for uploading files to an S3 bucket.

## Setup Instructions

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. AWS Configuration
This application is designed to run on EC2 with an IAM role. Ensure your EC2 instance has an IAM role with the following S3 permissions:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::sunhacks25/vids/*"
        }
    ]
}
```

Optionally set the AWS region (defaults to us-east-1):
```bash
export AWS_REGION="us-east-1"
```

### 3. Run the Application
```bash
python app.py
```

The API will start on `http://localhost:5000`

## API Endpoints

### POST /upload
Creates a presigned URL for uploading a file to S3.

**Request Body:**
```json
{
    "filename": "example.mp4"
}
```

**Response:**
```json
{
    "presigned_url": "https://sunhacks25.s3.amazonaws.com/vids/example.mp4?...",
    "bucket": "sunhacks25",
    "key": "vids/example.mp4",
    "expires_in": 3600
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
    "status": "healthy",
    "service": "Flask S3 Upload API"
}
```

## Testing Instructions

### 1. Test the Health Endpoint
```bash
curl -X GET http://localhost:5000/health
```

### 2. Test Presigned URL Generation
```bash
curl -X POST http://localhost:5000/upload \
  -H "Content-Type: application/json" \
  -d '{"filename": "test-video.mp4"}'
```

### 3. Test File Upload Using the Presigned URL
After getting the presigned URL from step 2, use it to upload a file:

```bash
# Replace <PRESIGNED_URL> with the actual URL from the API response
curl -X PUT "<PRESIGNED_URL>" \
  -H "Content-Type: application/octet-stream" \
  --data-binary @/path/to/your/file.mp4
```

### 4. Test with Python Script
Create a test script `test_upload.py`:

```python
import requests
import json

# Test presigned URL generation
response = requests.post('http://localhost:5000/upload', 
                        json={'filename': 'test-video.mp4'})

if response.status_code == 200:
    data = response.json()
    print("Presigned URL generated successfully!")
    print(f"URL: {data['presigned_url']}")
    print(f"Key: {data['key']}")
    
    # Test file upload (replace with actual file path)
    # with open('your-file.mp4', 'rb') as f:
    #     upload_response = requests.put(data['presigned_url'], data=f)
    #     print(f"Upload status: {upload_response.status_code}")
else:
    print(f"Error: {response.status_code}")
    print(response.json())
```

Run the test:
```bash
python test_upload.py
```

## Error Handling

The API handles various error scenarios:
- Missing filename in request
- Empty filename
- AWS credentials not configured
- S3 service errors
- General server errors

All errors return appropriate HTTP status codes and JSON error messages.

## Configuration

- **Bucket Name**: `sunhacks25` (hardcoded)
- **Folder**: `vids` (hardcoded)
- **URL Expiration**: 1 hour (3600 seconds)
- **Default Region**: `us-east-1`

## Security Notes

- Presigned URLs expire after 1 hour
- Files are uploaded to the `vids/` folder in the S3 bucket
- Uses EC2 IAM role for authentication (no hardcoded credentials)
- Ensure your EC2 instance's IAM role has minimal required S3 permissions
