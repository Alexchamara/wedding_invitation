import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { IntroStage } from './components/IntroStage';
import { HeroSection } from './components/HeroSection';
import { Countdown } from './components/Countdown';
import { VenuesSection } from './components/VenuesSection';
import { WeddingFaq } from './components/WeddingFaq';
import { WeddingScene } from './components/3d/WeddingScene';
import { SceneDock } from './components/3d/SceneDock';
import { SceneMode, RingFinish, LightingAtmosphere, CameraPreset } from './types/wedding';
import { weddingAudio } from './utils/audio';

export default function App() {
  const [hasOpenedIntro, setHasOpenedIntro] = useState(false);
  const [guestName, setGuestName] = useState<string | undefined>(undefined);
  const [activeView, setActiveView] = useState<'editorial' | 'immersive3d'>('editorial');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  // 3D Scene Controls State
  const [sceneMode, setSceneMode] = useState<SceneMode>('rings');
  const [ringFinish, setRingFinish] = useState<RingFinish>('yellow_gold');
  const [lighting, setLighting] = useState<LightingAtmosphere>('golden_hour');
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('default');
  const [ringSeparation, setRingSeparation] = useState(0.2); // 0 (united) to 1 (separated)
  const [triggerPetalsCount, setTriggerPetalsCount] = useState(0);

  // Extract personalized guest name from URL query parameter ?n=NAME
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const n = params.get('n');
      if (n) {
        const decoded = decodeURIComponent(n).trim().replace(/[<>]/g, '');
        if (decoded.length > 0 && decoded.length <= 60) {
          setGuestName(decoded);
        }
      }
    } catch {
      // Safe fallback
    }
  }, []);

  const handleOpenInvitation = () => {
    weddingAudio.playRevealChime();
    weddingAudio.startMusic().then(() => {
      setIsAudioPlaying(true);
    });
    setHasOpenedIntro(true);
  };


  const handleToggleAudio = () => {
    const playing = weddingAudio.toggleMusic();
    setIsAudioPlaying(playing);
  };

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F3] text-[#2A2A2A] selection:bg-[#556B2F]/20 selection:text-[#3F5021]">
      {/* 1. Opening Intro Reveal Overlay */}
      {!hasOpenedIntro && (
        <IntroStage
          guestName={guestName}
          onOpen={handleOpenInvitation}
        />
      )}

      {/* 2. Top Navigation Bar */}
      <Navbar
        activeView={activeView}
        onToggleView={setActiveView}
        isAudioPlaying={isAudioPlaying}
        onToggleAudio={handleToggleAudio}
        onScrollToSection={handleScrollToSection}
      />

      {/* 3. Main View Switching */}
      {activeView === 'immersive3d' ? (
        /* ================= IMMERSIVE FULLSCREEN 3D STAGE ================= */
        <div className="relative w-screen h-screen overflow-hidden bg-[#FAF8F3]">
          {/* Header Badge */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
            <span className="text-[10px] tracking-[4px] uppercase text-[#556B2F] font-semibold bg-[#FAF8F3]/90 px-4 py-1 rounded-full border border-[#E8E4D8] shadow-xs">
              Interactive 3D Stage · Drag to Orbit
            </span>
          </div>

          {/* Three.js Canvas */}
          <WeddingScene
            sceneMode={sceneMode}
            ringFinish={ringFinish}
            lighting={lighting}
            cameraPreset={cameraPreset}
            ringSeparation={ringSeparation}
            triggerPetalsCount={triggerPetalsCount}
          />

          {/* Viewport-First Collapsible Bottom Control Dock */}
          <SceneDock
            sceneMode={sceneMode}
            onSceneModeChange={setSceneMode}
            ringFinish={ringFinish}
            onRingFinishChange={setRingFinish}
            lighting={lighting}
            onLightingChange={setLighting}
            cameraPreset={cameraPreset}
            onCameraPresetChange={setCameraPreset}
            ringSeparation={ringSeparation}
            onRingSeparationChange={setRingSeparation}
            isAudioPlaying={isAudioPlaying}
            onToggleAudio={handleToggleAudio}
            onTriggerPetals={() => setTriggerPetalsCount((c) => c + 1)}
          />
        </div>
      ) : (
        /* ================= EDITORIAL INVITATION EXPERIENCE ================= */
        <main className="relative">
          {/* Hero Section */}
          <HeroSection
            guestName={guestName}
            onEnterImmersive3d={() => setActiveView('immersive3d')}
            onScrollToNext={() => handleScrollToSection('countdown')}
          />

          {/* Ceremony & Reception Venues */}
          <VenuesSection />

          {/* Real-time Countdown Timer */}
          <Countdown />

          {/* Wedding FAQ & Details */}
          <WeddingFaq />

          {/* Editorial Footer */}
          <footer className="py-14 px-4 bg-[#FAF8F3] text-center border-t border-[#E8E4D8]">
            <div className="max-w-md mx-auto space-y-4">
              <div className="w-10 h-10 rounded-full border border-[#556B2F]/40 bg-white mx-auto flex items-center justify-center shadow-xs">
                <span className="font-script text-xl text-[#3F5021]">BA</span>
              </div>
              <p className="font-serif text-2xl font-light text-[#2A2A2A]">
                Bumika &amp; Achini
              </p>
              <p className="text-xs tracking-[4px] uppercase text-[#556B2F] font-semibold">
                Tuesday, 10 November 2026 · Wave Bolgoda, Sri Lanka
              </p>
              <div className="w-12 h-[1px] bg-[#C5A059] mx-auto my-4" />
              <p className="text-[11px] text-[#8A8A82]">
                With love and gratitude to our families and cherished friends.
              </p>
            </div>
          </footer>
        </main>
      )}
    </div>
  );
}
