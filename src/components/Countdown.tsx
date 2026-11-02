import React, { useState, useEffect } from 'react';

export const Countdown: React.FC = () => {
  // 10 November 2026, 6:00 PM Colombo time (UTC+05:30)
  const targetTimestamp = new Date('2026-11-10T18:00:00+05:30').getTime();

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    function calculate() {
      const now = Date.now();
      let diff = Math.max(0, targetTimestamp - now);

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      diff -= days * (1000 * 60 * 60 * 24);

      const hours = Math.floor(diff / (1000 * 60 * 60));
      diff -= hours * (1000 * 60 * 60);

      const minutes = Math.floor(diff / (1000 * 60));
      diff -= minutes * (1000 * 60);

      const seconds = Math.floor(diff / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetTimestamp]);

  const units = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
    <section id="countdown" className="py-20 px-4 bg-[#FAF8F3] text-center border-t border-[#E8E4D8]">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs uppercase tracking-[4px] text-[#556B2F] font-medium mb-2">
          Counting The Moments
        </p>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#2A2A2A] mb-4">
          Until We Say &ldquo;I Do&rdquo;
        </h2>
        <div className="w-16 h-[1px] bg-[#C5A059] mx-auto mb-10" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto">
          {units.map((unit) => (
            <div
              key={unit.label}
              className="p-6 rounded-2xl bg-white border border-[#E8E4D8] shadow-sm hover:shadow-md transition-shadow group flex flex-col items-center justify-center"
            >
              <div className="font-serif text-4xl sm:text-5xl font-light text-[#3F5021] tabular-nums tracking-tight mb-1">
                {String(unit.value).padStart(2, '0')}
              </div>
              <div className="text-[11px] uppercase tracking-widest text-[#8A8A82] font-medium">
                {unit.label}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 text-xs tracking-widest uppercase text-[#8A8A82]">
          Tuesday, 10 November 2026 · 6:00 PM (IST) · Wave Bolgoda, Sri Lanka
        </p>
      </div>
    </section>
  );
};
