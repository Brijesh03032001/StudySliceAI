'use client';

import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  tiltMaxAngleX?: number;
  tiltMaxAngleY?: number;
  perspective?: number;
  scale?: number;
}

export function TiltCard({
  children,
  className = '',
  tiltMaxAngleX = 15,
  tiltMaxAngleY = 15,
  perspective = 1000,
  scale = 1.05,
}: TiltCardProps) {
  const [transform, setTransform] = useState('');
  const itemRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setTransform(`perspective(${perspective}px)`);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!itemRef.current) return;

    const { left, top, width, height } = itemRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;

    const angleX = (0.5 - y) * tiltMaxAngleX;
    const angleY = (x - 0.5) * tiltMaxAngleY;

    setTransform(
      `perspective(${perspective}px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale3d(${scale}, ${scale}, ${scale})`
    );
  };

  const handleMouseLeave = () => {
    setTransform(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`);
  };

  return (
    <motion.div
      ref={itemRef}
      className={`${className} transform-gpu transition-transform duration-200 ease-out`}
      style={{ transform }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ transform: `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)` }}
    >
      {children}
    </motion.div>
  );
}