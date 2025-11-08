'use client';

export default function Stats() {
  return (
    <section className="py-20 bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-400 mb-2">100%</div>
            <div className="text-slate-400">Automation-First</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-400 mb-2">24/7</div>
            <div className="text-slate-400">Always Running</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-emerald-400 mb-2">∞</div>
            <div className="text-slate-400">Infinite Scale</div>
          </div>
        </div>
      </div>
    </section>
  );
}

