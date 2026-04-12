import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { accentIcon, type AccentKey } from '../lib/accentStyles';
import {
  Users,
  LineChart,
  Calendar,
  FileText,
  Bell,
  Shield,
  Zap,
  Target,
  type LucideIcon,
} from 'lucide-react';

type FeatureDef = {
  icon: LucideIcon;
  title: string;
  description: string;
  size: 'small' | 'medium' | 'large';
  depth: number;
  color: AccentKey;
};

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  size: 'small' | 'medium' | 'large';
  depth: number;
  color: AccentKey;
  index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  size,
  depth,
  color,
  index,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness: 150, damping: 15 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) / (rect.width / 2));
    mouseY.set((e.clientY - centerY) / (rect.height / 2));
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const sizeClasses = {
    small: 'md:col-span-1 md:row-span-1',
    medium: 'md:col-span-1 md:row-span-2',
    large: 'md:col-span-2 md:row-span-1',
  };

  return (
    <motion.div
      ref={cardRef}
      className={`feature-card ${sizeClasses[size]}`}
      style={{
        transformStyle: 'preserve-3d',
        translateZ: depth,
      }}
      initial={{ opacity: 0, y: 50, rotateX: 15 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="floating-card h-full p-6 flex flex-col"
        style={{
          rotateX,
          rotateY,
        }}
      >
        <div
          className={`w-12 h-12 rounded-xl ${accentIcon[color].bg} flex items-center justify-center mb-4`}
        >
          <Icon className={`w-6 h-6 ${accentIcon[color].text}`} />
        </div>
        <h3 className="text-lg font-bold text-stone-100 mb-2">{title}</h3>
        <p className="text-sm text-stone-400 leading-relaxed flex-1">
          {description}
        </p>
      </motion.div>
    </motion.div>
  );
};

const Features: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const features: FeatureDef[] = [
    {
      icon: Users,
      title: 'Client Management',
      description:
        'Centralize all client data, progress photos, and communication in one powerful dashboard.',
      size: 'large' as const,
      depth: 80,
      color: 'emerald',
    },
    {
      icon: LineChart,
      title: 'Advanced Analytics',
      description:
        'Track strength gains, body composition changes, and adherence metrics with precision.',
      size: 'medium' as const,
      depth: 120,
      color: 'orange',
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description:
        'Automated workout scheduling with intelligent deload recommendations.',
      size: 'small' as const,
      depth: 60,
      color: 'blue',
    },
    {
      icon: FileText,
      title: 'Program Builder',
      description:
        'Drag-and-drop program creation with exercise video library integration.',
      size: 'small' as const,
      depth: 100,
      color: 'emerald',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description:
        'Automated reminders and celebration messages to keep clients engaged.',
      size: 'medium' as const,
      depth: 40,
      color: 'orange',
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description:
        'Bank-level encryption and HIPAA-compliant data handling for peace of mind.',
      size: 'large' as const,
      depth: 90,
      color: 'blue',
    },
    {
      icon: Zap,
      title: 'Quick Actions',
      description:
        'One-click workout logging and instant program adjustments on the fly.',
      size: 'small' as const,
      depth: 70,
      color: 'emerald',
    },
    {
      icon: Target,
      title: 'Goal Tracking',
      description:
        'Set milestones, track progress, and celebrate wins with visual goal maps.',
      size: 'small' as const,
      depth: 110,
      color: 'orange',
    },
   ];

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative w-full bg-neutral-950 py-32"
    >
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] rounded-full bg-emerald-600/10 blur-[150px] pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      <div className="w-full section-padding">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/60 border border-stone-800 mb-6"
          >
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">
              Features
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-stone-100 mb-6"
          >
            Everything you need.
            <br />
            <span className="text-gradient-emerald">Nothing you don&apos;t.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-stone-400 leading-relaxed"
          >
            Pulse is built by coaches, for coaches. Every feature is designed to
            save you time and help your clients achieve extraordinary results.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <div className="perspective-container max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-4 gap-4 md:gap-6 auto-rows-min">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                {...feature}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
