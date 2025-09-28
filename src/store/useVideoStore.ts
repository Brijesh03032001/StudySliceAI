import { create } from 'zustand';

export interface VideoClip {
  id: string;
  title: string;
  startTime: number;
  endTime: number;
  duration: number;
  thumbnailUrl: string;
  videoUrl: string;
  description: string;
  engagement: {
    likes: number;
    shares: number;
    views: number;
  };
}

interface VideoState {
  // Upload state
  uploadedFile: File | null;
  uploadProgress: number;
  isUploading: boolean;
  isProcessing: boolean;
  
  // Video data
  originalVideoUrl: string | null;
  videoDuration: number;
  clips: VideoClip[];
  
  // UI state
  selectedClip: VideoClip | null;
  currentTime: number;
  
  // Actions
  setUploadedFile: (file: File | null) => void;
  setUploadProgress: (progress: number) => void;
  setIsUploading: (uploading: boolean) => void;
  setIsProcessing: (processing: boolean) => void;
  setOriginalVideoUrl: (url: string) => void;
  setVideoDuration: (duration: number) => void;
  setClips: (clips: VideoClip[]) => void;
  setSelectedClip: (clip: VideoClip | null) => void;
  setCurrentTime: (time: number) => void;
  reset: () => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  // Initial state
  uploadedFile: null,
  uploadProgress: 0,
  isUploading: false,
  isProcessing: false,
  originalVideoUrl: null,
  videoDuration: 0,
  clips: [],
  selectedClip: null,
  currentTime: 0,

  // Actions
  setUploadedFile: (file) => set({ uploadedFile: file }),
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  setIsUploading: (uploading) => set({ isUploading: uploading }),
  setIsProcessing: (processing) => set({ isProcessing: processing }),
  setOriginalVideoUrl: (url) => set({ originalVideoUrl: url }),
  setVideoDuration: (duration) => set({ videoDuration: duration }),
  setClips: (clips) => set({ clips }),
  setSelectedClip: (clip) => set({ selectedClip: clip }),
  setCurrentTime: (time) => set({ currentTime: time }),
  reset: () => set({
    uploadedFile: null,
    uploadProgress: 0,
    isUploading: false,
    isProcessing: false,
    originalVideoUrl: null,
    videoDuration: 0,
    clips: [],
    selectedClip: null,
    currentTime: 0,
  }),
}));