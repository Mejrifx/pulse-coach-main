import React, { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface CounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}

const Counter: React.FC<CounterProps> = ({
  end,
  suffix = '',
  prefix = '',
  duration = 2,
}) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(end);
      hasAnimated.current = true;
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: counterRef.current,
        start: 'top 82%',
        once: true,
        onEnter: () => {
          if (hasAnimated.current) return;
          hasAnimated.current = true;

          const proxy = { value: 0 };
          gsap.to(proxy, {
            value: end,
            duration,
            ease: 'power2.out',
            onUpdate: () => setCount(Math.floor(proxy.value)),
          });
        },
      });
    }, counterRef);

    return () => ctx.revert();
  }, [end, duration]);

  return (
    <span ref={counterRef}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const Stats: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const stats = [
    {
      value: 50000,
      suffix: '+',
      label: 'Active Athletes',
      description: 'Training daily on Pulse',
    },
    {
      value: 2500,
      suffix: '+',
      label: 'Elite Coaches',
      description: 'Trust Pulse for their business',
    },
    {
      value: 12,
      suffix: 'M+',
      label: 'Workouts Logged',
      description: 'And counting every second',
    },
    {
      value: 47,
      suffix: '%',
      label: 'Better Results',
      description: 'Compared to traditional coaching',
    },
  ];

  const testimonials = [
    {
      quote:
        "Pulse transformed my coaching business. I've doubled my client load while spending half the time on admin work.",
      author: 'Marcus Chen',
      role: 'IFBB Pro Coach',
      rating: 5,
    },
    {
      quote:
        "The analytics are insane. I can see exactly where my clients are plateauing and adjust their programs in real-time.",
      author: 'Sarah Williams',
      role: 'Strength & Conditioning Coach',
      rating: 5,
    },
    {
      quote:
        "Finally, a platform built by people who actually lift. Every feature just makes sense.",
      author: 'David Park',
      role: 'CrossFit Games Athlete',
      rating: 5,
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="results"
      className="relative w-full bg-neutral-950 py-32"
    >
      {/* Background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-emerald-600/10 blur-[150px] pointer-events-none" />

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
            <Star className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-stone-400 uppercase tracking-wider">
              Social Proof
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-stone-100 mb-6"
          >
            Numbers that
            <span className="text-gradient-emerald"> speak.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-stone-400 leading-relaxed"
          >
            Join thousands of coaches and athletes who have already made the switch.
          </motion.p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-24">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="floating-card p-6 md:p-8 h-full">
                <div className="stat-number text-4xl md:text-5xl lg:text-6xl text-emerald-400 mb-2">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-lg font-semibold text-stone-100 mb-1">
                  {stat.label}
                </div>
                <div className="text-sm text-stone-500">{stat.description}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="max-w-6xl mx-auto">
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-bold text-stone-100 text-center mb-12"
          >
            What the pros are saying
          </motion.h3>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.author}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="floating-card p-6 h-full flex flex-col">
                  {/* Quote icon */}
                  <Quote className="w-8 h-8 text-emerald-500/30 mb-4" />

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-orange-400 fill-orange-400"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-stone-300 leading-relaxed mb-6 flex-1">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-stone-800">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.author
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-stone-100">
                        {testimonial.author}
                      </div>
                      <div className="text-sm text-stone-500">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
