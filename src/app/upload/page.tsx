'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChatGPTBackground, FloatingOrb } from '@/components/chatgpt-background';
import {
  Upload,
  FileVideo,
  AlertCircle,
  CheckCircle,
  Play,
  X,
  Zap,
  Clock,
  Sparkles
} from 'lucide-react';

const ACCEPTED_FORMATS = {
  'video/mp4': ['.mp4'],
  'video/quicktime': ['.mov'],
  'video/x-msvideo': ['.avi'],
  'video/webm': ['.webm'],
};

const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB

export default function UploadPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);
    
    if (rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      if (rejection.file.size > MAX_FILE_SIZE) {
        setError('File size must be less than 500MB');
      } else {
        setError('Please upload a valid video file (.mp4, .mov, .avi, .webm)');
      }
      return;
    }

    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FORMATS,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled: isUploading || isProcessing
  });

  const handleUpload = async () => {
    if (!uploadedFile) return;
    
    setIsUploading(true);
    setError(null);
    let progressInterval: NodeJS.Timeout | null = null;
    
    try {
      // Step 1: Get presigned URL from your API
      console.log('Step 1: Getting presigned URL...');
      setUploadProgress(10);
      
      const presignedResponse = await fetch('http://98.84.193.189:5000/upload', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          filename: uploadedFile.name
        })
      });

      if (!presignedResponse.ok) {
        if (presignedResponse.status === 0) {
          throw new Error('CORS Error: Unable to connect to the server. Please check if the server allows cross-origin requests.');
        }
        throw new Error(`Failed to get presigned URL: ${presignedResponse.status} ${presignedResponse.statusText}`);
      }

      const presignedData = await presignedResponse.json();
      console.log('Presigned URL response:', presignedData);
      
      const { presigned_url, bucket, key, expires_in } = presignedData;
      
      if (!presigned_url) {
        throw new Error('No presigned URL received from server');
      }

      // Step 2: Upload file to S3 using presigned URL
      console.log('Step 2: Uploading file to S3...');
      setUploadProgress(30);

      // Start progress simulation for upload
      progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return prev;
          return prev + 5;
        });
      }, 300);

      // Upload file to S3
      const s3Response = await fetch(presigned_url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: uploadedFile
      });

      if (progressInterval) clearInterval(progressInterval);

      if (!s3Response.ok) {
        throw new Error(`S3 upload failed: ${s3Response.status} ${s3Response.statusText}`);
      }

      console.log('File uploaded successfully to S3');
      
      // Complete the progress bar
      setUploadProgress(100);
      setIsUploading(false);
      setIsProcessing(true);
      
      // Store the video URL and upload info in sessionStorage
      if (previewUrl) {
        sessionStorage.setItem('uploadedVideoUrl', previewUrl);
        sessionStorage.setItem('uploadedFileName', uploadedFile.name);
        sessionStorage.setItem('uploadedFileSize', uploadedFile.size.toString());
        sessionStorage.setItem('s3Info', JSON.stringify({
          bucket,
          key,
          expires_in,
          upload_time: new Date().toISOString(),
          s3_url: presigned_url.split('?')[0] // Clean S3 URL without query params
        }));
      }
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to results page
      router.push('/results');
      
    } catch (err) {
      console.error('Upload error:', err);
      
      // Clear any running intervals
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      
      // Handle specific errors
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Network Error: Unable to connect to the server. This could be a CORS issue or the server might be down.\n\nTry the demo mode below to test the application.');
        
        // Auto-fallback to demo mode after 3 seconds
        setTimeout(() => {
          handleDemoUpload();
        }, 3000);
      } else {
        setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
      }
      
      setIsUploading(false);
      setIsProcessing(false);
      setUploadProgress(0);
    }
  };

  // Demo upload function for testing when CORS fails
  const handleDemoUpload = async () => {
    if (!uploadedFile) return;
    
    setIsUploading(true);
    setError('Using demo mode - simulating API response...');
    
    try {
      // Simulate API response
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise(resolve => setTimeout(resolve, 150));
      }
      
      setIsUploading(false);
      setIsProcessing(true);
      
      // Store demo data
      if (previewUrl) {
        sessionStorage.setItem('uploadedVideoUrl', previewUrl);
        sessionStorage.setItem('uploadedFileName', uploadedFile.name);
        sessionStorage.setItem('uploadedFileSize', uploadedFile.size.toString());
        sessionStorage.setItem('apiResponse', JSON.stringify({
          status: 'success',
          message: 'Demo upload completed',
          filename: uploadedFile.name,
          demo_mode: true
        }));
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      router.push('/results');
      
    } catch (err) {
      setError('Demo upload failed. Please refresh and try again.');
      setIsUploading(false);
      setIsProcessing(false);
    }
  };

  const handleRemove = () => {
    setUploadedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    setError(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* ChatGPT-5 Light Background */}
      <ChatGPTBackground />
      
      {/* Floating Orbs */}
      <FloatingOrb className="w-80 h-80 bg-gradient-to-r from-emerald-100/40 to-cyan-100/40 -top-40 -right-40" delay={0} />
      <FloatingOrb className="w-72 h-72 bg-gradient-to-r from-blue-100/40 to-purple-100/40 top-1/3 -left-36" delay={5} />

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-4 py-2 text-sm text-emerald-700 mb-6 shadow-sm">
              <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
              AI-Powered Video Analysis
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
              Upload Your Video
            </h1>
            <p className="text-xl text-slate-600">
              Upload your long-form video and let our AI create engaging short clips
            </p>
          </motion.div>

          <div className="space-y-8">
            {/* Upload Area */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="p-8 bg-white border-slate-200 shadow-lg">
                {!uploadedFile ? (
                  <div
                    {...getRootProps()}
                    className={`
                      border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all duration-300
                      ${isDragActive 
                        ? 'border-emerald-400 bg-emerald-50' 
                        : 'border-slate-300 hover:border-emerald-300 hover:bg-slate-50'
                      }
                      ${(isUploading || isProcessing) ? 'pointer-events-none opacity-50' : ''}
                    `}
                  >
                    <input {...getInputProps()} />
                    
                    <motion.div
                      animate={isDragActive ? { scale: 1.05 } : { scale: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Upload 
                        className={`mx-auto h-16 w-16 mb-4 ${
                          isDragActive ? 'text-emerald-500' : 'text-slate-400'
                        }`} 
                      />
                      
                      <h3 className="text-xl font-medium text-slate-900 mb-2">
                        {isDragActive ? 'Drop your video here' : 'Drag & drop your video'}
                      </h3>
                      
                      <p className="text-slate-600 mb-4">
                        or <span className="text-emerald-600 font-medium">browse files</span>
                      </p>
                      
                      <div className="flex flex-wrap justify-center gap-2 mb-4">
                        {['MP4', 'MOV', 'AVI', 'WEBM'].map((format) => (
                          <Badge key={format} variant="secondary" className="text-xs bg-slate-100 text-slate-600">
                            {format}
                          </Badge>
                        ))}
                      </div>
                      
                      <p className="text-sm text-slate-500">
                        Maximum file size: 500MB
                      </p>
                    </motion.div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-6"
                  >
                    {/* File Info */}
                    <div className="flex items-start justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-start space-x-3">
                        <FileVideo className="h-10 w-10 text-emerald-500 mt-1" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-slate-900 truncate">
                            {uploadedFile.name}
                          </h4>
                          <p className="text-sm text-slate-500">
                            {formatFileSize(uploadedFile.size)}
                          </p>
                        </div>
                      </div>
                      
                      {!isUploading && !isProcessing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRemove}
                          className="text-slate-500 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Preview */}
                    {previewUrl && (
                      <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden border border-slate-200">
                        <video
                          src={previewUrl}
                          controls
                          className="w-full h-full object-contain"
                          preload="metadata"
                        />
                      </div>
                    )}

                    {/* Upload Progress */}
                    <AnimatePresence>
                      {(isUploading || isProcessing) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="space-y-4"
                        >
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">
                              {isUploading ? (
                                uploadProgress < 30 ? 'Getting upload URL...' : 'Uploading to cloud storage...'
                              ) : 'Processing with AI...'}
                            </span>
                            <span className="text-slate-900 font-medium">
                              {isUploading ? `${uploadProgress}%` : 'Analyzing video...'}
                            </span>
                          </div>
                          
                          <Progress 
                            value={isUploading ? uploadProgress : undefined} 
                            className="w-full"
                          />
                          
                          {isUploading && (
                            <div className="flex items-center space-x-2 text-xs text-slate-500">
                              {uploadProgress < 30 ? (
                                <>
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                                  <span>Step 1: Requesting presigned upload URL...</span>
                                </>
                              ) : (
                                <>
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                                  <span>Step 2: Uploading {uploadedFile?.name} to S3...</span>
                                </>
                              )}
                            </div>
                          )}
                          
                          {isProcessing && (
                            <div className="flex items-center space-x-2 text-sm text-emerald-600">
                              <Sparkles className="h-4 w-4 animate-spin" />
                              <span>AI is identifying the best moments in your video...</span>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Error Message */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.3 }}
                          className="p-4 bg-red-50 border border-red-200 rounded-lg"
                        >
                          <div className="flex items-start space-x-3">
                            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <h4 className="font-medium text-red-800 mb-1">Upload Error</h4>
                              <div className="text-sm text-red-700 whitespace-pre-line">
                                {error}
                              </div>
                              {error.includes('CORS') && (
                                <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                                  💡 <strong>Quick Fix:</strong> Try the "Demo Mode" button below to test the application!
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Upload Button */}
                    {!isUploading && !isProcessing && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="space-y-3"
                      >
                        <Button
                          size="lg"
                          onClick={handleUpload}
                          className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white text-lg py-3 shadow-lg"
                        >
                          <Zap className="mr-2 h-5 w-5" />
                          Generate Smart Clips
                        </Button>
                        
                        <div className="text-center">
                          <p className="text-xs text-slate-500 mb-2">
                            Having connection issues?
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleDemoUpload}
                            className="text-slate-600 border-slate-300 hover:bg-slate-50"
                          >
                            <Play className="mr-2 h-4 w-4" />
                            Try Demo Mode
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </Card>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid gap-6 md:grid-cols-3"
            >
              <Card className="p-6 text-center bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <Zap className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
                <h3 className="font-medium text-slate-900 mb-2">AI-Powered Analysis</h3>
                <p className="text-sm text-slate-600">
                  Advanced algorithms detect engaging moments, trending topics, and optimal clip points
                </p>
              </Card>
              
              <Card className="p-6 text-center bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <Clock className="h-8 w-8 text-cyan-500 mx-auto mb-3" />
                <h3 className="font-medium text-slate-900 mb-2">Lightning Fast</h3>
                <p className="text-sm text-slate-600">
                  Get your clips ready in minutes, not hours of manual editing
                </p>
              </Card>
              
              <Card className="p-6 text-center bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-3" />
                <h3 className="font-medium text-slate-900 mb-2">Professional Quality</h3>
                <p className="text-sm text-slate-600">
                  Export-ready clips optimized for every social media platform
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}