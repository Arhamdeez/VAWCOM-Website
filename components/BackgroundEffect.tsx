'use client';

import { useEffect, useRef } from 'react';

interface Dot {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  pulseSpeed: number;
  pulsePhase: number;
  color: string;
}

export default function BackgroundEffect() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const spritesRef = useRef<Record<string, HTMLCanvasElement>>({});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const c = canvas as HTMLCanvasElement;
    const context = ctx as CanvasRenderingContext2D;

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (prefersReducedMotion) {
      // Don’t run heavy animations for users who prefer reduced motion.
      return;
    }

    const getSprite = (color: string) => {
      const cached = spritesRef.current[color];
      if (cached) return cached;

      const sprite = document.createElement('canvas');
      // Small sprite; scaled up/down with drawImage.
      sprite.width = 64;
      sprite.height = 64;
      const sctx = sprite.getContext('2d');
      if (!sctx) return sprite;

      const cx = sprite.width / 2;
      const cy = sprite.height / 2;
      const r = sprite.width / 2;
      const g = sctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, color);
      g.addColorStop(0.4, `${color}55`);
      g.addColorStop(1, `${color}00`);
      sctx.fillStyle = g;
      sctx.beginPath();
      sctx.arc(cx, cy, r, 0, Math.PI * 2);
      sctx.fill();

      spritesRef.current[color] = sprite;
      return sprite;
    };

    // Create animated dots
    function createDots(width: number, height: number) {
      const dots: Dot[] = [];
      // Render in CSS pixels; keep density reasonable to avoid jank.
      const dotCount = Math.min(72, Math.floor((width * height) / 32000));
      
      for (let i = 0; i < dotCount; i++) {
        dots.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.15, // Slower velocity for calmer movement
          vy: (Math.random() - 0.5) * 0.15,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.6 + 0.2,
          pulseSpeed: Math.random() * 0.008 + 0.004, // Much slower pulse for calmer effect
          pulsePhase: Math.random() * Math.PI * 2,
          color: Math.random() > 0.7 ? '#10b981' : '#14b8a6' // Mostly emerald, some teal
        });
      }
      return dots;
    }

    // Smooth mouse interaction with interpolation
    let targetMouseX = 0;
    let targetMouseY = 0;
    
    // Smooth mouse position interpolation
    function updateMousePosition() {
      const smoothing = 0.1;
      mouseRef.current.x += (targetMouseX - mouseRef.current.x) * smoothing;
      mouseRef.current.y += (targetMouseY - mouseRef.current.y) * smoothing;
    }

    // Animate dots
    function animateDots(width: number, height: number, time: number, deltaTime: number) {
      // Update smooth mouse position
      updateMousePosition();
      
      context.clearRect(0, 0, width, height);
      
      // Dark background
      context.fillStyle = '#0f172a';
      context.fillRect(0, 0, width, height);

      // Smooth mouse position interpolation
      const smoothMouseX = mouseRef.current.x;
      const smoothMouseY = mouseRef.current.y;

      // Draw dots (sprite-based to avoid per-dot gradients each frame)
      dotsRef.current.forEach((dot) => {
        // Smooth velocity damping for more fluid movement
        const damping = 0.99; // Higher damping for slower, calmer movement
        dot.vx *= damping;
        dot.vy *= damping;
        
        // Update position with delta time for frame-independent movement
        dot.x += dot.vx * deltaTime * 60; // Normalize to 60fps
        dot.y += dot.vy * deltaTime * 60;
        
        // Smooth bounce off edges with gradual velocity reversal
        if (dot.x < 0) {
          dot.x = 0;
          dot.vx = Math.abs(dot.vx) * 0.8; // Gradual bounce
        } else if (dot.x > width) {
          dot.x = width;
          dot.vx = -Math.abs(dot.vx) * 0.8;
        }
        
        if (dot.y < 0) {
          dot.y = 0;
          dot.vy = Math.abs(dot.vy) * 0.8;
        } else if (dot.y > height) {
          dot.y = height;
          dot.vy = -Math.abs(dot.vy) * 0.8;
        }
        
        // Smooth mouse interaction with easing
        const dx = smoothMouseX - dot.x;
        const dy = smoothMouseY - dot.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < 22500) {
          const distance = Math.sqrt(distSq);
          const force = Math.pow((150 - distance) / 150, 2);
          const angle = Math.atan2(dy, dx);
          dot.vx += Math.cos(angle) * force * 0.02 * deltaTime * 60;
          dot.vy += Math.sin(angle) * force * 0.02 * deltaTime * 60;
        }
        
        // Smooth pulsing effect with eased sine wave
        const pulse = Math.sin(time * dot.pulseSpeed + dot.pulsePhase) * 0.25 + 0.75; // Reduced pulse range
        const currentOpacity = dot.opacity * pulse;
        const currentSize = dot.size * pulse;
        
        const sprite = getSprite(dot.color);
        const drawSize = currentSize * 10; // sprite is soft/glowy; keep slightly larger than dot
        context.globalAlpha = currentOpacity;
        context.drawImage(sprite, dot.x - drawSize / 2, dot.y - drawSize / 2, drawSize, drawSize);
      });

      // Draw connections between nearby dots with smooth gradient
      // Optimize: limit connections per dot to reduce O(n²) complexity
      const maxConnections = isScrolling ? 0 : 3;
      for (let i = 0; i < dotsRef.current.length; i++) {
        const dot1 = dotsRef.current[i];
        let connectionCount = 0;
        
        for (let j = i + 1; j < dotsRef.current.length && connectionCount < maxConnections; j++) {
          const dot2 = dotsRef.current[j];
          const dx = dot1.x - dot2.x;
          const dy = dot1.y - dot2.y;
          const distanceSquared = dx * dx + dy * dy; // Use squared distance to avoid sqrt
          
          if (distanceSquared < 19600) { // 140^2 = 19600
            const distance = Math.sqrt(distanceSquared);
            const normalizedDistance = distance / 140;
            const opacity = Math.pow(1 - normalizedDistance, 2) * 0.18;

            // Keep this cheap: no per-line gradients.
            context.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
            context.lineWidth = 0.5;
            context.globalAlpha = 1;
            context.beginPath();
            context.moveTo(dot1.x, dot1.y);
            context.lineTo(dot2.x, dot2.y);
            context.stroke();
            connectionCount++;
          }
        }
      }
      
      context.globalAlpha = 1;
    }

    // Animation loop with delta time for smooth frame-independent animation
    const startTime = Date.now();
    let lastFrameTime = Date.now();
    let isScrolling = false;
    let scrollTimeout: number | undefined;
    let isVisible = true;
    
    // Detect scrolling to reduce animation intensity
    function handleScroll() {
      isScrolling = true;
      if (scrollTimeout) window.clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        isScrolling = false;
      }, 150);
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleVisibility = () => {
      isVisible = document.visibilityState === 'visible';
    };
    document.addEventListener('visibilitychange', handleVisibility);
    
    let frameIndex = 0;
    function animate() {
      if (!isVisible) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      frameIndex += 1;
      // Cap ~30fps to reduce main-thread load (canvas + page blur layers)
      if (frameIndex % 2 !== 0) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }
      const currentTime = Date.now();
      const time = (currentTime - startTime) / 1000;
      const deltaTime = Math.min((currentTime - lastFrameTime) / 1000, 0.05);
      lastFrameTime = currentTime;

      const width = Math.max(1, window.innerWidth);
      const height = Math.max(1, window.innerHeight);

      animateDots(width, height, time, deltaTime);
      animationRef.current = requestAnimationFrame(animate);
    }

    function handleMouseMove(e: MouseEvent) {
      const rect = c.getBoundingClientRect();
      // Dots live in CSS pixel space (same as innerWidth/innerHeight)
      targetMouseX = e.clientX - rect.left;
      targetMouseY = e.clientY - rect.top;
    }

    let resizeTimeout: number | undefined;
    function resize() {
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.max(1, window.innerWidth);
        const h = Math.max(1, window.innerHeight);

        c.width = Math.floor(w * dpr);
        c.height = Math.floor(h * dpr);
        // Scale so we can draw using CSS pixel units (w/h).
        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        
        // Recreate dots for new dimensions
        dotsRef.current = createDots(w, h);
      }, 80);
    }

    // Initialize
    resize();
    animate();
    
    // Event listeners
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      if (scrollTimeout) window.clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[-1] w-full h-full"
      style={{ 
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
      aria-hidden
    />
  );
}
