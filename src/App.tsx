import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Sections
import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import ProblemSolution from './sections/ProblemSolution';
import Features from './sections/Features';
import HorizontalShowcase from './sections/HorizontalShowcase';
import Stats from './sections/Stats';
import Pricing from './sections/Pricing';
import FooterCTA from './sections/FooterCTA';

import './App.css';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

function App() {
  useEffect(() => {
    gsap.defaults({
      ease: 'power2.out',
      duration: 0.8,
    });

    ScrollTrigger.defaults({
      anticipatePin: 1,
    });

    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
    });

    ScrollTrigger.refresh();

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
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-neutral-950">
      {/* Noise texture overlay */}
      <div className="noise-overlay" />

      {/* Vignette effect */}
      <div className="vignette" />

      {/* Navigation */}
      <Navigation />

      {/* Main content */}
      <main className="relative">
        {/* Hero Section - 3D Theater with floating cards */}
        <Hero />

        {/* Problem/Solution - Pinned split-screen */}
        <ProblemSolution />

        {/* Features Bento - 3D grid reveal */}
        <Features />

        {/* Horizontal Showcase - Signature horizontal scroll */}
        <HorizontalShowcase />

        {/* Stats/Social Proof - Counter animation */}
        <Stats />

        {/* Pricing - 3D flip-in cards */}
        <Pricing />

        {/* Footer CTA - Immersive zoom exit */}
        <FooterCTA />
      </main>
    </div>
  );
}

export default App;
