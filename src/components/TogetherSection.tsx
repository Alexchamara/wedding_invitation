import React, { useState } from 'react';
import { Sparkles, Heart } from 'lucide-react';

interface TogetherSectionProps {
  onExplore3dRings: () => void;
  onJumpToRsvp: () => void;
}

export const TogetherSection: React.FC<TogetherSectionProps> = ({
  onExplore3dRings,
  onJumpToRsvp,
}) => {
  const [unionProgress, setUnionProgress] = useState(0.85); // 0 (separated) to 1 (united)

  return (
    <section id="together" className="py-24 px-4 bg-[#F2EEE4] text-[#2A2A2A] relative overflow-hidden">
      {/* Decorative background glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-all duration-500"
        style={{
          width: `${300 + unionProgress * 400}px`,
          height: `${300 + unionProgress * 400}px`,
          background: 'radial-gradient(circle, rgba(212,175,55,0.18) 0%, rgba(85,107,47,0.06) 50%, transparent 75%)',
        }}
      />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <p className="text-xs uppercase tracking-[4px] text-[#556B2F] font-medium mb-2">
          Where Two Paths Cross
        </p>
        <h2 className="font-serif text-3xl sm:text-5xl font-light text-[#2A2A2A] mb-4">
          Two Becoming One
        </h2>
        <div className="w-16 h-[1px] bg-[#C5A059] mx-auto mb-8" />

        <p className="font-serif text-lg sm:text-xl italic text-[#4A4A45] max-w-xl mx-auto mb-12">
          &ldquo;Two lives, one promise. A forever begins under the Ceylon sky.&rdquo;
        </p>

        {/* Interactive Union Demonstration */}
        <div className="bg-white/80 border border-[#E8E4D8] rounded-3xl p-8 sm:p-12 shadow-sm max-w-2xl mx-auto mb-10">
          <div className="relative h-44 flex items-center justify-center overflow-hidden mb-8">
            {/* Connecting Aura Spark */}
            <div
              className="absolute w-20 h-20 rounded-full bg-[#D4AF37]/30 blur-xl transition-all duration-300"
              style={{
                opacity: unionProgress > 0.7 ? 1 : 0.3,
                transform: `scale(${0.5 + unionProgress * 1.2})`,
              }}
            />

            {/* Left Silhouette (Achini) */}
            <div
              className="absolute transition-transform duration-150 flex flex-col items-center"
              style={{
                transform: `translateX(-${(1 - unionProgress) * 140 + 35}px)`,
              }}
            >
              <div className="w-20 h-20 rounded-full border-2 border-[#556B2F] bg-[#FAF8F3] flex items-center justify-center shadow-md">
                <span className="font-script text-2xl text-[#556B2F]">Achini</span>
              </div>
              <span className="text-[11px] uppercase tracking-wider text-[#8A8A82] mt-2 font-medium">
                The Bride
              </span>
            </div>

            {/* Union Heart / Spark */}
            <div
              className="z-20 transition-all duration-300 flex items-center justify-center"
              style={{
                transform: `scale(${unionProgress > 0.9 ? 1.25 : 0.8})`,
              }}
            >
              <div className="w-10 h-10 rounded-full bg-[#556B2F] text-white flex items-center justify-center shadow-lg">
                <Heart className="w-5 h-5 fill-current text-[#FAF8F3]" />
              </div>
            </div>

            {/* Right Silhouette (Bumika) */}
            <div
              className="absolute transition-transform duration-150 flex flex-col items-center"
              style={{
                transform: `translateX(${(1 - unionProgress) * 140 + 35}px)`,
              }}
            >
              <div className="w-20 h-20 rounded-full border-2 border-[#3F5021] bg-[#FAF8F3] flex items-center justify-center shadow-md">
                <span className="font-script text-2xl text-[#3F5021]">Bumika</span>
              </div>
              <span className="text-[11px] uppercase tracking-wider text-[#8A8A82] mt-2 font-medium">
                The Groom
              </span>
            </div>
          </div>

          {/* Interactive Union Slider */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between text-xs text-[#8A8A82] uppercase tracking-wider mb-2">
              <span>Two Paths</span>
              <span className="text-[#556B2F] font-semibold">
                {unionProgress >= 0.95 ? 'United as One ♡' : 'Coming Together'}
              </span>
              <span>One Future</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.01"
              value={unionProgress}
              onChange={(e) => setUnionProgress(parseFloat(e.target.value))}
              className="w-full h-2 bg-[#E8E4D8] rounded-lg accent-[#556B2F] cursor-pointer"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onExplore3dRings}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#556B2F] hover:bg-[#3F5021] text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Interact With 3D Wedding Rings</span>
          </button>

          <button
            onClick={onJumpToRsvp}
            className="px-6 py-3 rounded-xl bg-white hover:bg-[#FAF8F3] text-[#2A2A2A] border border-[#E8E4D8] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
          >
            Respond to Invitation
          </button>
        </div>
      </div>
    </section>
  );
};
