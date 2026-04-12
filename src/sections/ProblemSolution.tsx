import React, { useRef, useLayoutEffect } from 'react';
import { accentIcon, type AccentKey } from '../lib/accentStyles';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import {
  ClipboardList,
  BarChart3,
  MessageSquare,
  CheckCircle2,
  XCircle,
  type LucideIcon,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const ProblemSolution: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const phoneRefs = useRef<(HTMLDivElement | null)[]>([]);

  const problems = [
    {
      icon: XCircle,
      text: 'Scattered client data across spreadsheets and apps',
    },
    {
      icon: XCircle,
      text: 'No clear visibility into client progress',
    },
    {
      icon: XCircle,
      text: 'Hours wasted on manual reporting',
    },
  ];

  const solutions = [
    {
      icon: CheckCircle2,
      text: 'Unified dashboard for all client metrics',
    },
    {
      icon: CheckCircle2,
      text: 'Real-time progress tracking & insights',
    },
    {
      icon: CheckCircle2,
      text: 'Automated reports in seconds, not hours',
    },
  ];

  const phoneScreens: {
    icon: LucideIcon;
    title: string;
    color: AccentKey;
    depth: number;
  }[] = [
    {
      icon: ClipboardList,
      title: 'Programs',
      color: 'emerald',
      depth: 0,
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      color: 'orange',
      depth: 50,
    },
    {
      icon: MessageSquare,
      title: 'Messages',
      color: 'blue',
      depth: 100,
    },
  ];

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const leftCol = leftColumnRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add(
      '(prefers-reduced-motion: no-preference) and (min-width: 1024px)',
      () => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top 18%',
          end: 'bottom 82%',
          pin: leftCol,
          pinSpacing: false,
        });
        return () => {};
      }
    );

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        phoneRefs.current.forEach((phone, i) => {
          if (!phone) return;

          gsap.fromTo(
            phone,
            {
              y: 72 + i * 48,
              scale: 0.94 - i * 0.03,
              opacity: 0.52,
              rotateX: 9,
            },
            {
              y: -36 - i * 26,
              scale: 1,
              opacity: 1,
              rotateX: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top 58%',
                end: 'bottom 38%',
                scrub: 0.48 + i * 0.1,
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
      id="method"
      className="relative min-h-[200vh] w-full bg-neutral-950 py-32"
    >
      <div className="w-full section-padding">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column - Pinned Text */}
          <div ref={leftColumnRef} className="lg:pt-20">
            {/* Section Label */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="reveal-text inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/60 border border-stone-800 mb-6"
            >
              <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                The Problem
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="reveal-text text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-stone-100 mb-6"
            >
              Coaching is
              <span className="text-stone-600"> broken.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="reveal-text text-lg text-stone-400 mb-12 leading-relaxed"
            >
              Most coaches are drowning in administrative work instead of doing
              what they do best: coaching. The tools available are fragmented,
              outdated, and built by people who&apos;ve never stepped foot in a gym.
            </motion.p>

            {/* Problems List */}
            <div className="space-y-4 mb-16">
              {problems.map((problem, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="reveal-text flex items-start gap-4 p-4 rounded-xl bg-neutral-900/40 border border-stone-800/50"
                >
                  <problem.icon className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <span className="text-stone-300">{problem.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Solution Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="reveal-text inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-6"
            >
              <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                The Solution
              </span>
            </motion.div>

            <motion.h3
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="reveal-text text-3xl md:text-4xl font-bold tracking-tight text-stone-100 mb-6"
            >
              One platform.
              <br />
              <span className="text-gradient-emerald">Infinite potential.</span>
            </motion.h3>

            {/* Solutions List */}
            <div className="space-y-4">
              {solutions.map((solution, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  className="reveal-text flex items-start gap-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20"
                >
                  <solution.icon className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <span className="text-stone-300">{solution.text}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column - Stacking Phones */}
          <div
            ref={rightColumnRef}
            className="relative perspective-container h-[800px] lg:h-auto"
          >
            <div className="relative h-full flex items-center justify-center">
              {phoneScreens.map((screen, i) => (
                <div
                  key={i}
                  ref={(el) => { phoneRefs.current[i] = el; }}
                  className="absolute"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `translateZ(${screen.depth}px)`,
                    top: `${20 + i * 15}%`,
                    right: `${10 + i * 5}%`,
                  }}
                >
                  <motion.div
                    className="floating-card p-4 w-56 md:w-64"
                    initial={{ opacity: 0, y: 50, rotateX: 15 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 5 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.2 }}
                    whileHover={{ scale: 1.02, rotateY: 5 }}
                  >
                    {/* Phone Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-lg ${accentIcon[screen.color].bg} flex items-center justify-center`}
                        >
                          <screen.icon
                            className={`w-4 h-4 ${accentIcon[screen.color].text}`}
                          />
                        </div>
                        <span className="text-sm font-semibold text-stone-100">
                          {screen.title}
                        </span>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>

                    {/* Phone Content */}
                    <div className="space-y-3">
                      {/* Mock content based on screen type */}
                      {screen.title === 'Programs' && (
                        <>
                          <div className="h-16 rounded-lg bg-neutral-800/50 flex items-center px-3 gap-3">
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20" />
                            <div className="flex-1">
                              <div className="h-2 w-20 bg-stone-700 rounded mb-1" />
                              <div className="h-2 w-12 bg-stone-800 rounded" />
                            </div>
                          </div>
                          <div className="h-16 rounded-lg bg-neutral-800/50 flex items-center px-3 gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-500/20" />
                            <div className="flex-1">
                              <div className="h-2 w-24 bg-stone-700 rounded mb-1" />
                              <div className="h-2 w-10 bg-stone-800 rounded" />
                            </div>
                          </div>
                        </>
                      )}
                      {screen.title === 'Analytics' && (
                        <>
                          <div className="h-24 rounded-lg bg-neutral-800/50 p-3">
                            <div className="flex items-end justify-between h-full gap-2">
                              <div className="w-4 h-8 bg-emerald-500/40 rounded-sm" />
                              <div className="w-4 h-12 bg-emerald-500/60 rounded-sm" />
                              <div className="w-4 h-16 bg-emerald-500/80 rounded-sm" />
                              <div className="w-4 h-10 bg-emerald-500/50 rounded-sm" />
                              <div className="w-4 h-20 bg-emerald-500 rounded-sm" />
                            </div>
                          </div>
                          <div className="flex justify-between text-xs text-stone-500">
                            <span>Mon</span>
                            <span>Fri</span>
                          </div>
                        </>
                      )}
                      {screen.title === 'Messages' && (
                        <>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <div className="w-6 h-6 rounded-full bg-stone-700" />
                              <div className="flex-1 bg-neutral-800/50 rounded-lg p-2">
                                <div className="h-2 w-full bg-stone-700 rounded mb-1" />
                                <div className="h-2 w-2/3 bg-stone-800 rounded" />
                              </div>
                            </div>
                            <div className="flex gap-2 justify-end">
                              <div className="flex-1 bg-emerald-500/20 rounded-lg p-2">
                                <div className="h-2 w-full bg-emerald-500/40 rounded mb-1" />
                                <div className="h-2 w-1/2 bg-emerald-500/20 rounded" />
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSolution;
