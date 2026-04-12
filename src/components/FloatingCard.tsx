import React, { useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface FloatingCardProps {
  children: React.ReactNode;
  depth?: number;
  rotateX?: number;
  rotateY?: number;
  floatSpeed?: 'slow' | 'normal' | 'fast';
  mouseParallax?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const FloatingCard: React.FC<FloatingCardProps> = ({
  children,
  depth = 0,
  rotateX = 0,
  rotateY = 0,
  floatSpeed = 'normal',
  mouseParallax = true,
  className = '',
  style = {},
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animation for mouse following
  const springConfig = { stiffness: 150, damping: 15 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Transform mouse position to rotation (max ±10 degrees)
  const rotateXFromMouse = useTransform(smoothMouseY, [-0.5, 0.5], [10, -10]);
  const rotateYFromMouse = useTransform(smoothMouseX, [-0.5, 0.5], [-10, 10]);

  // Float animation duration based on speed
  const floatDuration = {
    slow: 8,
    normal: 6,
    fast: 4,
  }[floatSpeed];

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!cardRef.current || !mouseParallax) return;

      const rect = cardRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalize mouse position relative to card center (-0.5 to 0.5)
      const normalizedX = (e.clientX - centerX) / (window.innerWidth / 2);
      const normalizedY = (e.clientY - centerY) / (window.innerHeight / 2);

      mouseX.set(normalizedX);
      mouseY.set(normalizedY);
    },
    [mouseParallax, mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (!mouseParallax) return;

    // Throttled mouse move handler using requestAnimationFrame
    let rafId: number;
    let lastEvent: MouseEvent | null = null;

    const throttledHandler = (e: MouseEvent) => {
      lastEvent = e;
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        if (lastEvent) {
          handleMouseMove(lastEvent);
        }
        rafId = 0;
      });
    };

    window.addEventListener('mousemove', throttledHandler, { passive: true });

    return () => {
      window.removeEventListener('mousemove', throttledHandler);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [handleMouseMove, mouseParallax]);

  return (
    <motion.div
      ref={cardRef}
      className={`floating-card gpu-layer ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        translateZ: depth,
        rotateX: mouseParallax ? rotateXFromMouse : rotateX,
        rotateY: mouseParallax ? rotateYFromMouse : rotateY,
        ...style,
      }}
      initial={{
        opacity: 0,
        y: 50,
      }}
      animate={{
        y: [0, -20, 0],
        opacity: 1,
      }}
      transition={{
        y: {
          duration: floatDuration,
          repeat: Infinity,
          ease: 'easeInOut',
        },
        opacity: { duration: 0.6, ease: 'easeOut' },
      }}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
};

export default FloatingCard;
