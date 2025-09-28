# SmartClip - AI-Powered Video Clipping Platform

A modern, responsive web application built with Next.js 14 that transforms long-form videos into engaging short clips using AI-powered analysis.

![SmartClip Logo](https://via.placeholder.com/400x200/8B5CF6/FFFFFF?text=SmartClip)

## 🚀 Features

### ✨ Core Functionality
- **AI-Powered Video Analysis**: Automatically identifies the most engaging moments in your videos
- **Smart Clip Generation**: Creates 10 optimized clips from your uploaded content
- **Multi-Platform Export**: Optimized outputs for TikTok, Instagram Reels, YouTube Shorts, and more
- **Interactive Timeline**: Visual timeline showing all generated clips with hover interactions
- **Real-time Preview**: Preview clips before downloading
- **Drag & Drop Upload**: Intuitive file upload with progress tracking

### 🎨 User Experience
- **3D Tilt Effects**: Interactive 3D tilt cards on the homepage
- **Smooth Animations**: Framer Motion-powered transitions and hover effects
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean, professional interface using shadcn/ui components
- **Progress Tracking**: Real-time upload and processing progress indicators

### 🛠 Technical Features
- **TypeScript**: Full type safety throughout the application
- **State Management**: Zustand for efficient global state management
- **File Validation**: Comprehensive file type and size validation
- **Error Handling**: Graceful error handling with user feedback
- **Mock API**: Complete API simulation for demonstration

## 🏗 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **File Upload**: react-dropzone
- **State Management**: Zustand
- **Icons**: Lucide React

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 Usage Guide

### 1. Homepage
- View the landing page with 3D architecture visualization
- Explore features and benefits
- Click "Start Creating Clips" to begin

### 2. Upload Video
- Drag and drop a video file or click to browse
- Supported formats: MP4, MOV, AVI, WEBM
- Maximum file size: 500MB
- Preview your video before processing

### 3. AI Processing
- Watch real-time upload progress
- AI analyzes your video for engaging moments
- Processing typically takes 1-3 minutes

### 4. Review Results
- Browse 10 AI-generated clips
- Interactive timeline showing clip positions
- Hover over clips to see engagement metrics
- Preview clips in the main player
- Download individual clips or export for social media

## 🎯 Key Pages & Features

### Homepage (`/`)
- Hero section with animated 3D architecture
- Feature showcase with hover effects
- Statistics and social proof
- Call-to-action sections

### Upload Page (`/upload`)
- Drag & drop file upload
- File validation and preview
- Progress tracking with animations
- Feature highlights

### Results Page (`/results`)
- Interactive video player
- Timeline visualization of clips
- Grid of 10 hover-interactive clip cards
- Social media export options
- Download functionality

## 🔧 API Endpoints

### Upload Video
```http
POST /api/upload
Content-Type: multipart/form-data
```

### Process Video
```http
POST /api/process
Content-Type: application/json
```

### Get Processing Status
```http
GET /api/process?uploadId={uploadId}
```

## 🌟 Key Features in Detail

### 3D Tilt Effect
- Custom-built tilt component using CSS transforms
- Smooth mouse tracking and perspective effects
- Performance optimized with GPU acceleration

### AI-Powered Clip Generation
- Mock AI analysis with realistic engagement metrics
- 10 different clip types (Hook, Insight, Viral, etc.)
- Engagement predictions and platform recommendations

### Interactive Timeline
- Visual representation of video duration
- Clickable segments for each clip
- Hover effects and selection states

### Responsive Design
- Mobile-first approach
- Optimized for tablets and desktop
- Touch-friendly interactions

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
npx vercel --prod
```

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful component library
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Zustand](https://zustand-demo.pmnd.rs/) - State management
- [Lucide](https://lucide.dev/) - Beautiful icons

---

**Built with ❤️ for SunHacks**
