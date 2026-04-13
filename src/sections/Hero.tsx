import React, { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Activity,
  Users,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

type HeroCardData = {
  icon: typeof Activity;
  title: string;
  subtitle: string;
  metric: string;
  depth: number;
  rotateX: number;
  rotateY: number;
  accent: 'emerald' | 'orange' | 'blue' | 'stone';
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

function useXlSidebar() {
  const [xl, setXl] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1280px)').matches,
  );

  useLayoutEffect(() => {
    const mq = window.matchMedia('(min-width: 1280px)');
    const apply = () => setXl(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  return xl;
}

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
    <motion.div
      className={`hero-card ${className}`}
      initial={{ opacity: 0, y: 28, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{
        duration: 0.85,
        delay: data.depth * 0.004,
        ease: [0.16, 1, 0.3, 1],
      }}
      style={{
        transformStyle: 'preserve-3d',
        translateZ: data.depth,
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
            <p className={`mt-1 font-mono text-base font-medium tabular-nums tracking-tight ${a.metric}`}>
              {data.metric}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const Hero: React.FC = () => {
  const xlSidebar = useXlSidebar();
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const bgGlowRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const cards: HeroCardData[] = [
    {
      icon: Activity,
      title: 'Roster',
      subtitle: 'Active athletes',
      metric: '12 live',
      depth: 72,
      rotateX: 4,
      rotateY: -8,
      accent: 'emerald',
    },
    {
      icon: TrendingUp,
      title: 'Load',
      subtitle: 'Week over week',
      metric: '+18%',
      depth: 48,
      rotateX: -3,
      rotateY: 6,
      accent: 'orange',
    },
    {
      icon: Users,
      title: 'Retention',
      subtitle: '90-day cohort',
      metric: '94%',
      depth: 88,
      rotateX: 5,
      rotateY: 8,
      accent: 'blue',
    },
    {
      icon: CheckCircle2,
      title: 'Check-ins',
      subtitle: 'Due today',
      metric: '3 done',
      depth: 40,
      rotateX: -4,
      rotateY: -6,
      accent: 'stone',
    },
  ];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const scrollEnd = '+=128%';
        const scrubBase = {
          trigger: section,
          start: 'top top',
          end: scrollEnd,
        };

        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: scrollEnd,
          pin: true,
          pinSpacing: true,
        });

        if (bgGlowRef.current) {
          gsap.fromTo(
            bgGlowRef.current,
            { yPercent: -18, scale: 1 },
            {
              yPercent: 20,
              scale: 1.1,
              ease: 'none',
              scrollTrigger: { ...scrubBase, scrub: 0.55 },
            }
          );
        }

        if (headlineRef.current) {
          gsap.fromTo(
            headlineRef.current,
            { y: 0, opacity: 1 },
            {
              y: -140,
              opacity: 0.2,
              ease: 'none',
              scrollTrigger: { ...scrubBase, scrub: 0.55 },
            }
          );
        }

        if (subheadlineRef.current) {
          gsap.fromTo(
            subheadlineRef.current,
            { y: 0, opacity: 1 },
            {
              y: -100,
              opacity: 0.15,
              ease: 'none',
              scrollTrigger: { ...scrubBase, scrub: 0.68 },
            }
          );
        }

        if (ctaRef.current) {
          gsap.fromTo(
            ctaRef.current,
            { y: 0, opacity: 1 },
            {
              y: -64,
              opacity: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top top',
                end: '+=72%',
                scrub: 0.45,
              },
            }
          );
        }

        const cardElements = cardsContainerRef.current?.querySelectorAll('.hero-card');
        cardElements?.forEach((card, i) => {
          const cardData = cards[i];
          if (!cardData) return;
          gsap.fromTo(
            card,
            {
              y: 40 + i * 24,
              rotateX: cardData.rotateX,
              rotateY: cardData.rotateY,
            },
            {
              y: -56 - i * 18,
              rotateX: -cardData.rotateX * 0.8,
              rotateY: -cardData.rotateY + 5,
              ease: 'none',
              scrollTrigger: { ...scrubBase, scrub: 0.58 + i * 0.05 },
            }
          );
        });
      }, section);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-neutral-950"
    >
      {/* Ambient light — softer, more “pro” than loud gradients */}
      <div
        ref={bgGlowRef}
        className="pointer-events-none absolute left-1/2 top-[42%] h-[min(85vh,820px)] w-[min(90vw,920px)] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.14)_0%,_transparent_68%)] blur-[100px]"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_rgba(255,255,255,0.04)_0%,_transparent_55%)]" />

           <div className="relative z-10 mx-auto flex min-h-screen max-w-[1200px] flex-col justify-center section-padding pt-28 pb-16 md:pt-32">
        <div
          ref={cardsContainerRef}
          className="relative flex flex-col items-stretch gap-12 xl:flex-row xl:items-center xl:justify-center xl:gap-8 2xl:gap-10"
        >
          {xlSidebar ? (
            <div className="flex w-[min(100%,200px)] shrink-0 flex-col items-end justify-center gap-5 pr-1 xl:order-1">
              <HeroCard data={cards[0]} />
              <HeroCard data={cards[1]} />
            </div>
          ) : null}

          {/* Center — typographic lockup; mobile: order-1, xl: between side rails */}
          <div className="order-1 flex flex-1 flex-col items-center text-center xl:order-2 xl:max-w-[36rem] xl:flex-none">
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
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-500 px-7 text-[15px] font-semibold text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)_inset,0_8px_32px_-8px_rgba(16,185,129,0.45)] transition-transform duration-200 hover:bg-emerald-400 active:scale-[0.98]"
              >
                Start free trial
                <ArrowRight className="h-4 w-4 opacity-90" strokeWidth={2} />
              </button>
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.03] px-7 text-[15px] font-medium text-stone-200 backdrop-blur-sm transition-colors hover:border-white/[0.2] hover:bg-white/[0.06]"
              >
                Watch film
              </button>
            </motion.div>
          </div>

          {xlSidebar ? (
            <div className="flex w-[min(100%,200px)] shrink-0 flex-col items-start justify-center gap-5 pl-1 xl:order-3">
              <HeroCard data={cards[2]} />
              <HeroCard data={cards[3]} />
            </div>
          ) : (
            <div className="order-2 mx-auto grid w-full max-w-md grid-cols-2 gap-3 sm:max-w-lg">
              {cards.map((c) => (
                <HeroCard key={c.title} data={c} compact />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;
