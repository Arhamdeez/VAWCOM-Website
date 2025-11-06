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
  const animationRef = useRef<number>();
  const dotsRef = useRef<Dot[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const c = canvas as HTMLCanvasElement;
    const context = ctx as CanvasRenderingContext2D;

    // Create animated dots
    function createDots(width: number, height: number) {
      const dots: Dot[] = [];
      const dotCount = Math.floor((width * height) / 15000); // Adaptive dot count
      
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
    function updateMousePosition(deltaTime: number) {
      const smoothing = 0.1;
      mouseRef.current.x += (targetMouseX - mouseRef.current.x) * smoothing;
      mouseRef.current.y += (targetMouseY - mouseRef.current.y) * smoothing;
    }

    // Animate dots
    function animateDots(width: number, height: number, time: number, deltaTime: number) {
      // Update smooth mouse position
      updateMousePosition(deltaTime);
      
      context.clearRect(0, 0, width, height);
      
      // Dark background
      context.fillStyle = '#0f172a';
      context.fillRect(0, 0, width, height);

      // Smooth mouse position interpolation
      const smoothMouseX = mouseRef.current.x;
      const smoothMouseY = mouseRef.current.y;

      // Draw dots
      dotsRef.current.forEach((dot, index) => {
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
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = Math.pow((150 - distance) / 150, 2); // Quadratic easing
          const angle = Math.atan2(dy, dx);
          dot.vx += Math.cos(angle) * force * 0.025 * deltaTime * 60; // Slower force application
          dot.vy += Math.sin(angle) * force * 0.025 * deltaTime * 60;
        }
        
        // Smooth pulsing effect with eased sine wave
        const pulse = Math.sin(time * dot.pulseSpeed + dot.pulsePhase) * 0.25 + 0.75; // Reduced pulse range
        const currentOpacity = dot.opacity * pulse;
        const currentSize = dot.size * pulse;
        
        // Draw dot with glow
        context.save();
        context.globalAlpha = currentOpacity;
        
        // Outer glow
        const gradient = context.createRadialGradient(
          dot.x, dot.y, 0,
          dot.x, dot.y, currentSize * 3
        );
        gradient.addColorStop(0, dot.color);
        gradient.addColorStop(0.5, dot.color + '40');
        gradient.addColorStop(1, dot.color + '00');
        
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(dot.x, dot.y, currentSize * 3, 0, Math.PI * 2);
        context.fill();
        
        // Inner dot
        context.fillStyle = dot.color;
        context.beginPath();
        context.arc(dot.x, dot.y, currentSize, 0, Math.PI * 2);
        context.fill();
        
        context.restore();
      });

      // Draw connections between nearby dots with smooth gradient
      // Optimize: limit connections per dot to reduce O(n²) complexity
      const maxConnections = 5;
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
            // Smooth opacity transition with easing
            const normalizedDistance = distance / 140;
            const opacity = Math.pow(1 - normalizedDistance, 2) * 0.25; // Quadratic easing for smoother fade
            
            // Create gradient line for smoother appearance
            const gradient = context.createLinearGradient(dot1.x, dot1.y, dot2.x, dot2.y);
            gradient.addColorStop(0, `rgba(16, 185, 129, ${opacity})`);
            gradient.addColorStop(0.5, `rgba(20, 184, 166, ${opacity * 0.8})`);
            gradient.addColorStop(1, `rgba(16, 185, 129, ${opacity})`);
            
            context.strokeStyle = gradient;
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
    let startTime = Date.now();
    let lastFrameTime = Date.now();
    let isScrolling = false;
    let scrollTimeout: number | undefined;
    
    // Detect scrolling to reduce animation intensity
    function handleScroll() {
      isScrolling = true;
      if (scrollTimeout) window.clearTimeout(scrollTimeout);
      scrollTimeout = window.setTimeout(() => {
        isScrolling = false;
      }, 150);
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    function animate() {
      const currentTime = Date.now();
      const time = (currentTime - startTime) / 1000;
      const deltaTime = Math.min((currentTime - lastFrameTime) / 1000, 0.033); // Cap at ~30fps minimum
      lastFrameTime = currentTime;
      
      const width = c.width;
      const height = c.height;
      
      // Skip animation frame if scrolling to prioritize scroll performance
      if (!isScrolling) {
        animateDots(width, height, time, deltaTime);
      }
      animationRef.current = requestAnimationFrame(animate);
    }

    function handleMouseMove(e: MouseEvent) {
      const rect = c.getBoundingClientRect();
      targetMouseX = (e.clientX - rect.left) * (c.width / rect.width);
      targetMouseY = (e.clientY - rect.top) * (c.height / rect.height);
    }

    let resizeTimeout: number | undefined;
    function resize() {
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const w = Math.max(1, window.innerWidth) * dpr;
        const h = Math.max(1, window.innerHeight) * dpr;
        c.width = w;
        c.height = h;
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
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      if (scrollTimeout) window.clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[-1] w-full h-full will-change-transform"
      style={{ 
        transform: 'translateZ(0)', // Force GPU acceleration
        backfaceVisibility: 'hidden',
        perspective: '1000px'
      }}
      aria-hidden
    />
  );
}
