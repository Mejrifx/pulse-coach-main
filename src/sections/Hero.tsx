import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { scrollToSection as scrollToAnchor } from '../lib/scrollToSection';
import { ScrollFrameSequence } from '@/components/ScrollFrameSequence';
import {
  TrendingUp,
  Activity,
  Users,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 151;
const FRAME_END = 151;
// Reverse: play from frame 151 down to frame 1
const framePathTemplate = (index: number) => {
  const frameNumber = FRAME_END - index;
  return `/Pulse%20Video%20Frames/ezgif-frame-${String(frameNumber).padStart(3, '0')}.jpg`;
};

type HeroCardData = {
  icon: typeof Activity;
  title: string;
  subtitle: string;
  metric: string;
  depth: number;
  rotateX: number;
  rotateY: number;
  accent: 'emerald' | 'orange' | 'blue' | 'stone';
  floatClass: string;
  drift: {
    from: { x: number; y: number; scale: number };
    to: { x: number; y: number; scale: number; rotateX: number; rotateY: number };
  };
};

const accentStyles = {
  emerald: {
    iconBg: 'bg-emerald-500/15',
    icon: 'text-emerald-400',
    metric: 'text-emerald-400',
  },
  orange: {
    iconBg: 'bg-orange-500/15',
    icon: 'text-orange-400',
    metric: 'text-orange-400',
  },
  blue: {
    iconBg: 'bg-blue-500/15',
    icon: 'text-blue-400',
    metric: 'text-blue-400',
  },
  stone: {
    iconBg: 'bg-stone-500/15',
    icon: 'text-stone-300',
    metric: 'text-stone-200',
  },
} as const;

function HeroCard({
  data,
  className = '',
  compact = false,
}: {
  data: HeroCardData;
  className?: string;
  compact?: boolean;
}) {
  const Icon = data.icon;
  const a = accentStyles[data.accent];
  return (
    <div
      className={`hero-card pointer-events-auto ${className}`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 22, filter: 'blur(10px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{
          duration: 0.9,
          delay: 0.08 + data.depth * 0.0025,
          ease: [0.16, 1, 0.3, 1],
        }}
        style={{
          transformStyle: 'preserve-3d',
          translateZ: data.depth * 0.35,
        }}
      >
        <div
          className={`floating-card border-white/[0.06] bg-neutral-900/50 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.7)] ${
            compact ? 'max-w-none p-3.5 rounded-xl' : 'max-w-[220px] p-4 rounded-2xl'
          } w-full`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${a.iconBg}`}
            >
              <Icon className={`h-4 w-4 ${a.icon}`} strokeWidth={1.75} />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-stone-500">
                {data.title}
              </p>
              <p className="mt-0.5 truncate text-sm font-medium text-stone-100">
                {data.subtitle}
              </p>
              <p
                className={`mt-1 font-mono text-base font-medium tabular-nums tracking-tight ${a.metric}`}
              >
                {data.metric}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const bgGlowRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const frameSequenceRef = useRef<HTMLDivElement>(null);

  const cards: HeroCardData[] = [
    {
      icon: Activity,
      title: 'Roster',
      subtitle: 'Active athletes',
      metric: '12 live',
      depth: 72,
      rotateX: 5,
      rotateY: -10,
      accent: 'emerald',
      floatClass:
        'left-[2%] top-[11%] sm:left-[3%] sm:top-[10%] md:left-[4%] md:top-[9%] lg:left-[5%] w-[min(40vw,200px)] -rotate-2',
      drift: {
        from: { x: 44, y: 34, scale: 0.94 },
        to: { x: -102, y: -86, scale: 1.02, rotateX: -4, rotateY: 14 },
      },
    },
    {
      icon: TrendingUp,
      title: 'Load',
      subtitle: 'Week over week',
      metric: '+18%',
      depth: 56,
      rotateX: -4,
      rotateY: 12,
      accent: 'orange',
      floatClass:
        'right-[2%] top-[13%] sm:right-[2%] md:right-[3%] md:top-[11%] lg:right-[5%] lg:top-[10%] w-[min(40vw,200px)] rotate-2',
      drift: {
        from: { x: -42, y: 32, scale: 0.94 },
        to: { x: 106, y: -78, scale: 1.02, rotateX: 5, rotateY: -12 },
      },
    },
    {
      icon: Users,
      title: 'Retention',
      subtitle: '90-day cohort',
      metric: '94%',
      depth: 80,
      rotateX: -5,
      rotateY: 10,
      accent: 'blue',
      floatClass:
        'left-[2%] bottom-[12%] sm:left-[3%] sm:bottom-[11%] md:left-[4%] md:bottom-[10%] lg:left-[6%] lg:bottom-[9%] w-[min(40vw,200px)] -rotate-2',
      drift: {
        from: { x: 38, y: -28, scale: 0.94 },
        to: { x: -94, y: 82, scale: 1.02, rotateX: 6, rotateY: -14 },
      },
    },
    {
      icon: CheckCircle2,
      title: 'Check-ins',
      subtitle: 'Due today',
      metric: '3 done',
      depth: 48,
      rotateX: 4,
      rotateY: -12,
      accent: 'stone',
      floatClass:
        'right-[2%] bottom-[10%] sm:right-[2%] sm:bottom-[9%] md:right-[4%] md:bottom-[8%] lg:right-[6%] lg:bottom-[7%] w-[min(40vw,200px)] rotate-2',
      drift: {
        from: { x: -34, y: -26, scale: 0.94 },
        to: { x: 98, y: 78, scale: 1.02, rotateX: -5, rotateY: 14 },
      },
    },
  ];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        // Pin the entire hero section during the animation
        const mainTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: '+=600%',
            pin: true,
            scrub: true,
            anticipatePin: 1,
          },
        });

        // Phase 1 (0% → 20%): Fade out original hero content
        mainTimeline.to(
          heroContentRef.current,
          {
            opacity: 0,
            y: -80,
            ease: 'power2.out',
            duration: 0.2,
          },
          0
        );

        // Phase 2 (15% → 100%): Fade in and play frame sequence
        mainTimeline.fromTo(
          frameSequenceRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            ease: 'power1.in',
            duration: 0.15,
          },
          0.15
        );

        // Subtle background effects during animation
        if (bgGlowRef.current) {
          mainTimeline.to(
            bgGlowRef.current,
            {
              scale: 1.2,
              opacity: 0.6,
              ease: 'none',
              duration: 1,
            },
            0
          );
        }
      }, section);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] w-full overflow-hidden bg-neutral-950"
    >
      <div
        ref={bgGlowRef}
        className="pointer-events-none absolute left-1/2 top-1/2 h-[min(85vh,820px)] w-[min(90vw,920px)] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.14)_0%,_transparent_68%)] blur-[100px]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_rgba(255,255,255,0.04)_0%,_transparent_55%)]" />

      {/* Original hero content - fades out on scroll */}
      <div
        ref={heroContentRef}
        className="relative z-10 mx-auto box-border flex min-h-[100dvh] w-full max-w-[1200px] flex-col justify-center section-padding pb-10 pt-24 md:pb-14 md:pt-28"
      >
        <div
          ref={cardsContainerRef}
          className="perspective-container pointer-events-none absolute inset-0 z-[1] hidden md:block"
          style={{ perspective: '1400px' }}
        >
          {cards.map((c) => (
            <HeroCard key={c.title} data={c} className={`absolute z-[1] ${c.floatClass}`} />
          ))}
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-2 text-center sm:px-4">
          <div className="flex w-full flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3.5 py-1.5 backdrop-blur-md"
            >
              <Sparkles className="h-3.5 w-3.5 text-emerald-400/90" strokeWidth={1.75} />
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-stone-400">
                Pulse for coaches
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="mb-3 h-px w-12 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"
              aria-hidden
            />

            <h1
              ref={headlineRef}
              className="text-balance font-medium tracking-[-0.04em] text-stone-50"
            >
              <span className="block text-[2.75rem] leading-[1.05] sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-7xl">
                Where precision
              </span>
              <span className="mt-2 block bg-gradient-to-b from-stone-100 to-stone-400 bg-clip-text text-[2.75rem] leading-[1.05] text-transparent sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-7xl">
                meets scale.
              </span>
            </h1>

            <motion.p
              ref={subheadlineRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 max-w-md text-pretty text-[17px] leading-relaxed text-stone-400 md:max-w-lg md:text-lg"
            >
              One calm workspace for programs, progress, and proof — so you coach
              with clarity, not chaos.
            </motion.p>

            <motion.div
              ref={ctaRef}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex w-full max-w-sm flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4"
            >
              <button
                type="button"
                onClick={() => scrollToAnchor('#pricing')}
                className="inline-flex h-12 min-h-[44px] items-center justify-center gap-2 rounded-full bg-emerald-500 px-7 text-[15px] font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset,0_8px_32px_-8px_rgba(16,185,129,0.45)] transition-transform duration-200 hover:bg-emerald-400 active:scale-[0.98] outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300"
              >
                Start free trial
                <ArrowRight className="h-4 w-4 opacity-90" aria-hidden strokeWidth={2} />
              </button>
              <button
                type="button"
                onClick={() => scrollToAnchor('#platform')}
                className="inline-flex h-12 min-h-[44px] items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.03] px-7 text-[15px] font-medium text-stone-200 backdrop-blur-sm transition-colors hover:border-white/[0.2] hover:bg-white/[0.06] outline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-stone-200"
              >
                Watch film
              </button>
            </motion.div>
          </div>

          {/* Mobile: compact grid under CTAs */}
          <div className="relative z-[2] mt-8 grid w-full max-w-md grid-cols-2 gap-3 sm:max-w-lg md:hidden">
            {cards.map((c) => (
              <HeroCard key={c.title} data={c} compact />
            ))}
          </div>
        </div>
      </div>

      {/* Frame sequence video reveal - overlays on top */}
      <div
        ref={frameSequenceRef}
        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center opacity-0"
        style={{ willChange: 'opacity' }}
      >
        <ScrollFrameSequence
          frameCount={FRAME_COUNT}
          framePathTemplate={framePathTemplate}
          className="h-full w-full"
          startTrigger="top top"
          endTrigger="+=600%"
        />
      </div>
    </section>
  );
};

export default Hero;
