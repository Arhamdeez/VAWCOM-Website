'use client';

const technologies = [
  'Vapi', 'MERN Stack', 'Flutter', 'React Native', 'Kotlin', 'n8n',
  'OpenAI', 'Claude', 'AWS', 'Docker', 'Python', 'Django', '.NET',
  'Google Cloud', 'Twilio', 'Anthropic', 'TypeScript', 'JavaScript', 'Node.js',
  'Firebase', 'Java', 'Dart', 'MySQL', 'Next.js'
];

// Duplicate once for seamless CSS looping (0% -> -50%)
const duplicatedTechnologies = [...technologies, ...technologies];

export default function TechMarquee() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-emerald-950/12 to-slate-950 py-10 md:py-14">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-500/35 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/35 to-transparent" />

      <div className="relative">
        {/* Top row - scrolling left */}
        <div className="mb-5 overflow-hidden md:mb-7">
          <div className="vawcom-marquee">
            <div className="vawcom-marquee-track vawcom-marquee-left">
            {duplicatedTechnologies.map((tech, i) => (
              <div 
                key={`top-${i}-${tech}`} 
                className="flex-shrink-0 cursor-default rounded-full border border-emerald-400/22 bg-slate-950/30 px-3 py-1.5 text-xs text-emerald-200/85 backdrop-blur-[4px] sm:px-5 sm:py-2 sm:text-sm md:border-emerald-400/28 md:px-6 md:py-2.5 md:hover:scale-[1.02] md:hover:border-emerald-400/40 md:hover:text-emerald-100"
              >
                {tech}
              </div>
            ))}
            </div>
          </div>
        </div>

        {/* Bottom row - scrolling right */}
        <div className="overflow-hidden">
          <div className="vawcom-marquee">
            <div className="vawcom-marquee-track vawcom-marquee-right">
            {duplicatedTechnologies.map((tech, i) => (
              <div 
                key={`bottom-${i}-${tech}`} 
                className="flex-shrink-0 cursor-default rounded-full border border-teal-400/22 bg-emerald-500/[0.04] px-3 py-1.5 text-xs text-teal-200/85 backdrop-blur-[4px] sm:px-5 sm:py-2 sm:text-sm md:border-teal-400/28 md:px-6 md:py-2.5 md:hover:scale-[1.02] md:hover:border-teal-400/40 md:hover:text-teal-100"
              >
                {tech}
              </div>
            ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
