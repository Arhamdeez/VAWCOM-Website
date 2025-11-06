'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

interface ScrollingTextProps {
  text: string;
  baseVelocity?: number;
  className?: string;
}

export function ScrollingText({ 
  text, 
  baseVelocity = 1,
  className = ''
}: ScrollingTextProps) {
  const controls = useAnimation();
  const textArray = Array(4).fill(text);
  const duration = 20 * (1 / baseVelocity);

  useEffect(() => {
    let isMounted = true;
    
    const animate = async () => {
      while (isMounted) {
        await controls.start({
          x: ['0%', '-50%'],
          transition: {
            duration: duration,
            ease: 'linear',
            repeat: Infinity,
            repeatType: 'loop',
          },
        });
      }
    };

    animate();
    return () => { isMounted = false; };
  }, [controls, duration]);

  return (
    <div className={`w-full overflow-hidden py-12 ${className}`}>
      <div className="relative">
        <motion.div 
          className="flex whitespace-nowrap w-max"
          animate={controls}
        >
          {textArray.map((t, i) => (
            <span 
              key={i} 
              className="inline-block text-7xl md:text-9xl font-bold text-slate-800/5 px-6 md:px-12"
            >
              {t}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
