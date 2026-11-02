import React, { useState } from 'react';
import { Mail, Heart } from 'lucide-react';

interface IntroStageProps {
  guestName?: string;
  onOpen: () => void;
  onSkipToRsvp?: () => void;
}

export const IntroStage: React.FC<IntroStageProps> = ({
  guestName,
  onOpen,
}) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleOpen = () => {
    setIsClosing(true);
    setTimeout(() => {
      onOpen();
    }, 900);
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#0F1410] text-[#FAF8F3] flex flex-col items-center justify-center overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.83,0,0.17,1)] ${
        isClosing ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
      style={{
        clipPath: isClosing ? 'circle(0% at 50% 90%)' : 'circle(150% at 50% 90%)',
      }}
    >
      {/* Animated Mesh Gradient Orbs */}
      <div className="absolute inset-[-20%] blur-[90px] opacity-60 pointer-events-none">
        <div className="absolute w-[55vw] h-[55vw] rounded-full bg-radial from-[#556B2F] to-transparent top-[-15%] left-[-10%] animate-float-1" />
        <div className="absolute w-[50vw] h-[50vw] rounded-full bg-radial from-[#8A9A5B] to-transparent bottom-[-15%] right-[-10%] animate-float-2" />
        <div className="absolute w-[42vw] h-[42vw] rounded-full bg-radial from-[#3F5021] to-transparent top-[25%] right-[22%] animate-float-3" />
      </div>

      {/* Editorial Corner Stamps */}
      <div className="absolute top-8 left-8 text-[11px] tracking-[4px] uppercase text-[#FAF8F3]/60 font-light select-none">
        Est. 2026
      </div>
      <div className="absolute top-8 right-8 text-[11px] tracking-[4px] uppercase text-[#FAF8F3]/60 font-light select-none">
        Wave Bolgoda · LK
      </div>
      <div className="absolute bottom-8 left-8 text-[11px] tracking-[4px] uppercase text-[#FAF8F3]/60 font-light select-none">
        No. 01 / 10.11.26
      </div>
      <div className="absolute bottom-8 right-8 text-[11px] tracking-[4px] uppercase text-[#FAF8F3]/60 font-light select-none">
        You&apos;re Invited
      </div>

      {/* Center Card Content */}
      <div className="relative z-10 max-w-xl mx-auto px-6 text-center flex flex-col items-center">
        {/* Monogram Crest */}
        <div className="w-16 h-16 rounded-full border border-[#D4AF37]/50 flex items-center justify-center mb-6 bg-[#162115]/60 shadow-lg">
          <span className="font-script text-3xl text-[#D4AF37]">BA</span>
        </div>

        {/* Personalized Guest Greeting */}
        {guestName && (
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#556B2F]/30 border border-[#8A9A5B]/40 text-[#D9DEC9] text-xs uppercase tracking-widest mb-4">
            <Heart className="w-3 h-3 text-[#D4AF37] fill-[#D4AF37]" />
            <span>Dear {guestName}</span>
          </div>
        )}

        <p className="text-xs tracking-[5px] uppercase text-[#8A9A5B] font-medium mb-3">
          Together With Their Families
        </p>

        <h1 className="font-serif text-5xl sm:text-7xl font-light tracking-wide text-[#FAF8F3] mb-4">
          Bumika <span className="font-script text-4xl sm:text-6xl text-[#D4AF37]">&amp;</span> Achini
        </h1>

        <p className="font-serif text-lg sm:text-xl text-[#FAF8F3]/80 italic max-w-md mb-8">
          Joyfully request the pleasure of your company as they celebrate their wedding and unite in love.
        </p>

        <div className="flex items-center gap-3 text-xs tracking-[3px] uppercase text-[#FAF8F3]/70 border-y border-[#3F5021]/60 py-2.5 px-6 mb-10">
          <span>Tuesday</span>
          <span className="text-[#D4AF37]">•</span>
          <span>10 November 2026</span>
          <span className="text-[#D4AF37]">•</span>
          <span>Wave Bolgoda</span>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-center w-full max-w-xs">
          <button
            onClick={handleOpen}
            className="w-full flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-[#556B2F] hover:bg-[#688339] text-[#FAF8F3] font-medium text-sm tracking-wider uppercase transition-all shadow-xl hover:shadow-[#556B2F]/40 cursor-pointer active:scale-95"
          >
            <Mail className="w-4 h-4 text-[#D4AF37]" />
            <span>Open Invitation</span>
          </button>
        </div>
      </div>
    </div>
  );
};
