'use client';

import { motion } from 'framer-motion';

const technologies = [
  'Vapi', 'MERN Stack', 'Flutter', 'React Native', 'Kotlin', 'n8n Automations',
  'OpenAI', 'Claude', 'AWS', 'Docker', 'Python', 'Django', '.NET',
  'Google Cloud', 'Twilio', 'Anthropic', 'TypeScript', 'JavaScript', 'Node.js',
  'Firebase', 'Java', 'Dart', 'MySQL', 'Next.js'
];

// Pre-calculate the animation distance for seamless looping
// Duplicate technologies multiple times for seamless infinite scroll
const duplicatedTechnologies = [...technologies, ...technologies, ...technologies];
const animationDistance = -(technologies.length * 232); // 200px width + 32px gap per item

export default function TechMarquee() {
  return (
    <section className="py-16 bg-gradient-to-r from-slate-950 via-emerald-950/20 to-slate-950 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

      <div className="relative">
        {/* Top row - scrolling left */}
        <div className="overflow-hidden mb-8">
          <motion.div
            className="flex gap-8 whitespace-nowrap will-change-transform"
            animate={{ x: [0, animationDistance] }}
            transition={{ 
              repeat: Infinity, 
              duration: 80, 
              ease: 'linear',
              repeatType: 'loop'
            }}
            style={{ width: 'max-content' }}
          >
            {duplicatedTechnologies.map((tech, i) => (
              <div 
                key={`top-${i}-${tech}`} 
                className="px-6 py-3 rounded-full bg-slate-900/80 border border-emerald-500/30 text-emerald-300/90 backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-emerald-400 hover:text-emerald-200 cursor-pointer flex-shrink-0"
              >
                {tech}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom row - scrolling right */}
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-8 whitespace-nowrap will-change-transform"
            animate={{ x: [animationDistance, 0] }}
            transition={{ 
              repeat: Infinity, 
              duration: 90, 
              ease: 'linear',
              repeatType: 'loop'
            }}
            style={{ width: 'max-content' }}
          >
            {duplicatedTechnologies.map((tech, i) => (
              <div 
                key={`bottom-${i}-${tech}`} 
                className="px-6 py-3 rounded-full bg-emerald-500/10 border border-teal-500/30 text-teal-300/90 backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-teal-400 hover:text-teal-200 cursor-pointer flex-shrink-0"
              >
                {tech}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
