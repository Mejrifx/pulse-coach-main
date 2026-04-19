import React, { useRef, useLayoutEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Zap,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Mail,
} from 'lucide-react';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

const FooterCTA: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const ctx = gsap.context(() => {
        if (bgRef.current) {
          gsap.fromTo(
            bgRef.current,
            { scale: 1 },
            {
              scale: 1.08,
              ease: 'none',
              scrollTrigger: {
                trigger: section,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true,
              },
            }
          );
        }

        const words = headlineRef.current?.querySelectorAll('.word');
        if (words && words.length) {
          gsap.fromTo(
            words,
            { y: 72, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              stagger: 0.08,
              duration: 0.72,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: headlineRef.current!,
                start: 'top 82%',
                once: true,
              },
            }
          );
        }

        if (formRef.current) {
          gsap.fromTo(
            formRef.current,
            { x: 56, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.75,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: formRef.current,
                start: 'top 86%',
                once: true,
              },
            }
          );
        }
      }, section);

      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error('Please enter your email.');
      return;
    }
    toast.success(`You're on the list — we'll reach you at ${trimmed}.`);
    setEmail('');
  };

  const headlineWords = ['Ready', 'to', 'dominate?'];

  const footerLinks = [
    {
      title: 'Product',
      links: ['Features', 'Pricing', 'Integrations', 'API'],
    },
    {
      title: 'Company',
      links: ['About', 'Blog', 'Careers', 'Press'],
    },
    {
      title: 'Resources',
      links: ['Documentation', 'Help Center', 'Community', 'Contact'],
    },
    {
      title: 'Legal',
      links: ['Privacy', 'Terms', 'Security', 'Cookies'],
    },
  ];

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'YouTube' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <section ref={sectionRef} className="relative w-full bg-neutral-950">
      {/* CTA Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background with zoom effect */}
        <div
          ref={bgRef}
          className="absolute inset-0 z-0"
          style={{
            background: `
              radial-gradient(ellipse at 30% 50%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 70% 50%, rgba(37, 99, 235, 0.1) 0%, transparent 50%),
              linear-gradient(180deg, #0a0a0a 0%, #171717 100%)
            `,
          }}
        />

        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
        </div>

        {/* Content */}
        <div
          ref={contentRef}
          className="relative z-10 w-full section-padding py-32"
        >
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left - Headline */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-8"
                >
                  <Zap className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                    Start Your Journey
                  </span>
                </motion.div>

                <h2
                  ref={headlineRef}
                  className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-stone-100 mb-6 overflow-hidden"
                >
                  {headlineWords.map((word, index) => (
                    <span
                      key={index}
                      className={`word inline-block mr-4 ${
                        index === headlineWords.length - 1
                          ? 'text-gradient-emerald'
                          : ''
                      }`}
                    >
                      {word}
                    </span>
                  ))}
                </h2>

                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-xl text-stone-400 leading-relaxed"
                >
                  Join 2,500+ elite coaches who have transformed their businesses
                  with Pulse. Your clients are waiting.
                </motion.p>
              </div>

              {/* Right - Form */}
              <div ref={formRef}>
                <div className="floating-card p-8 md:p-10">
                  <h3 className="text-2xl font-bold text-stone-100 mb-4">
                    Start your free trial
                  </h3>
                  <p className="text-stone-400 mb-8">
                    14 days free. No credit card required.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-stone-300 mb-2"
                      >
                        Email address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-neutral-800 border border-stone-700 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full btn-primary flex items-center justify-center gap-2 py-4"
                    >
                      Get Started Free
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  <div className="mt-6 pt-6 border-t border-stone-800">
                    <p className="text-sm text-stone-500 text-center">
                      Already have an account?{' '}
                      <a
                        href="#"
                        className="text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        Sign in
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-stone-800 bg-neutral-950">
        <div className="section-padding py-16">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
              {/* Logo & description */}
              <div className="col-span-2">
                <a href="#" className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold tracking-tight text-stone-100">
                    PULSE
                  </span>
                </a>
                <p className="text-sm text-stone-500 mb-6 max-w-xs">
                  The all-in-one platform for elite coaches who demand precision.
                </p>

                {/* Social links */}
                <div className="flex gap-3">
                  {socialLinks.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      className="w-10 h-10 rounded-lg bg-neutral-900 flex items-center justify-center text-stone-400 hover:text-emerald-400 hover:bg-neutral-800 transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Link columns */}
              {footerLinks.map((column) => (
                <div key={column.title}>
                  <h4 className="font-semibold text-stone-100 mb-4">
                    {column.title}
                  </h4>
                  <ul className="space-y-3">
                    {column.links.map((link) => (
                      <li key={link}>
                        <a
                          href="#"
                          className="text-sm text-stone-500 hover:text-stone-300 transition-colors"
                        >
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Bottom bar */}
            <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-stone-600">
                &copy; {new Date().getFullYear()} Pulse Fitness Technologies. All
                rights reserved.
              </p>

              <div className="flex items-center gap-2 text-stone-600">
                <Mail className="w-4 h-4" />
                <a
                  href="mailto:hello@pulse.co"
                  className="text-sm hover:text-stone-400 transition-colors"
                >
                  hello@pulse.co
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default FooterCTA;
