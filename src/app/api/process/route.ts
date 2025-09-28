import { NextRequest, NextResponse } from 'next/server';

// Mock AI processing results
const generateMockClips = (uploadId: string) => {
  const clipTypes = [
    'Opening Hook', 'Key Insight', 'Viral Moment', 'Tutorial Snippet',
    'Emotional Peak', 'Call to Action', 'Behind Scenes', 'Quick Tip',
    'Surprise Element', 'Strong Ending'
  ];

  const descriptions = [
    'Attention-grabbing opening that hooks viewers immediately',
    'Most valuable insight that resonates with your audience',
    'Perfect for TikTok and Instagram Reels - high engagement potential',
    'Step-by-step explanation perfect for educational content',
    'Emotionally charged moment that creates strong viewer connection',
    'Compelling CTA that drives conversions and subscriptions',
    'Authentic behind-the-scenes moment that builds trust',
    'Actionable tip that viewers can implement immediately',
    'Unexpected twist that keeps viewers watching till the end',
    'Memorable conclusion that encourages sharing and engagement'
  ];

  return clipTypes.map((title, index) => ({
    id: `${uploadId}_clip_${index + 1}`,
    title,
    startTime: Math.floor(Math.random() * 800) + index * 50,
    endTime: Math.floor(Math.random() * 800) + index * 50 + 15 + Math.floor(Math.random() * 30),
    duration: 15 + Math.floor(Math.random() * 30),
    thumbnailUrl: `/api/placeholder/320/180?clip=${index + 1}`,
    videoUrl: `/api/placeholder/video/${index + 1}`,
    description: descriptions[index],
    engagement: {
      likes: Math.floor(Math.random() * 3000) + 1000,
      shares: Math.floor(Math.random() * 800) + 200,
      views: Math.floor(Math.random() * 40000) + 10000
    },
    aiScore: Math.random() * 0.3 + 0.7, // Score between 0.7-1.0
    platforms: ['tiktok', 'instagram', 'youtube_shorts'],
    tags: ['engaging', 'viral_potential', 'high_retention']
  }));
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uploadId } = body;

    if (!uploadId) {
      return NextResponse.json(
        { error: 'Upload ID is required' },
        { status: 400 }
      );
    }

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock clips
    const clips = generateMockClips(uploadId);

    // Mock video metadata
    const videoMetadata = {
      originalDuration: 900, // 15 minutes
      resolution: '1920x1080',
      frameRate: 30,
      audioChannels: 2,
      fileSize: '250MB'
    };

    return NextResponse.json({
      success: true,
      uploadId,
      status: 'completed',
      processedAt: new Date().toISOString(),
      videoMetadata,
      clips,
      summary: {
        totalClips: clips.length,
        averageEngagementScore: clips.reduce((acc, clip) => acc + clip.aiScore, 0) / clips.length,
        recommendedPlatforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts'],
        estimatedReach: Math.floor(Math.random() * 500000) + 100000
      }
    });

  } catch (error) {
    console.error('Processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process video' },
      { status: 500 }
    );
  }
}

// Get processing status
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const uploadId = searchParams.get('uploadId');

  if (!uploadId) {
    return NextResponse.json(
      { error: 'Upload ID is required' },
      { status: 400 }
    );
  }

  // Mock processing status
  const statuses = ['queued', 'processing', 'completed', 'failed'];
  const randomStatus = statuses[2]; // Always return completed for demo

  return NextResponse.json({
    uploadId,
    status: randomStatus,
    progress: randomStatus === 'completed' ? 100 : Math.floor(Math.random() * 80) + 10,
    message: `Video ${randomStatus}`,
    estimatedTimeRemaining: randomStatus === 'completed' ? 0 : Math.floor(Math.random() * 120) + 30
  });
}