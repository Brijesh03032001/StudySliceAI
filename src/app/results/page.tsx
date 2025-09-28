'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChatGPTBackground, FloatingOrb } from '@/components/chatgpt-background';
import {
  Play,
  Download,
  Share2,
  Heart,
  Eye,
  TrendingUp,
  Clock,
  Scissors,
  Sparkles,
  Copy,
  Facebook,
  Twitter,
  Instagram,
  Youtube
} from 'lucide-react';

// Enhanced VideoClip interface
interface VideoClip {
  index_id: string;
  concept_title: string;
  start_s: number;
  end_s: number;
  duration: number;
  videoUrl: string;
  summary: string;
}

// Load and transform studySliceClipOne.json data
const loadClipsFromJson = async (): Promise<VideoClip[]> => {
  try {
    console.log('🔄 Attempting to fetch clips from /TheClips/studySliceClipOne.json');
    
    // Try to fetch from the public directory
    const response = await fetch('/TheClips/studySliceClipOne.json', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📡 Response status:', response.status, response.statusText);
    console.log('📋 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('📄 Raw JSON data structure:', {
      lecture_id: data.lecture_id,
      generated_at: data.generated_at,
      counts: data.counts,
      clipsArray: Array.isArray(data.clips),
      clipsLength: data.clips?.length || 0
    });
    
    if (!data.clips || !Array.isArray(data.clips)) {
      console.error('❌ Invalid JSON structure - clips array not found. Data:', data);
      throw new Error('Invalid JSON structure - clips array not found');
    }
    
    console.log('🎬 First clip preview:', data.clips[0]);
    
    // Transform the clips from studySliceClipOne.json into our VideoClip format
    const processedClips = data.clips.map((clip: any, index: number) => {
      console.log(`🔧 Processing clip ${index + 1}/${data.clips.length}:`, {
        concept_title: clip.concept_title,
        hasUrl: !!clip.url,
        start_s: clip.start_s,
        end_s: clip.end_s
      });
      
      return {
        index_id: clip.index_id.toString(),
        concept_title: clip.concept_title,
        start_s: Math.floor(clip.start_s),
        end_s: Math.floor(clip.end_s),
        duration: Math.floor(clip.duration),
        videoUrl: clip.url, // fallback URL if not present
        summary: clip.summary
      };
    });
    
    console.log('✅ Successfully processed clips:', processedClips.length);
    console.log('🎯 First processed clip:', processedClips[0]);
    return processedClips;
  } catch (error) {
    console.error('❌ Failed to load clips from JSON:', error);
    console.error('💥 Error details:', error instanceof Error ? error.message : String(error));
    console.error('📚 Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.log('🔄 Falling back to mock clips');
    return getMockClips();
  }
};

// Generate appropriate summary based on clip type and concept
const generateSummaryFromType = (type: string, concept: string): string => {
  const summaries: Record<string, string> = {
    'Definition': `Clear definition and explanation of ${concept}`,
    'Example': `Practical example demonstrating ${concept}`,
    'Process': `Step-by-step process for ${concept}`,
    'Question': `Important question about ${concept}`,
    'Summary': `Key summary of ${concept}`,
  };
  
  return summaries[type] || `Key insights about ${concept}`;
};

// Fallback mock data for demonstration
const getMockClips = (): VideoClip[] => [
  {
    index_id: '1',
    concept_title: '🔴 MOCK: Definition Algorithm Design',
    start_s: 5,
    end_s: 35,
    duration: 30,
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    summary: '🔴 [MOCK DATA] Clear definition and explanation of Algorithm Design'
  },
  {
    index_id: '2',
    concept_title: '🔴 MOCK: Example Algorithm Design',
    start_s: 45,
    end_s: 75,
    duration: 30,
    videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    summary: '🔴 [MOCK DATA] Practical example demonstrating Algorithm Design'
  },
  {
    index_id: '3',
    concept_title: '🔴 MOCK: Computer Science Concepts',
    start_s: 120,
    end_s: 150,
    duration: 30,
    videoUrl: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
    summary: '🔴 [MOCK DATA] Clear definition and explanation of Computer Science Concepts'
  }
];

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

interface ClipCardProps {
  clip: VideoClip;
  index: number;
  onSelect: (clip: VideoClip) => void;
  isSelected: boolean;
}

function ClipCard({ clip, index, onSelect, isSelected }: ClipCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={`
        relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-300
        ${isSelected ? 'ring-2 ring-emerald-500 ring-offset-2 shadow-lg' : 'hover:shadow-lg'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(clip)}
      id={`clip-${clip.index_id}`}
    >
      <Card className="p-0 overflow-hidden bg-white border-slate-200 hover:border-emerald-200">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-slate-100">
          {/* Show actual video thumbnail or placeholder */}
          {clip.videoUrl.startsWith('https://') ? (
            <video
              className="w-full h-full object-cover"
              muted
              preload="metadata"
              poster=""
            >
              <source src={clip.videoUrl} type="video/mp4" />
            </video>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-cyan-100 flex items-center justify-center">
              <Play className="h-12 w-12 text-emerald-500" />
            </div>
          )}
          
          {/* Duration badge */}
          <Badge 
            className="absolute top-2 right-2 bg-slate-800/80 text-white border-none text-xs"
          >
            {formatTime(clip.duration)}
          </Badge>

          {/* Hover overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 flex items-center justify-center"
          >
            <Button 
              size="lg" 
              className="bg-white/90 text-emerald-600 hover:bg-white shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                // Open clip in new window for preview
                if (clip.videoUrl.startsWith('https://')) {
                  window.open(clip.videoUrl, '_blank');
                }
              }}
            >
              <Play className="h-5 w-5 mr-2" />
              {clip.videoUrl.startsWith('https://') ? 'Preview' : 'Select'}
            </Button>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors">
              {clip.concept_title}
            </h3>
            <Badge variant="outline" className="text-xs border-emerald-200 text-emerald-700">
              {formatTime(clip.start_s)} - {formatTime(clip.end_s)}
            </Badge>
          </div>

          <p className="text-xs text-slate-600 line-clamp-2">
            {clip.summary}
          </p>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isHovered || isSelected ? 1 : 0, 
              height: isHovered || isSelected ? 'auto' : 0 
            }}
            transition={{ duration: 0.2 }}
            className="flex space-x-2 pt-2 border-t border-slate-200"
          >
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 text-xs border-emerald-200 text-emerald-600 hover:bg-emerald-50"
              onClick={(e) => {
                e.stopPropagation();
                if (clip.videoUrl.startsWith('https://')) {
                  // Create a download link
                  const link = document.createElement('a');
                  link.href = clip.videoUrl;
                  link.download = `${clip.concept_title.replace(/[^a-zA-Z0-9]/g, '_')}.mp4`;
                  link.target = '_blank';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }
              }}
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 text-xs border-emerald-200 text-emerald-600 hover:bg-emerald-50"
              onClick={(e) => {
                e.stopPropagation();
                if (navigator.share && clip.videoUrl.startsWith('https://')) {
                  navigator.share({
                    title: clip.concept_title,
                    text: clip.summary,
                    url: clip.videoUrl,
                  });
                } else {
                  // Copy to clipboard as fallback
                  navigator.clipboard.writeText(clip.videoUrl);
                  // You could show a toast notification here
                }
              }}
            >
              <Share2 className="h-3 w-3 mr-1" />
              Share
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function ResultsPage() {
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [selectedClip, setSelectedClip] = useState<VideoClip | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalVideoDuration, setTotalVideoDuration] = useState(900); // Default fallback to 15 minutes
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const clipsContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Calculate total video duration from clips data
  const calculateVideoDuration = (clipsData: VideoClip[]): number => {
    if (clipsData.length === 0) return 900; // Default fallback
    
    // Find the maximum end_s value across all clips
    const maxEndTime = Math.max(...clipsData.map(clip => clip.end_s));
    
    // Add some buffer (30 seconds) to account for potential clips at the very end
    const calculatedDuration = Math.ceil(maxEndTime + 30);
    
    console.log(`📊 Calculated video duration: ${calculatedDuration}s (${Math.floor(calculatedDuration/60)}:${(calculatedDuration%60).toString().padStart(2, '0')})`);
    
    return calculatedDuration;
  };

  useEffect(() => {
    // Load clips from JSON file
    const initializeClips = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        console.log('Starting to load clips...');
        
        const loadedClips = await loadClipsFromJson();
        console.log('Clips loaded successfully:', loadedClips);
        
        // Calculate and set the total video duration
        const videoDuration = calculateVideoDuration(loadedClips);
        setTotalVideoDuration(videoDuration);
        
        setClips(loadedClips);
        if (loadedClips.length > 0) {
          setSelectedClip(loadedClips[0]);
          console.log('Set initial selected clip:', loadedClips[0]);
        }
      } catch (error) {
        console.error('Error initializing clips:', error);
        setLoadError(error instanceof Error ? error.message : 'Failed to load clips');
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeClips();
    
    // Get uploaded video from sessionStorage
    const storedVideoUrl = sessionStorage.getItem('uploadedVideoUrl');
    const storedFileName = sessionStorage.getItem('uploadedFileName');
    const s3Info = sessionStorage.getItem('s3Info');
    
    if (storedVideoUrl) {
      setUploadedVideoUrl(storedVideoUrl);
      console.log('Loaded uploaded video:', storedFileName);
      
      if (s3Info) {
        try {
          const s3Data = JSON.parse(s3Info);
          console.log('S3 Upload Info:', s3Data);
          // You can use s3Data here to show upload details or fetch processed results
          // s3Data contains: bucket, key, expires_in, upload_time, s3_url
        } catch (e) {
          console.warn('Failed to parse S3 info:', e);
        }
      }
    } else {
      console.log('No uploaded video found in sessionStorage');
    }
  }, []);

  const handleClipSelect = (clip: VideoClip) => {
    setSelectedClip(clip);
    setCurrentTime(clip.start_s);
    
    // Seek video to clip start time if video is loaded
    if (videoRef.current && uploadedVideoUrl) {
      try {
        videoRef.current.currentTime = clip.start_s;
        console.log(`Selected clip: ${clip.concept_title} - Seeked to ${clip.start_s}s`);
      } catch (error) {
        console.warn('Failed to seek video:', error);
      }
    }
  };

  const handleTimelineClick = (clip: VideoClip) => {
    // Select the clip and seek video
    handleClipSelect(clip);
    
    // Additional video seeking with error handling
    if (videoRef.current && uploadedVideoUrl) {
      try {
        videoRef.current.currentTime = clip.start_s;
        console.log(`Video seeked to ${clip.start_s}s for clip: ${clip.concept_title}`);
      } catch (error) {
        console.warn('Failed to seek video:', error);
      }
    }
    
    // Scroll to the specific clip in the grid
    const clipElement = document.getElementById(`clip-${clip.index_id}`);
    if (clipElement && clipsContainerRef.current) {
      clipElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
      
      // Add a brief highlight effect
      clipElement.style.transform = 'scale(1.02)';
      setTimeout(() => {
        clipElement.style.transform = 'scale(1)';
      }, 300);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* ChatGPT-5 Light Background */}
      <ChatGPTBackground />
      
      {/* Floating Orbs */}
      <FloatingOrb className="w-80 h-80 bg-gradient-to-r from-emerald-100/30 to-cyan-100/30 -top-40 -right-40" delay={0} />
      <FloatingOrb className="w-72 h-72 bg-gradient-to-r from-blue-100/30 to-purple-100/30 top-1/2 -left-36" delay={5} />

      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-4 py-2 text-sm text-emerald-700 mb-4 shadow-sm">
              <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
              Processing Complete
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
              Your Smart Clips Are Ready!
            </h1>
            <p className="text-xl text-slate-600">
              AI identified {clips.length} high-engagement moments perfect for social media
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Video Player */}
            <div className="lg:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="p-6 bg-white border-slate-200 shadow-lg">
                  <div className="aspect-video bg-slate-900 rounded-lg mb-4 relative overflow-hidden">
                    {uploadedVideoUrl ? (
                      <video
                        ref={videoRef}
                        src={uploadedVideoUrl}
                        controls
                        className="w-full h-full object-contain bg-black"
                        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                        onLoadedMetadata={() => {
                          const fileName = sessionStorage.getItem('uploadedFileName') || 'Uploaded Video';
                          console.log(`Video loaded: ${fileName}`);
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center">
                        <Play className="h-16 w-16 text-white mb-4" />
                        <p className="text-white text-lg">No Video Uploaded</p>
                        <p className="text-slate-300 text-sm text-center px-4">
                          Upload a video from the Upload page to see it here
                        </p>
                        <p className="text-slate-400 text-xs mt-2">
                          {selectedClip ? `Preview: ${selectedClip.concept_title}` : 'Select a clip to preview'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Enhanced Timeline */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600 font-medium">Interactive Timeline</span>
                      <span className="text-slate-900 font-medium">
                        {formatTime(currentTime)} / {formatTime(totalVideoDuration)}
                      </span>
                    </div>
                    
                    {/* Timeline visualization with click functionality */}
                    <div className="relative h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                      {/* Timeline segments for clips */}
                      {clips.map((clip, index) => (
                        <motion.div
                          key={clip.index_id}
                          className={`absolute top-0 h-full cursor-pointer transition-all duration-200 rounded-sm group ${
                            selectedClip?.index_id === clip.index_id 
                              ? 'bg-emerald-500 shadow-md ring-2 ring-emerald-300' 
                              : 'bg-emerald-400 hover:bg-emerald-500 hover:shadow-sm'
                          }`}
                          style={{
                            left: `${(clip.start_s / totalVideoDuration) * 100}%`,
                            width: `${Math.max((clip.duration / totalVideoDuration) * 100, 0.5)}%`
                          }}
                          onClick={() => handleTimelineClick(clip)}
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          title={`Click to jump to: ${clip.concept_title} (${formatTime(clip.start_s)} - ${formatTime(clip.end_s)})`}
                        >
                          <div className="h-full flex items-center justify-center text-white text-xs font-medium">
                            {index + 1}
                          </div>
                          
                          {/* Hover tooltip */}
                          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                            <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                              {clip.concept_title}
                              <div className="text-slate-300">
                                {formatTime(clip.start_s)} - {formatTime(clip.end_s)}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* Current time progress indicator */}
                      <div 
                        className="absolute top-0 w-0.5 h-full bg-slate-700 shadow-sm z-10 transition-all duration-300"
                        style={{
                          left: `${Math.min((currentTime / totalVideoDuration) * 100, 100)}%`
                        }}
                      >
                        <div className="absolute -top-2 -left-2 w-4 h-4 bg-slate-700 rounded-full shadow-md flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-4">
                      <Button 
                        className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white shadow-lg"
                        onClick={() => {
                          // Download all clips
                          clips.forEach((clip, index) => {
                            if (clip.videoUrl.startsWith('https://')) {
                              setTimeout(() => {
                                const link = document.createElement('a');
                                link.href = clip.videoUrl;
                                link.download = `Clip_${index + 1}_${clip.concept_title.replace(/[^a-zA-Z0-9]/g, '_')}.mp4`;
                                link.target = '_blank';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }, index * 500); // Stagger downloads
                            }
                          });
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download All Clips
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        onClick={() => {
                          // Copy all clip URLs to clipboard
                          const clipUrls = clips
                            .filter(clip => clip.videoUrl.startsWith('https://'))
                            .map((clip, index) => `${index + 1}. ${clip.concept_title}: ${clip.videoUrl}`)
                            .join('\n');
                          
                          navigator.clipboard.writeText(clipUrls);
                          // You could show a toast notification here
                        }}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Links
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Social Media Export Options */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card className="p-6 bg-white border-slate-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Export for Social Media
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { name: 'TikTok', icon: TrendingUp, aspect: '9:16', color: 'text-pink-600' },
                      { name: 'Instagram', icon: Instagram, aspect: '9:16', color: 'text-purple-600' },
                      { name: 'YouTube', icon: Youtube, aspect: '16:9', color: 'text-red-600' },
                      { name: 'Twitter', icon: Twitter, aspect: '16:9', color: 'text-blue-600' }
                    ].map((platform) => (
                      <Button
                        key={platform.name}
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center space-y-1 hover:bg-slate-50 hover:border-slate-300 border-slate-200"
                      >
                        <platform.icon className={`h-5 w-5 ${platform.color}`} />
                        <span className="text-xs font-medium text-slate-900">{platform.name}</span>
                        <span className="text-xs text-slate-500">{platform.aspect}</span>
                      </Button>
                    ))}
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Clips Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Generated Clips</h2>
                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                  {clips.length} clips
                </Badge>
              </div>

              <div 
                ref={clipsContainerRef}
                className="grid gap-4 max-h-[800px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100"
              >
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
                    <p className="text-slate-600">Loading clips...</p>
                  </div>
                ) : loadError ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                      <p className="text-red-600 font-medium">Failed to load clips</p>
                      <p className="text-red-500 text-sm mt-1">{loadError}</p>
                      <p className="text-slate-600 text-xs mt-2">Check browser console for details</p>
                    </div>
                  </div>
                ) : clips.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                      <p className="text-yellow-600 font-medium">No clips found</p>
                      <p className="text-yellow-500 text-sm mt-1">Unable to load video clips</p>
                    </div>
                  </div>
                ) : (
                  clips.map((clip, index) => (
                    <ClipCard
                      key={clip.index_id}
                      clip={clip}
                      index={index}
                      onSelect={handleClipSelect}
                      isSelected={selectedClip?.index_id === clip.index_id}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}