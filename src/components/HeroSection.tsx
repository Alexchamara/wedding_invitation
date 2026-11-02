import React from 'react';
import { ArrowDown, Heart } from 'lucide-react';

interface HeroSectionProps {
  guestName?: string;
  onEnterImmersive3d?: () => void;
  onScrollToNext?: () => void;
  onScrollToTogether?: () => void;
  onScrollToRsvp?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  guestName,
  onScrollToNext,
  onScrollToTogether,
}) => {
  const handleScroll = onScrollToNext || onScrollToTogether || (() => {});
  return (
    <section id="hero" className="relative pt-24 pb-16 px-4 text-center overflow-hidden">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Personalized guest greeting badge */}
        {guestName && (
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#556B2F]/10 border border-[#556B2F]/30 text-[#3F5021] text-xs uppercase tracking-widest font-medium mb-6 animate-fade-in shadow-xs">
            <Heart className="w-3.5 h-3.5 text-[#556B2F] fill-[#556B2F]" />
            <span>Dear {guestName}, You Are Warmly Invited</span>
          </div>
        )}

        {/* Botanical Flourish Monogram */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-full border border-[#D4AF37]/60 bg-[#FAF8F3] flex items-center justify-center shadow-md">
            <span className="font-script text-4xl text-[#3F5021]">BA</span>
          </div>
        </div>

        <p className="text-xs uppercase tracking-[5px] text-[#556B2F] font-semibold mb-3">
          Together With Their Families
        </p>

        <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-light text-[#2A2A2A] tracking-tight mb-4">
          Bumika <span className="font-script text-4xl sm:text-6xl text-[#D4AF37]">&amp;</span> Achini
        </h1>

        <div className="flex items-center justify-center gap-3 text-xs tracking-[4px] uppercase text-[#4A4A45] border-y border-[#E8E4D8] py-3 px-8 mb-8">
          <span>Tuesday</span>
          <span className="text-[#C5A059]">•</span>
          <span>10 November 2026</span>
          <span className="text-[#C5A059]">•</span>
          <span>Wave Bolgoda</span>
        </div>

        <p className="font-serif text-lg sm:text-2xl italic text-[#4A4A45] max-w-xl mx-auto mb-10 leading-relaxed">
          &ldquo;And over all these virtues put on love, which binds them all together in perfect unity.&rdquo;
        </p>

        {/* Scroll Cue */}
        <button
          onClick={handleScroll}
          className="flex flex-col items-center gap-2 text-[10px] tracking-widest uppercase text-[#8A8A82] hover:text-[#556B2F] transition-colors cursor-pointer"
        >
          <span>Scroll to explore</span>
          <ArrowDown className="w-4 h-4 text-[#556B2F] animate-bounce" />
        </button>
      </div>
    </section>
  );
};
