'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TiltCard } from '@/components/tilt-card';
import { ChatGPTBackground, FloatingOrb } from '@/components/chatgpt-background';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { 
  Zap, 
  Scissors, 
  Share2, 
  TrendingUp, 
  Clock, 
  Sparkles,
  PlayCircle,
  ArrowRight,
  CheckCircle,
  Star,
  Bot,
  Cpu,
  Brain
} from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Bot,
    title: 'Advanced AI Engine',
    description: 'Gemini-powered video analysis for context, emotion, and engagement.',
    color: 'text-emerald-600',
    gradient: 'from-emerald-50 to-cyan-50',
    border: 'border-emerald-200'
  },
  {
    icon: Brain,
    title: 'Neural Clip Detection',
    description: 'Deep learning algorithms identify viral-worthy moments with 95% accuracy.',
    color: 'text-cyan-600',
    gradient: 'from-cyan-50 to-blue-50',
    border: 'border-cyan-200'
  },
  {
    icon: Zap,
    title: 'Lightning Processing',
    description: 'Process hours of content in minutes with our optimized AI infrastructure.',
    color: 'text-amber-600',
    gradient: 'from-amber-50 to-orange-50',
    border: 'border-amber-200'
  },
  {
    icon: TrendingUp,
    title: 'Viral Prediction',
    description: 'Transcribes audio, flags trending keywords, and auto-creates context-rich clips.',
    color: 'text-green-600',
    gradient: 'from-green-50 to-emerald-50',
    border: 'border-green-200'
  },
  {
    icon: Cpu,
    title: 'Multi-Modal Analysis',
    description: 'Analyzes video, audio, and text simultaneously for comprehensive insights.',
    color: 'text-purple-600',
    gradient: 'from-purple-50 to-pink-50',
    border: 'border-purple-200'
  },
  {
    icon: Star,
    title: 'Quality Assurance',
    description: 'Each clip is scored and ranked to ensure only the highest quality content.',
    color: 'text-orange-600',
    gradient: 'from-orange-50 to-red-50',
    border: 'border-orange-200'
  }
];


