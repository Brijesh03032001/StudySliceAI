#!/usr/bin/env python3
"""
StudySlice AI - Production Script
==================================

Universal educational video processing system that converts any lecture video
into focused study clips using AI analysis.

Features:
- Universal: Works with any educational video (CS, Biology, History, etc.)
- Automatic: Transcription → Analysis → Clip Extraction
- Flexible: Supports YouTube URLs or local video files
- High Quality: Professional video encoding with FFmpeg

Usage:
    python studyslice_ai.py --transcript transcript.json --youtube "https://youtube.com/watch?v=..."
    python studyslice_ai.py --transcript transcript.json --video video.mp4
    python studyslice_ai.py --transcript sunhacks-demo-vid-1.json --video "CS50x 2024 - Lecture 5 - Data Structures.mp4"
    
Requirements:
    - Google Gemini API key in .env file
    - FFmpeg installed
    - yt-dlp for YouTube downloads
"""

import os
import json
import re
import subprocess
import shutil
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import argparse
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class StudySliceAI:
    """
    Main StudySlice AI processing class for converting educational videos 
    into focused study clips using AI analysis.
    """
    
    def __init__(self, 
                 transcript_path: str,
                 youtube_url: Optional[str] = None,
                 video_path: Optional[str] = None,
                 output_dir: str = "study_clips",
                 quality: str = "high"):
        """
        Initialize StudySlice AI processor.
        
        Args:
            transcript_path: Path to transcript JSON file
            youtube_url: YouTube URL for video download
            video_path: Path to local video file
            output_dir: Directory for output clips
            quality: Video quality ('high', 'medium', 'low')
        """
        self.transcript_path = transcript_path
        self.youtube_url = youtube_url
        self.video_path = video_path
        self.output_dir = output_dir
        self.quality = quality
        
        # Configuration
        self.window_s = 120  # 2-minute analysis windows
        self.stride_s = 30   # 30-second stride
        self.clip_duration = 40  # 40-second clips
        
        # Educational keywords for universal subject detection
        self.educational_keywords = [
            'algorithm', 'data structure', 'programming', 'computer science',
            'biology', 'chemistry', 'physics', 'mathematics', 'history',
            'literature', 'psychology', 'economics', 'philosophy', 'engineering',
            'statistics', 'calculus', 'quantum', 'molecular', 'cellular',
            'genetic', 'neural', 'machine learning', 'artificial intelligence',
            'theoretical', 'empirical', 'hypothesis', 'methodology', 'analysis',
            'synthesis', 'evaluation', 'critical thinking', 'problem solving'
        ]
        
        # Initialize AI
        self._setup_ai()
        
    def _setup_ai(self):
        """Initialize Google Gemini AI."""
        api_key = os.getenv('GOOGLE_AI_API_KEY')
        if not api_key:
            raise ValueError("GOOGLE_AI_API_KEY not found in environment variables")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.5-flash')
        
    def load_and_normalize_transcript(self) -> List[Dict]:
        """
        Load and normalize transcript from AWS Transcribe JSON format.
        Handles both short and long transcripts (3+ hours).
        
        Returns:
            List of normalized segments with timestamps and text
        """
        print(f"📄 Loading transcript: {self.transcript_path}")
        
        with open(self.transcript_path, 'r') as f:
            data = json.load(f)
            
        # Extract items from AWS Transcribe format
        items = data['results']['items']
        segments = []
        current_segment = {"start": 0, "end": 0, "text": ""}
        word_count = 0
        
        print(f"📊 Processing {len(items)} transcript items...")
        
        for item in items:
            if item['type'] == 'pronunciation':
                # Add word to current segment
                word = item.get('alternatives', [{}])[0].get('content', '')
                start_time = float(item.get('start_time', 0))
                end_time = float(item.get('end_time', start_time))
                
                if current_segment["text"] == "":
                    current_segment["start"] = start_time
                    
                current_segment["text"] += word + " "
                current_segment["end"] = end_time
                word_count += 1
                
                # Create segment every ~150 words or 30 seconds
                if word_count >= 150 or (end_time - current_segment["start"]) >= 30:
                    if current_segment["text"].strip():
                        segments.append({
                            "start_time": current_segment["start"],
                            "end_time": current_segment["end"],
                            "text": current_segment["text"].strip()
                        })
                    
                    # Start new segment
                    current_segment = {"start": end_time, "end": end_time, "text": ""}
                    word_count = 0
        
        # Add final segment
        if current_segment["text"].strip():
            segments.append({
                "start_time": current_segment["start"],
                "end_time": current_segment["end"], 
                "text": current_segment["text"].strip()
            })
            
        print(f"✅ Normalized to {len(segments)} segments")
        return segments
    
    def create_analysis_chunks(self, segments: List[Dict]) -> List[Dict]:
        """
        Create overlapping analysis chunks for better concept detection.
        
        Args:
            segments: List of transcript segments
            
        Returns:
            List of analysis chunks with metadata
        """
        print(f"🧩 Creating analysis chunks...")
        
        chunks = []
        current_time = 0
        
        while current_time < segments[-1]['end_time']:
            chunk_end = current_time + self.window_s
            
            # Collect segments within this time window
            chunk_segments = [
                s for s in segments 
                if s['start_time'] < chunk_end and s['end_time'] > current_time
            ]
            
            if chunk_segments:
                chunk_text = " ".join([s['text'] for s in chunk_segments])
                
                chunks.append({
                    'start_time': current_time,
                    'end_time': min(chunk_end, segments[-1]['end_time']),
                    'text': chunk_text,
                    'segments': chunk_segments
                })
            
            current_time += self.stride_s
            
        print(f"✅ Created {len(chunks)} analysis chunks")
        return chunks
        
    def analyze_educational_content(self, chunks: List[Dict]) -> List[Dict]:
        """
        Analyze chunks using AI to identify educational concepts.
        
        Args:
            chunks: List of analysis chunks
            
        Returns:
            List of educational concepts with metadata
        """
        print(f"🧠 Analyzing educational content with AI...")
        
        # Detect subject from content
        sample_text = " ".join([chunk['text'] for chunk in chunks[:3]])
        subject = self._detect_subject(sample_text)
        
        print(f"📚 Subject detected: {subject}")
        
        educational_concepts = []
        
        for i, chunk in enumerate(chunks):
            print(f"🔍 Analyzing chunk {i+1}/{len(chunks)}")
            
            # AI analysis prompt
            prompt = f"""
            Analyze this {subject} educational content and identify key learning concepts.
            
            Content: {chunk['text']}
            
            For each significant educational concept, provide:
            1. Type (Example, Definition, Question, Process, Summary)
            2. Title (specific concept name)
            3. Description (what students learn)
            4. Importance (1-10 scale)
            
            Focus on concepts that would be valuable as 40-second study clips.
            Return as JSON array with fields: type, title, description, importance
            """
            
            try:
                response = self.model.generate_content(prompt)
                
                # Parse AI response
                response_text = response.text.strip()
                if response_text.startswith('```json'):
                    response_text = response_text.split('```json')[1].split('```')[0]
                elif response_text.startswith('```'):
                    response_text = response_text.split('```')[1].split('```')[0]
                
                concepts = json.loads(response_text)
                
                # Add metadata to concepts
                for concept in concepts:
                    if concept.get('importance', 0) >= 7:  # High-value concepts only
                        educational_concepts.append({
                            **concept,
                            'chunk_index': i,
                            'start_time': chunk['start_time'],
                            'end_time': chunk['end_time'],
                            'confidence': min(concept.get('importance', 5) / 10.0, 1.0)
                        })
                        
            except Exception as e:
                print(f"⚠️ Error analyzing chunk {i+1}: {e}")
                continue
                
        print(f"✅ Found {len(educational_concepts)} high-value concepts")
        return educational_concepts
        
    def _detect_subject(self, text: str) -> str:
        """Detect academic subject from content."""
        text_lower = text.lower()
        
        # Subject patterns
        subjects = {
            'Computer Science': ['algorithm', 'programming', 'data structure', 'code', 'function', 'variable'],
            'Biology': ['cell', 'DNA', 'protein', 'organism', 'evolution', 'genetics'],
            'Chemistry': ['molecule', 'atom', 'reaction', 'element', 'bond', 'compound'],
            'Physics': ['force', 'energy', 'momentum', 'wave', 'particle', 'quantum'],
            'Mathematics': ['equation', 'theorem', 'proof', 'function', 'derivative', 'integral'],
            'History': ['century', 'war', 'empire', 'revolution', 'culture', 'society']
        }
        
        # Count subject indicators
        subject_scores = {}
        for subject, keywords in subjects.items():
            score = sum(1 for keyword in keywords if keyword in text_lower)
            subject_scores[subject] = score
            
        # Return highest scoring subject
        if subject_scores:
            return max(subject_scores, key=subject_scores.get)
        return 'General Education'
        
    def select_best_clips(self, concepts: List[Dict]) -> List[Dict]:
        """
        Select the best educational concepts for video clips.
        
        Args:
            concepts: List of educational concepts
            
        Returns:
            List of selected clips with timing information
        """
        print(f"🎯 Selecting best clips from {len(concepts)} concepts...")
        
        # Sort by importance and confidence
        sorted_concepts = sorted(
            concepts, 
            key=lambda x: (x.get('confidence', 0), x.get('importance', 0)), 
            reverse=True
        )
        
        # Select diverse concept types
        selected_clips = []
        concept_types = {}
        
        for concept in sorted_concepts:
            concept_type = concept.get('type', 'Example')
            
            # Limit concepts per type for diversity
            if concept_types.get(concept_type, 0) < 3 and len(selected_clips) < 10:
                
                # Calculate clip timing
                clip_start = max(0, concept['start_time'] - 5)  # 5s buffer
                clip_end = clip_start + self.clip_duration
                
                clip_data = {
                    'clip_id': f"concept_{len(selected_clips)+1:02d}",
                    'concept_type': concept_type,
                    'title': f"{concept_type}: {concept['title']}",
                    'description': concept['description'],
                    'start_time': clip_start,
                    'end_time': clip_end,
                    'duration': self.clip_duration,
                    'confidence': concept['confidence'],
                    'chunk_index': concept['chunk_index']
                }
                
                selected_clips.append(clip_data)
                concept_types[concept_type] = concept_types.get(concept_type, 0) + 1
                
        print(f"✅ Selected {len(selected_clips)} diverse educational clips")
        return selected_clips
        
    def generate_clips_json(self, clips: List[Dict], subject: str) -> str:
        """
        Generate JSON metadata file for clips.
        
        Args:
            clips: List of selected clips
            subject: Detected academic subject
            
        Returns:
            Path to generated JSON file
        """
        # Generate dynamic filename
        basename = Path(self.transcript_path).stem
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        subject_clean = subject.lower().replace(" ", "_")
        
        clips_json_path = f"studyslice_{subject_clean}_{timestamp}.json"
        
        # Create metadata structure
        clips_data = {
            "lecture_info": {
                "title": f"{subject} - Educational Concepts",
                "subject": subject,
                "duration_hours": round(clips[-1]['end_time'] / 3600, 1) if clips else 0,
                "total_clips": len(clips),
                "processing_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            },
            "clips": clips
        }
        
        # Save JSON file
        with open(clips_json_path, 'w', encoding='utf-8') as f:
            json.dump(clips_data, f, indent=2, ensure_ascii=False)
            
        print(f"💾 Generated clips JSON: {clips_json_path}")
        return clips_json_path
        
    def download_video(self) -> str:
        """
        Download video from YouTube URL.
        
        Returns:
            Path to downloaded video file
        """
        if not self.youtube_url:
            raise ValueError("YouTube URL required for download")
            
        print(f"🔽 Downloading video from: {self.youtube_url}")
        
        # Generate output filename
        video_id = self._extract_video_id(self.youtube_url)
        output_file = f"video_{video_id}.mp4"
        
        # Download with yt-dlp
        cmd = [
            'yt-dlp',
            '--format', 'best[ext=mp4][height<=720]/best[ext=mp4]/best',
            '--output', output_file,
            self.youtube_url
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✅ Video downloaded: {output_file}")
            return output_file
        else:
            raise Exception(f"Download failed: {result.stderr}")
            
    def _extract_video_id(self, url: str) -> str:
        """Extract video ID from YouTube URL."""
        patterns = [
            r'(?:v=|\/)([0-9A-Za-z_-]{11}).*',
            r'(?:embed\/)([0-9A-Za-z_-]{11})',
            r'(?:v\/)([0-9A-Za-z_-]{11})'
        ]
        
        for pattern in patterns:
            match = re.search(pattern, url)
            if match:
                return match.group(1)
        return "unknown"
        
    def extract_video_clips(self, video_path: str, clips_json_path: str) -> Dict:
        """
        Extract video clips using FFmpeg based on JSON metadata.
        
        Args:
            video_path: Path to source video
            clips_json_path: Path to clips JSON metadata
            
        Returns:
            Dictionary with extraction results
        """
        print(f"🎬 Extracting clips from: {video_path}")
        
        # Load clips metadata
        with open(clips_json_path, 'r') as f:
            clips_data = json.load(f)
            
        clips = clips_data['clips']
        
        # Create output directory
        Path(self.output_dir).mkdir(exist_ok=True)
        
        # Quality settings
        quality_settings = {
            'high': ['-c:v', 'libx264', '-crf', '18', '-c:a', 'aac', '-b:a', '192k'],
            'medium': ['-c:v', 'libx264', '-crf', '23', '-c:a', 'aac', '-b:a', '128k'],
            'low': ['-c:v', 'libx264', '-crf', '28', '-c:a', 'aac', '-b:a', '96k']
        }
        
        settings = quality_settings.get(self.quality, quality_settings['high'])
        
        # Extract clips
        successful_clips = []
        failed_clips = []
        
        for i, clip in enumerate(clips):
            print(f"🎬 Extracting clip {i+1}/{len(clips)}: {clip['title']}")
            
            # Generate safe filename
            safe_title = re.sub(r'[^\w\-_\.]', '_', clip['title'])
            output_file = Path(self.output_dir) / f"{clip['clip_id']}_{safe_title}.mp4"
            
            # FFmpeg command
            cmd = [
                'ffmpeg', '-y',
                '-i', video_path,
                '-ss', str(clip['start_time']),
                '-t', str(clip['duration']),
                *settings,
                '-avoid_negative_ts', 'make_zero',
                str(output_file)
            ]
            
            try:
                result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
                
                if result.returncode == 0 and output_file.exists():
                    file_size = output_file.stat().st_size / (1024 * 1024)
                    successful_clips.append({
                        'clip_id': clip['clip_id'],
                        'title': clip['title'],
                        'file': str(output_file),
                        'size_mb': round(file_size, 2)
                    })
                    print(f"   ✅ {output_file.name} ({file_size:.1f}MB)")
                else:
                    failed_clips.append(clip['clip_id'])
                    print(f"   ❌ Failed to extract {clip['clip_id']}")
                    
            except subprocess.TimeoutExpired:
                failed_clips.append(clip['clip_id'])
                print(f"   ⏰ Timeout extracting {clip['clip_id']}")
                
        # Results summary
        total_size = sum(clip['size_mb'] for clip in successful_clips)
        
        results = {
            'successful': len(successful_clips),
            'failed': len(failed_clips),
            'total_size_mb': round(total_size, 1),
            'output_directory': self.output_dir,
            'clips': successful_clips
        }
        
        print(f"\n🎯 EXTRACTION COMPLETE")
        print(f"   ✅ Successful: {results['successful']}")
        print(f"   ❌ Failed: {results['failed']}")
        print(f"   💾 Total size: {results['total_size_mb']}MB")
        print(f"   📁 Location: {self.output_dir}")
        
        return results
        
    def run_full_pipeline(self) -> Dict:
        """
        Execute the complete StudySlice AI pipeline.
        
        Returns:
            Dictionary with pipeline results
        """
        print("🚀 STUDYSLICE AI - FULL PIPELINE")
        print("=" * 50)
        
        try:
            # Step 1: Load and normalize transcript
            segments = self.load_and_normalize_transcript()
            
            # Step 2: Create analysis chunks
            chunks = self.create_analysis_chunks(segments)
            
            # Step 3: AI analysis for educational concepts
            concepts = self.analyze_educational_content(chunks)
            
            # Step 4: Select best clips
            selected_clips = self.select_best_clips(concepts)
            
            # Step 5: Generate clips JSON
            subject = self._detect_subject(" ".join([chunk['text'] for chunk in chunks[:5]]))
            clips_json_path = self.generate_clips_json(selected_clips, subject)
            
            # Step 6: Handle video (download or use existing)
            if self.youtube_url:
                video_path = self.download_video()
            elif self.video_path:
                video_path = self.video_path
            else:
                raise ValueError("Either youtube_url or video_path must be provided")
                
            # Step 7: Extract video clips
            extraction_results = self.extract_video_clips(video_path, clips_json_path)
            
            # Final results
            pipeline_results = {
                'transcript_segments': len(segments),
                'analysis_chunks': len(chunks),
                'concepts_found': len(concepts),
                'clips_selected': len(selected_clips),
                'clips_json': clips_json_path,
                'video_path': video_path,
                'extraction_results': extraction_results,
                'subject': subject
            }
            
            print(f"\n🎉 PIPELINE COMPLETE!")
            print(f"   📊 Processed {len(segments)} transcript segments")
            print(f"   🧠 Found {len(concepts)} educational concepts")
            print(f"   🎯 Selected {len(selected_clips)} study clips")
            print(f"   ✅ Extracted {extraction_results['successful']} video clips")
            print(f"   📚 Subject: {subject}")
            print(f"   📁 Output: {self.output_dir}")
            
            return pipeline_results
            
        except Exception as e:
            print(f"❌ Pipeline failed: {e}")
            raise


def main():
    """Main function with command-line interface."""
    parser = argparse.ArgumentParser(
        description="StudySlice AI - Convert educational videos to study clips",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Process YouTube video
  python studyslice_ai.py --transcript transcript.json --youtube "https://youtube.com/watch?v=..."
  
  # Process local video file
  python studyslice_ai.py --transcript transcript.json --video video.mp4
  
  # Custom output directory and quality
  python studyslice_ai.py --transcript transcript.json --youtube "URL" --output my_clips --quality medium
        """
    )
    
    parser.add_argument('--transcript', required=True,
                       help='Path to transcript JSON file')
    parser.add_argument('--youtube', 
                       help='YouTube URL for video download')
    parser.add_argument('--video',
                       help='Path to local video file')
    parser.add_argument('--output', default='study_clips',
                       help='Output directory for clips (default: study_clips)')
    parser.add_argument('--quality', choices=['high', 'medium', 'low'], default='high',
                       help='Video quality (default: high)')
    
    args = parser.parse_args()
    
    # Validate arguments
    if not args.youtube and not args.video:
        parser.error("Either --youtube or --video must be provided")
        
    if args.youtube and args.video:
        parser.error("Provide either --youtube OR --video, not both")
    
    # Check transcript file exists
    if not Path(args.transcript).exists():
        parser.error(f"Transcript file not found: {args.transcript}")
    
    # Check .env file exists
    if not Path('.env').exists():
        print("⚠️ Warning: .env file not found. Make sure GOOGLE_AI_API_KEY is set.")
    
    try:
        # Initialize StudySlice AI
        processor = StudySliceAI(
            transcript_path=args.transcript,
            youtube_url=args.youtube,
            video_path=args.video,
            output_dir=args.output,
            quality=args.quality
        )
        
        # Run pipeline
        results = processor.run_full_pipeline()
        
        print(f"\n🎓 StudySlice AI processing complete!")
        print(f"📁 Check '{args.output}' directory for your study clips.")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return 1
        
    return 0


if __name__ == "__main__":
    exit(main())