import { useEffect } from 'react';
import { useLenis } from 'lenis/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Keeps GSAP ScrollTrigger in sync with Lenis (see Lenis README — GSAP ScrollTrigger).
 */
export function ScrollTriggerLenisSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const unsubScroll = lenis.on('scroll', ScrollTrigger.update);

    const tickerFn = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      unsubScroll();
      gsap.ticker.remove(tickerFn);
    };
  }, [lenis]);

  return null;
}
