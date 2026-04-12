import React, { useRef, useLayoutEffect } from 'react';
import { accentIcon, type AccentKey } from '../lib/accentStyles';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Users,
  Trophy,
  Activity,
  TrendingUp,
  Target,
  type LucideIcon,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const HorizontalShowcase: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const bgTextRef = useRef<HTMLDivElement>(null);

  const showcaseItems: {
    icon: LucideIcon;
    title: string;
    description: string;
    stat: string;
    statLabel: string;
    color: AccentKey;
    depth: number;
  }[] = [
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description:
        'Deep-dive into every metric that matters. Track strength curves, volume progression, and recovery indicators.',
      stat: '47%',
      statLabel: 'Better Results',
      color: 'emerald',
      depth: 80,
    },
    {
      icon: Users,
      title: 'Client Network',
      description:
        'Build stronger relationships with automated check-ins, progress celebrations, and seamless communication.',
      stat: '12K+',
      statLabel: 'Active Clients',
      color: 'orange',
      depth: 120,
    },
    {
      icon: Trophy,
      title: 'Achievement System',
      description:
        'Gamify the journey with badges, streaks, and milestone rewards that keep clients motivated.',
      stat: '89%',
      statLabel: 'Retention Rate',
      color: 'blue',
      depth: 60,
    },
    {
      icon: Activity,
      title: 'Real-time Monitoring',
      description:
        'Live workout tracking with form feedback, rest timers, and instant program adjustments.',
      stat: '24/7',
      statLabel: 'Monitoring',
      color: 'emerald',
      depth: 100,
    },
    {
      icon: TrendingUp,
      title: 'Growth Insights',
      description:
        'AI-powered recommendations to optimize training variables and break through plateaus.',
      stat: '3.2x',
      statLabel: 'Faster Gains',
      color: 'orange',
      depth: 40,
    },
    {
      icon: Target,
      title: 'Goal Mapping',
      description:
        'Visual roadmaps from current state to dream physique with milestone tracking.',
      stat: '94%',
      statLabel: 'Goal Achievement',
      color: 'blue',
      depth: 90,
    },
  ];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const container = containerRef.current;
    if (!section || !track || !container) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        const scrollDistance = () =>
          Math.max(0, track.scrollWidth - container.offsetWidth);

        const scrollTween = gsap.to(track, {
          x: () => -scrollDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${scrollDistance() * 1.32}`,
            pin: true,
            scrub: 0.62,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        const bgText = bgTextRef.current;
        if (bgText) {
          gsap.to(bgText, {
            x: () => -scrollDistance() * 0.26,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () => `+=${scrollDistance() * 1.32}`,
              scrub: 0.62,
              invalidateOnRefresh: true,
            },
          });
        }

        const cards = track.querySelectorAll('.showcase-card');
        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { rotateY: 12 },
            {
              rotateY: -12,
              ease: 'none',
              scrollTrigger: {
                trigger: card,
                containerAnimation: scrollTween,
                start: 'left 85%',
                end: 'right 15%',
                scrub: 0.62,
                horizontal: true,
              },
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
      className="relative w-full h-screen bg-neutral-950 overflow-hidden"
    >
      {/* Background text */}
      <div
        ref={bgTextRef}
        className="absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none z-0"
      >
        <span
          className="font-mono text-[15rem] md:text-[20rem] font-bold text-stone-100/[0.03] whitespace-nowrap"
          style={{ letterSpacing: '-0.05em' }}
        >
          PULSE PULSE PULSE
        </span>
      </div>

      {/* Background glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-emerald-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      {/* Container */}
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center overflow-hidden z-10"
      >
        {/* Section Header - Fixed on left */}
        <div className="absolute left-0 top-0 h-full w-full md:w-1/3 flex flex-col justify-center section-padding pointer-events-none z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="pointer-events-auto"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/60 border border-stone-800 mb-6">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">
                The Platform
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-stone-100 mb-6">
              Walk through
              <br />
              <span className="text-gradient-emerald">the experience.</span>
            </h2>

            <p className="text-lg text-stone-400 leading-relaxed max-w-md">
              Scroll to explore how Pulse transforms every aspect of your coaching
              business.
            </p>
          </motion.div>
        </div>

        {/* Horizontal Track */}
        <div
          ref={trackRef}
          className="flex gap-8 pl-[35%] pr-20"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {showcaseItems.map((item, index) => (
            <motion.div
              key={item.title}
              className="showcase-card flex-shrink-0"
              style={{
                transformStyle: 'preserve-3d',
                translateZ: item.depth,
              }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div
                className="floating-card w-[350px] md:w-[400px] h-[500px] p-8 flex flex-col"
                style={{
                  background: `linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 50%), hsl(var(--card))`,
                }}
              >
                {/* Icon */}
                <div
                  className={`w-16 h-16 rounded-2xl ${accentIcon[item.color].bg} flex items-center justify-center mb-6`}
                >
                  <item.icon className={`w-8 h-8 ${accentIcon[item.color].text}`} />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-stone-100 mb-4">
                  {item.title}
                </h3>
                <p className="text-stone-400 leading-relaxed mb-8 flex-1">
                  {item.description}
                </p>

                {/* Stat */}
                <div className="pt-6 border-t border-stone-800">
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`stat-number text-4xl ${accentIcon[item.color].text}`}
                    >
                      {item.stat}
                    </span>
                    <span className="text-sm text-stone-500">{item.statLabel}</span>
                  </div>
                </div>

                {/* Visual decoration */}
                <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10">
                  <div
                    className={`w-full h-full rounded-full blur-3xl ${
                      item.color === 'emerald'
                        ? 'bg-emerald-500'
                        : item.color === 'orange'
                          ? 'bg-orange-500'
                          : 'bg-blue-500'
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 text-stone-500 text-sm">
        <div className="w-8 h-1 bg-stone-800 rounded-full overflow-hidden">
          <div className="w-full h-full bg-emerald-500 animate-pulse" />
        </div>
        <span>Scroll to explore</span>
      </div>
    </section>
  );
};

export default HorizontalShowcase;
