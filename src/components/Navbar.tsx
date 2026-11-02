import React from 'react';
import { Volume2, VolumeX, Sparkles, Box } from 'lucide-react';

interface NavbarProps {
  activeView: 'editorial' | 'immersive3d';
  onToggleView: (view: 'editorial' | 'immersive3d') => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  onScrollToSection: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onToggleView,
  isAudioPlaying,
  onToggleAudio,
  onScrollToSection,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 pointer-events-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        {/* Monogram Brand */}
        <button
          onClick={() => {
            if (activeView === 'immersive3d') onToggleView('editorial');
            onScrollToSection('hero');
          }}
          className="flex items-center gap-3 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-full border border-[#556B2F]/40 bg-[#FAF8F3]/90 shadow-sm flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="font-script text-xl text-[#3F5021]">BA</span>
          </div>
          <div className="text-left hidden sm:block">
            <div className="font-serif text-sm font-semibold tracking-wider text-[#2A2A2A]">
              Bumika &amp; Achini
            </div>
            <div className="text-[10px] tracking-widest uppercase text-[#556B2F]">
              10 · 11 · 2026
            </div>
          </div>
        </button>

        {/* Center Nav Links (when in editorial view) */}
        {activeView === 'editorial' && (
          <nav className="hidden md:flex items-center gap-5 text-xs uppercase tracking-widest text-[#4A4A45] font-medium bg-[#FAF8F3]/80 px-6 py-2 rounded-full border border-[#E8E4D8] shadow-sm">
            <button
              onClick={() => onScrollToSection('countdown')}
              className="hover:text-[#556B2F] transition-colors cursor-pointer font-semibold text-[#556B2F]"
            >
              Countdown
            </button>
            <button
              onClick={() => onScrollToSection('venues')}
              className="hover:text-[#556B2F] transition-colors cursor-pointer"
            >
              Wave Bolgoda
            </button>
            <button
              onClick={() => onScrollToSection('faq')}
              className="hover:text-[#556B2F] transition-colors cursor-pointer"
            >
              Details &amp; FAQ
            </button>
          </nav>
        )}

        {/* Right Actions: 3D Stage Switcher & Audio FAB */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher Button */}
          <button
            onClick={() => onToggleView(activeView === 'editorial' ? 'immersive3d' : 'editorial')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide border shadow-sm transition-all cursor-pointer ${
              activeView === 'immersive3d'
                ? 'bg-[#556B2F] text-white border-[#3F5021]'
                : 'bg-[#FAF8F3] text-[#2A2A2A] border-[#E8E4D8] hover:border-[#556B2F]'
            }`}
          >
            {activeView === 'immersive3d' ? (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Story &amp; Invitation</span>
              </>
            ) : (
              <>
                <Box className="w-3.5 h-3.5 text-[#556B2F]" />
                <span>3D Stage (Full View)</span>
              </>
            )}
          </button>

          {/* Audio Synthesizer FAB */}
          <button
            onClick={onToggleAudio}
            title={isAudioPlaying ? 'Mute Music' : 'Play Music'}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-sm ${
              isAudioPlaying
                ? 'bg-[#556B2F] border-[#3F5021] text-white animate-spin-slow'
                : 'bg-[#FAF8F3] border-[#E8E4D8] text-[#556B2F] hover:bg-[#F2EEE4]'
            }`}
          >
            {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
