'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ParticleProps {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
}

const Particle = ({ x, y, size, color, duration }: ParticleProps) => {
  return (
    <motion.div
      className="absolute rounded-full opacity-30"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
      }}
      initial={{ x, y, scale: 0, opacity: 0 }}
      animate={{
        x: [x, x + Math.random() * 200 - 100],
        y: [y, y + Math.random() * 200 - 100],
        scale: [0, 1, 0],
        opacity: [0, 0.3, 0],
      }}
      transition={{
        duration,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "loop",
      }}
    />
  );
};

export function ChatGPTBackground() {
  const [particles, setParticles] = useState<ParticleProps[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: ParticleProps[] = [];
      const colors = [
        '#10b981', // Emerald
        '#06b6d4', // Cyan
        '#3b82f6', // Blue
        '#8b5cf6', // Violet
        '#f59e0b', // Amber
      ];

      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 15 + 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          duration: Math.random() * 25 + 15,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 40000); // Regenerate every 40 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Clean White Background */}
      <div className="absolute inset-0 bg-white" />
      
      {/* Subtle Gradient Overlay - ChatGPT-5 Style */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 100% 100% at 20% -20%, rgba(16, 185, 129, 0.06), transparent),
            radial-gradient(ellipse 100% 100% at 80% 120%, rgba(59, 130, 246, 0.04), transparent),
            radial-gradient(ellipse 100% 100% at 50% 50%, rgba(139, 92, 246, 0.02), transparent)
          `,
        }}
        animate={{
          backgroundPosition: [
            '20% -20%, 80% 120%, 50% 50%',
            '30% -10%, 90% 130%, 60% 60%',
            '10% -30%, 70% 110%, 40% 40%',
            '20% -20%, 80% 120%, 50% 50%',
          ],
        }}
        transition={{
          duration: 30,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Floating Particles - More Subtle */}
      {particles.map((particle) => (
        <Particle key={particle.id} {...particle} />
      ))}

      {/* Very Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16, 185, 129, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16, 185, 129, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Subtle Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}

export function FloatingOrb({ className = "", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-2xl ${className}`}
      animate={{
        x: [0, 80, -40, 0],
        y: [0, -40, 80, 0],
        scale: [1, 1.1, 0.9, 1],
      }}
      transition={{
        duration: 20,
        ease: "easeInOut",
        repeat: Infinity,
        delay,
      }}
    />
  );
}