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
 * Scroll-driven frame sequence player with smooth interpolation.
 * Decouples scroll input from rendering to prevent frame jumping and ensure
 * continuous, stable motion even during rapid scrolling.
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
  const targetFrameRef = useRef(0);
  const renderLoopRef = useRef<number | null>(null);

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

  // Render current frame with sub-frame interpolation for smooth motion
  const render = (index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const clampedIndex = Math.max(0, Math.min(frameCount - 1, index));
    const frameIndexA = Math.floor(clampedIndex);
    const frameIndexB = Math.min(frameCount - 1, Math.ceil(clampedIndex));
    const blend = clampedIndex - frameIndexA;

    const imgA = imagesRef.current[frameIndexA];
    const imgB = imagesRef.current[frameIndexB];

    if (!imgA?.complete || imgA.naturalWidth <= 0) return;

    currentFrameRef.current = clampedIndex;

    const canvasAspect = canvas.width / canvas.height;
    const imgAspect = imgA.naturalWidth / imgA.naturalHeight;

    let dx = 0, dy = 0, dw = canvas.width, dh = canvas.height;

    // "Cover" mode: fill entire viewport, crop if needed (no letterboxing)
    if (imgAspect > canvasAspect) {
      // Image is wider: fit height, crop sides
      dh = canvas.height;
      dw = canvas.height * imgAspect;
      dx = (canvas.width - dw) / 2;
    } else {
      // Image is taller: fit width, crop top/bottom
      dw = canvas.width;
      dh = canvas.width / imgAspect;
      dy = (canvas.height - dh) / 2;
    }

    // Fill with site background color for seamless blending
    ctx.fillStyle = '#0a0a0a'; // neutral-950
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render base frame
    ctx.globalAlpha = 1;
    ctx.drawImage(imgA, 0, 0, imgA.naturalWidth, imgA.naturalHeight, dx, dy, dw, dh);

    // Blend next frame if between frames for sub-frame smoothness
    if (blend > 0.001 && frameIndexB !== frameIndexA && imgB?.complete && imgB.naturalWidth > 0) {
      ctx.globalAlpha = blend;
      ctx.drawImage(imgB, 0, 0, imgB.naturalWidth, imgB.naturalHeight, dx, dy, dw, dh);
    }

    ctx.globalAlpha = 1;
  };

  // Decoupled render loop for smooth interpolation
  useEffect(() => {
    if (!loaded) return;

    let lastTime = performance.now();
    const targetFPS = 60;
    const frameTime = 1000 / targetFPS;

    const renderLoop = (currentTime: number) => {
      const elapsed = currentTime - lastTime;

      // Throttle to ~60fps
      if (elapsed >= frameTime) {
        const distance = Math.abs(targetFrameRef.current - currentFrameRef.current);
        
        // Adaptive interpolation: faster when far, smoother when close
        // This prevents large jumps while maintaining responsiveness
        let speed;
        if (distance > 5) {
          speed = 0.2; // Fast catch-up
        } else if (distance > 1) {
          speed = 0.12; // Medium smoothing
        } else {
          speed = 0.08; // Fine control for slow scrolling
        }

        const nextFrame = currentFrameRef.current + (targetFrameRef.current - currentFrameRef.current) * speed;

        // Only render if change is meaningful
        if (Math.abs(nextFrame - currentFrameRef.current) > 0.01) {
          render(nextFrame);
          currentFrameRef.current = nextFrame;
        }

        lastTime = currentTime;
      }

      renderLoopRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoopRef.current = requestAnimationFrame(renderLoop);

    return () => {
      if (renderLoopRef.current !== null) {
        cancelAnimationFrame(renderLoopRef.current);
      }
    };
  }, [loaded, frameCount]);

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

    // GSAP scroll updates only set target - render loop handles display
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: startTrigger,
        end: endTrigger,
        scrub: true,
        onUpdate: (self) => {
          // Update target frame (lightweight)
          targetFrameRef.current = self.progress * (frameCount - 1);
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
