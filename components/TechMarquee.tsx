'use client';

const technologies = [
  'Vapi', 'MERN Stack', 'Flutter', 'React Native', 'Kotlin', 'n8n',
  'OpenAI', 'Claude', 'AWS', 'Docker', 'Python', 'Django', '.NET',
  'Google Cloud', 'Twilio', 'Anthropic', 'TypeScript', 'JavaScript', 'Node.js',
  'Firebase', 'Java', 'Dart', 'MySQL', 'Next.js'
];

// Duplicate once for seamless CSS looping (0% -> -50%)
const duplicatedTechnologies = [...technologies, ...technologies];

/** Liquid glass pills — teal/cyan chips over dark band */
const pillClass =
  'glass-pill-teal flex-shrink-0 cursor-default rounded-full px-3 py-1.5 text-xs font-medium text-cyan-200 [text-shadow:0_0_18px_rgba(79,209,197,0.18)] sm:px-5 sm:py-2 sm:text-sm md:px-6 md:py-2.5 md:hover:scale-[1.02] md:hover:border-cyan-200/45 md:hover:text-cyan-50';

export default function TechMarquee() {
  return (
    <section className="relative overflow-hidden bg-[#030712] py-10 md:py-14">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/35 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-400/35 to-transparent" />

      <div className="relative">
        {/* Top row - scrolling left */}
        <div className="mb-5 overflow-hidden md:mb-7">
          <div className="vawcom-marquee">
            <div className="vawcom-marquee-track vawcom-marquee-left">
            {duplicatedTechnologies.map((tech, i) => (
              <div key={`top-${i}-${tech}`} className={pillClass}>
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
              <div key={`bottom-${i}-${tech}`} className={pillClass}>
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
