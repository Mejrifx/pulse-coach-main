import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Dumbbell,
  Apple,
  Camera,
  ArrowRight,
  Activity,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const bgGlowRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const cards = [
    {
      id: 1,
      icon: Activity,
      title: 'Client Dashboard',
      content: '12 Active Clients',
      metric: '94% Retention',
      depth: 100,
      rotateX: 5,
      rotateY: -15,
      position: 'top-left',
      floatSpeed: 'normal' as const,
    },
    {
      id: 2,
      icon: TrendingUp,
      title: 'Workout Stats',
      content: 'This Week',
      metric: '2,847 Lbs',
      depth: 60,
      rotateX: -5,
      rotateY: 15,
      position: 'top-right',
      floatSpeed: 'slow' as const,
    },
    {
      id: 3,
      icon: Apple,
      title: 'Nutrition Tracking',
      content: 'Daily Macros',
      metric: '2,400 kcal',
      depth: 140,
      rotateX: 10,
      rotateY: 0,
      position: 'bottom-left',
      floatSpeed: 'fast' as const,
    },
    {
      id: 4,
      icon: Camera,
      title: 'Progress Photos',
      content: 'Last Updated',
      metric: '2 days ago',
      depth: 40,
      rotateX: -5,
      rotateY: -10,
      position: 'bottom-right',
      floatSpeed: 'normal' as const,
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
            { yPercent: -22, scale: 1 },
            {
              yPercent: 26,
              scale: 1.14,
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
              y: -160,
              opacity: 0.22,
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
              y: -120,
              opacity: 0.18,
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
              y: -72,
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
              y: 56 + i * 40,
              rotateX: cardData.rotateX,
              rotateY: cardData.rotateY,
            },
            {
              y: -72 - i * 28,
              rotateX: -cardData.rotateX * 0.85,
              rotateY: -cardData.rotateY + 9,
              ease: 'none',
              scrollTrigger: { ...scrubBase, scrub: 0.62 + i * 0.06 },
            }
          );
        });
      }, section);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  // Character stagger animation for headline
  const headlineText = 'TRACK. OPTIMIZE. DOMINATE.';
  const characters = headlineText.split('');

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-neutral-950"
    >
      {/* Background glow */}
      <div
        ref={bgGlowRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-emerald-600/20 blur-[150px] pointer-events-none"
      />

      {/* Secondary blue glow */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      {/* Content container */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center section-padding pt-24">
        {/* Main content */}
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900/60 border border-stone-800 mb-8"
          >
            <Dumbbell className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-stone-400">
              Elite Performance Coaching Platform
            </span>
          </motion.div>

          {/* Headline with character stagger */}
          <h1
            ref={headlineRef}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-stone-100 mb-6"
          >
            {characters.map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.4 + index * 0.03,
                  ease: [0.215, 0.61, 0.355, 1],
                }}
                className={char === '.' ? 'text-emerald-500' : ''}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </h1>

          {/* Subheadline */}
          <motion.p
            ref={subheadlineRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-lg md:text-xl text-stone-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            The all-in-one platform for coaches who demand precision.
            Track client progress, optimize training protocols, and dominate
            the fitness industry.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            ref={ctaRef}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="btn-primary flex items-center gap-2 text-base">
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="btn-secondary flex items-center gap-2 text-base">
              Watch Demo
            </button>
          </motion.div>
        </div>

        {/* Floating 3D Cards */}
        <div
          ref={cardsContainerRef}
          className="perspective-container absolute inset-0 pointer-events-none"
        >
          {/* Card 1 - Top Left */}
          <motion.div
            className="hero-card absolute top-[15%] left-[5%] md:left-[10%] pointer-events-auto"
            initial={{ opacity: 0, y: 100, rotateX: 5, rotateY: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            style={{
              transformStyle: 'preserve-3d',
              translateZ: 100,
            }}
          >
            <div className="floating-card p-5 w-48 md:w-56">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-emerald-400" />
                </div>
                <span className="text-sm font-semibold text-stone-100">
                  {cards[0].title}
                </span>
              </div>
              <p className="text-xs text-stone-400 mb-1">{cards[0].content}</p>
              <p className="stat-number text-lg">{cards[0].metric}</p>
            </div>
          </motion.div>

          {/* Card 2 - Top Right */}
          <motion.div
            className="hero-card absolute top-[20%] right-[5%] md:right-[10%] pointer-events-auto"
            initial={{ opacity: 0, y: 100, rotateX: -5, rotateY: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            style={{
              transformStyle: 'preserve-3d',
              translateZ: 60,
            }}
          >
            <div className="floating-card p-5 w-44 md:w-52">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-orange-400" />
                </div>
                <span className="text-sm font-semibold text-stone-100">
                  {cards[1].title}
                </span>
              </div>
              <p className="text-xs text-stone-400 mb-1">{cards[1].content}</p>
              <p className="stat-number text-lg">{cards[1].metric}</p>
            </div>
          </motion.div>

          {/* Card 3 - Bottom Left */}
          <motion.div
            className="hero-card absolute bottom-[20%] left-[8%] md:left-[15%] pointer-events-auto"
            initial={{ opacity: 0, y: 100, rotateX: 10, rotateY: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.6 }}
            style={{
              transformStyle: 'preserve-3d',
              translateZ: 140,
            }}
          >
            <div className="floating-card p-5 w-52 md:w-60">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Apple className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-sm font-semibold text-stone-100">
                  {cards[2].title}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-stone-400 mb-1">{cards[2].content}</p>
                  <p className="stat-number text-lg">{cards[2].metric}</p>
                </div>
                <div className="w-16 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-mono text-emerald-400">On Track</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 4 - Bottom Right */}
          <motion.div
            className="hero-card absolute bottom-[25%] right-[8%] md:right-[12%] pointer-events-auto"
            initial={{ opacity: 0, y: 100, rotateX: -5, rotateY: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            style={{
              transformStyle: 'preserve-3d',
              translateZ: 40,
            }}
          >
            <div className="floating-card p-4 w-40 md:w-48">
              <div className="flex items-center gap-2 mb-2">
                <Camera className="w-4 h-4 text-stone-400" />
                <span className="text-xs font-medium text-stone-400">
                  {cards[3].title}
                </span>
              </div>
              <div className="aspect-square rounded-lg bg-neutral-800 mb-2 overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-neutral-700 to-neutral-800 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/30 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-emerald-400" />
                  </div>
                </div>
              </div>
              <p className="text-xs text-stone-500">{cards[3].metric}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
