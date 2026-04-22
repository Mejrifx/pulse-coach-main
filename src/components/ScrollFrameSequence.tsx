import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type ScrollFrameSequenceProps = {
  frameCount: number;
  framePathTemplate: (index: number) => string;
  className?: string;
  startTrigger?: string;
  endTrigger?: string;
};

/**
 * Scroll-driven frame sequence player using Canvas for performance.
 * Preloads images and renders the current frame based on scroll position.
 */
export function ScrollFrameSequence({
  frameCount,
  framePathTemplate,
  className = '',
  startTrigger = 'top top',
  endTrigger = 'bottom top',
}: ScrollFrameSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const currentFrameRef = useRef(0);

  // Preload all frames
  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      const path = framePathTemplate(i);
      img.src = path;
      
      img.onload = () => {
        loadedCount++;
        setLoadProgress((loadedCount / frameCount) * 100);
        if (loadedCount === frameCount) {
          setLoaded(true);
        }
      };
      img.onerror = (e) => {
        console.error(`Failed to load frame ${i} at path: ${path}`, e);
        loadedCount++;
        setLoadProgress((loadedCount / frameCount) * 100);
        if (loadedCount === frameCount) {
          setLoaded(true);
        }
      };
      images.push(img);
    }

    imagesRef.current = images;
  }, [frameCount, framePathTemplate]);

  // Render current frame
  const render = (index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const frameIndex = Math.max(0, Math.min(frameCount - 1, Math.floor(index)));
    const img = imagesRef.current[frameIndex];

    if (img?.complete && img.naturalWidth > 0) {
      currentFrameRef.current = frameIndex;
      
      // Fit perfectly within viewport (contain mode) - no stretching or overflow
      const canvasAspect = canvas.width / canvas.height;
      const imgAspect = img.naturalWidth / img.naturalHeight;

      let dx = 0, dy = 0, dw = canvas.width, dh = canvas.height;

      if (imgAspect > canvasAspect) {
        // Image is wider - fit to canvas width, letterbox top/bottom
        dw = canvas.width;
        dh = canvas.width / imgAspect;
        dy = (canvas.height - dh) / 2;
      } else {
        // Image is taller - fit to canvas height, pillarbox left/right
        dh = canvas.height;
        dw = canvas.height * imgAspect;
        dx = (canvas.width - dw) / 2;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, dx, dy, dw, dh);
    }
  };

  // Setup scroll animation
  useLayoutEffect(() => {
    if (!loaded) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      render(currentFrameRef.current);
    };

    updateCanvasSize();
    render(0);

    const frameIndex = { value: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: startTrigger,
        end: endTrigger,
        scrub: 0.8,
        onUpdate: (self) => {
          const targetFrame = self.progress * (frameCount - 1);
          // Smooth interpolation between frames for buttery effect
          frameIndex.value += (targetFrame - frameIndex.value) * 0.15;
          render(frameIndex.value);
        },
      },
    });

    const onResize = () => {
      updateCanvasSize();
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === container) st.kill();
      });
    };
  }, [loaded, frameCount, startTrigger, endTrigger]);

  return (
    <div ref={containerRef} className={className}>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-2 h-1 w-32 overflow-hidden rounded-full bg-stone-800">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <p className="text-xs text-stone-500">
              Loading frames {Math.floor(loadProgress)}%
            </p>
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`h-full w-full ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
        style={{ willChange: 'transform' }}
      />
    </div>
  );
}
