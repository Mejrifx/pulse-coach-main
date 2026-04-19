import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { SkipToMain } from '@/components/SkipToMain';
import Navigation from '@/sections/Navigation';
import Hero from '@/sections/Hero';
import ProblemSolution from '@/sections/ProblemSolution';
import Features from '@/sections/Features';
import HorizontalShowcase from '@/sections/HorizontalShowcase';
import Stats from '@/sections/Stats';
import Pricing from '@/sections/Pricing';
import FooterCTA from '@/sections/FooterCTA';

import '@/App.css';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  useEffect(() => {
    gsap.defaults({
      ease: 'power2.out',
      duration: 0.8,
    });

    ScrollTrigger.defaults({
      anticipatePin: 0,
    });

    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
    });

    ScrollTrigger.refresh();
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);

    let resizeTimer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    };
    window.addEventListener('resize', onResize);

    const onFonts = () => ScrollTrigger.refresh();
    void document.fonts.ready.then(onFonts);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onLoad);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-neutral-950">
      <SkipToMain />

      <div className="noise-overlay" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <Navigation />

      <main id="main-content" className="relative" tabIndex={-1}>
        <Hero />
        <ProblemSolution />
        <Features />
        <HorizontalShowcase />
        <Stats />
        <Pricing />
        <FooterCTA />
      </main>
    </div>
  );
}