const stats = [
  // { number: '50M+', label: 'Videos Analyzed', color: 'text-emerald-600' },
  // { number: '2.5M+', label: 'Creators Trust Us', color: 'text-cyan-600' },
  { number: '98.2%', label: 'Accuracy Rate', color: 'text-amber-600' },
  { number: '4.9★', label: 'AI Rating', color: 'text-green-600' }
];

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Prevent hydration mismatches by not rendering animations until mounted
  if (!isMounted) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <ChatGPTBackground />
        <section className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-4 py-2 text-sm text-emerald-700 mb-6 shadow-sm">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Powered by Gemini
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                  <span className="block">Tech That</span>
                  <span className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent block">
                    Understands
                  </span>
                  <span className="block">Your Course Content</span>
                </h1>
                <p className="mt-6 text-xl text-slate-600 leading-8 max-w-2xl">
                  Context-aware editing that goes beyond trimming—captures sentiment, emphasis, and audience pull to shape standout clips.
                </p>
              </div>
              <div className="relative">
                <Image
                  src="/ImageMain.png"
                  alt="StudySlice AI Workflow"
                  width={600}
                  height={400}
                  className="object-contain max-w-full max-h-full rounded-2xl shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* ChatGPT-5 Style Background */}
      <ChatGPTBackground />
      
      {/* Floating Orbs - Enhanced with more dynamic animations */}
      <FloatingOrb className="w-80 h-80 bg-gradient-to-r from-emerald-100/40 to-cyan-100/40 -top-40 -left-40 animate-pulse" delay={0} />
      <FloatingOrb className="w-80 h-80 bg-gradient-to-r from-purple-100/40 to-pink-100/40 -top-40 -right-40 animate-bounce" delay={3} />
      <FloatingOrb className="w-80 h-80 bg-gradient-to-r from-blue-100/40 to-indigo-100/40 top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 animate-spin" delay={6} />
      <FloatingOrb className="w-80 h-80 bg-gradient-to-r from-amber-100/40 to-orange-100/40 bottom-20 right-20 animate-ping" delay={9} />
      <FloatingOrb className="w-60 h-60 bg-gradient-to-r from-rose-100/30 to-red-100/30 top-20 left-1/2 transform -translate-x-1/2 animate-pulse" delay={12} />
      <FloatingOrb className="w-60 h-60 bg-gradient-to-r from-teal-100/30 to-green-100/30 bottom-40 left-10 animate-bounce" delay={15} />

      {/* Hero Section */}
      <section className="relative z-10 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
            {/* Left Column - Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-4 py-2 text-sm text-emerald-700 mb-6 shadow-sm"
              >
                <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                Powered by Gemini
              </motion.div>

             <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
  <span className="block">Tech That</span>
  <span className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent block">
    Understands
  </span>
  <span className="block">Your Course Content</span>
</h1>

              <p className="mt-6 text-xl text-slate-600 leading-8 max-w-2xl">
               Context-aware editing that goes beyond trimming—captures sentiment, emphasis, and audience pull to shape standout clips.
              </p>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="text-lg px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 shadow-lg" asChild>
                  <Link href="/upload">
                    <Bot className="mr-2 h-5 w-5" />
                    Experience The Magic
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-3 border-slate-300 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm"
                >
                  Watch Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              {/* Stats */}
              <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                    className="text-center lg:text-left"
                  >
                    <div className={`text-3xl font-bold ${stat.color}`}>{stat.number}</div>
                    <div className="text-sm text-slate-400 mt-1">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right Column - AI Architecture Visualization */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              {/* Animated corner elements */}
              <motion.div
                className="absolute -top-2 -left-2 w-4 h-4 bg-emerald-400/60 rounded-full blur-sm"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute -top-2 -right-2 w-3 h-3 bg-cyan-400/60 rounded-full blur-sm"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              />
              <motion.div
                className="absolute -bottom-2 -left-2 w-3 h-3 bg-blue-400/60 rounded-full blur-sm"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
              <motion.div
                className="absolute -bottom-2 -right-2 w-4 h-4 bg-purple-400/60 rounded-full blur-sm"
                animate={{
                  scale: [1, 1.6, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
              />

              {/* Floating glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 via-cyan-400/10 to-blue-400/10 rounded-2xl blur-xl"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              {/* Main image with floating animation */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 1, -1, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Image
                  src="/ImageMain.png"
                  alt="StudySlice AI Workflow"
                  width={600}
                  height={400}
                  className="relative z-20 object-contain max-w-full max-h-full rounded-2xl shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 border border-white/20 backdrop-blur-sm"
                  priority
                />
              </motion.div>

              {/* Moving particles around the image */}
              <motion.div
                className="absolute top-1/4 -left-6 w-2 h-2 bg-emerald-300/40 rounded-full"
                animate={{
                  x: [0, 20, 0],
                  y: [0, -15, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute top-1/3 -right-4 w-1.5 h-1.5 bg-cyan-300/40 rounded-full"
                animate={{
                  x: [0, -25, 0],
                  y: [0, 10, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              />
              <motion.div
                className="absolute bottom-1/4 -left-4 w-1 h-1 bg-blue-300/40 rounded-full"
                animate={{
                  x: [0, 15, 0],
                  y: [0, -20, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 2
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mb-4">
              Next-Generation AI Capabilities
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Experience the future of content creation with AI that thinks like a creator.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full bg-white/70 backdrop-blur-md border-white/20 hover:shadow-2xl hover:bg-white/80 transition-all duration-500 hover:border-white/30 hover:scale-105 group relative overflow-hidden">
                  {/* Glassy background effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Animated border glow */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
                  
                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-r ${feature.gradient} mb-4 border ${feature.border} shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300">{feature.title}</h3>
                    <p className="text-slate-600 group-hover:text-slate-700 transition-colors duration-300">{feature.description}</p>
                  </div>
                  
                  {/* Subtle shine effect */}
                  <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-20 transition-opacity duration-700">
                    <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white to-transparent skew-x-12 group-hover:left-[100%] transition-all duration-1000" />
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-slate-50 to-white backdrop-blur-sm border border-slate-200 rounded-3xl p-12 shadow-lg"
          >
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">
              Ready to Transform Your Content?
            </h2>
            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              Join learners who convert course videos into high-signal takeaways—faster reviews, sharper recall, and study time that actually moves the needle.   </p>
            <Button 
              size="lg" 
              className="text-lg px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white border-0 shadow-lg" 
              asChild
            >
              <Link href="/upload">
                <Sparkles className="mr-2 h-5 w-5" />
                Start Creating Magic
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
