import React, { useState } from 'react';
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  Camera,
  Layers,
  Palette,
  SunMoon,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { SceneMode, RingFinish, LightingAtmosphere, CameraPreset } from '../../types/wedding';

interface SceneDockProps {
  sceneMode: SceneMode;
  onSceneModeChange: (mode: SceneMode) => void;
  ringFinish: RingFinish;
  onRingFinishChange: (finish: RingFinish) => void;
  lighting: LightingAtmosphere;
  onLightingChange: (atmo: LightingAtmosphere) => void;
  cameraPreset: CameraPreset;
  onCameraPresetChange: (preset: CameraPreset) => void;
  ringSeparation: number;
  onRingSeparationChange: (val: number) => void;
  isAudioPlaying: boolean;
  onToggleAudio: () => void;
  onTriggerPetals: () => void;
  onJumpToRsvp?: () => void;
  positionMode?: 'fixed' | 'absolute';
}

export const SceneDock: React.FC<SceneDockProps> = ({
  sceneMode,
  onSceneModeChange,
  ringFinish,
  onRingFinishChange,
  lighting,
  onLightingChange,
  cameraPreset,
  onCameraPresetChange,
  ringSeparation,
  onRingSeparationChange,
  isAudioPlaying,
  onToggleAudio,
  onTriggerPetals,
  onJumpToRsvp,
  positionMode = 'fixed',
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'scene' | 'materials' | 'lights' | 'camera'>('scene');

  const posClass =
    positionMode === 'absolute'
      ? `absolute left-1/2 -translate-x-1/2 z-30 ${isCollapsed ? 'bottom-1' : 'bottom-3'}`
      : `fixed left-1/2 -translate-x-1/2 z-40 ${isCollapsed ? 'bottom-2' : 'bottom-6'}`;

  return (
    <div
      className={`${posClass} transition-all duration-300 w-[94vw] max-w-[880px] pointer-events-auto`}
    >
      {/* Collapse Toggle Tab */}
      <div className="flex justify-center -mb-[1px]">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-medium tracking-wider uppercase bg-[#182119] text-[#E8E4D8] border-t border-x border-[#3F5021]/40 rounded-t-lg shadow-lg hover:bg-[#232F24] transition-colors cursor-pointer"
          aria-label={isCollapsed ? 'Show 3D Controls' : 'Hide 3D Controls'}
        >
          {isCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5 text-[#8A9A5B]" />
              <span>Show 3D Controls</span>
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5 text-[#8A9A5B]" />
              <span>Hide Dock (Zen Mode)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Dock Container - solid/rgba surface (no backdrop-filter over WebGL) */}
      {!isCollapsed && (
        <div className="bg-[#121A13] border border-[#3F5021]/50 rounded-2xl p-3.5 shadow-2xl text-[#FAF8F3]">
          {/* Top Bar: Sub-Tabs & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2A3B23] pb-2.5 mb-3">
            {/* Control Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto py-0.5">
              <button
                onClick={() => setActiveTab('scene')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-colors ${
                  activeTab === 'scene'
                    ? 'bg-[#556B2F] text-white shadow-sm'
                    : 'text-[#C5D0BA] hover:bg-[#1E2B1F]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Scenes</span>
              </button>

              <button
                onClick={() => setActiveTab('materials')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-colors ${
                  activeTab === 'materials'
                    ? 'bg-[#556B2F] text-white shadow-sm'
                    : 'text-[#C5D0BA] hover:bg-[#1E2B1F]'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Ring Metals</span>
              </button>

              <button
                onClick={() => setActiveTab('lights')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-colors ${
                  activeTab === 'lights'
                    ? 'bg-[#556B2F] text-white shadow-sm'
                    : 'text-[#C5D0BA] hover:bg-[#1E2B1F]'
                }`}
              >
                <SunMoon className="w-3.5 h-3.5" />
                <span>Atmosphere</span>
              </button>

              <button
                onClick={() => setActiveTab('camera')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide transition-colors ${
                  activeTab === 'camera'
                    ? 'bg-[#556B2F] text-white shadow-sm'
                    : 'text-[#C5D0BA] hover:bg-[#1E2B1F]'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Angles</span>
              </button>
            </div>

            {/* Quick Actions (Audio & Petals & RSVP) */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={onToggleAudio}
                title={isAudioPlaying ? 'Mute Music' : 'Play Music'}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isAudioPlaying
                    ? 'bg-[#556B2F]/40 border-[#8A9A5B] text-[#D9DEC9]'
                    : 'bg-[#182319] border-[#2E3F28] text-[#8A8A82] hover:text-[#D9DEC9]'
                }`}
              >
                {isAudioPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                onClick={onTriggerPetals}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#2A3A23] hover:bg-[#384E2F] text-[#FAF8F3] border border-[#556B2F]/60 transition-colors cursor-pointer"
                title="Scatter olive leaves & rose petals"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden sm:inline">Petal Shower</span>
              </button>

              {onJumpToRsvp && (
                <button
                  onClick={onJumpToRsvp}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[#556B2F] hover:bg-[#688339] text-white transition-colors cursor-pointer"
                >
                  RSVP Now
                </button>
              )}
            </div>
          </div>

          {/* Sub-panel content based on activeTab */}
          <div className="min-h-[46px] flex items-center justify-between gap-3">
            {activeTab === 'scene' && (
              <div className="flex flex-wrap items-center justify-between gap-3 w-full">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] uppercase tracking-wider text-[#8A9A5B] font-semibold mr-1">
                    Select Scene:
                  </span>
                  {[
                    { id: 'rings', label: '💍 The Rings' },
                    { id: 'arch', label: '🏛️ Colombo Arch' },
                    { id: 'toast', label: '🥂 Crystal Toast' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => onSceneModeChange(s.id as SceneMode)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                        sceneMode === s.id
                          ? 'bg-[#FAF8F3] text-[#121A13] font-semibold'
                          : 'bg-[#1C271E] text-[#C0CDAF] hover:bg-[#28382B]'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>

                {/* Ring separation slider when in rings scene */}
                {sceneMode === 'rings' && (
                  <div className="flex items-center gap-2 text-xs text-[#D9DEC9] ml-auto">
                    <span className="text-[11px] text-[#A6B690]">Unite</span>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={ringSeparation}
                      onChange={(e) => onRingSeparationChange(parseFloat(e.target.value))}
                      className="w-24 sm:w-36 accent-[#D4AF37] h-1.5 bg-[#2B3C27] rounded-lg cursor-pointer"
                    />
                    <span className="text-[11px] text-[#A6B690]">Separate</span>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="flex flex-wrap items-center gap-2 w-full">
                <span className="text-[11px] uppercase tracking-wider text-[#8A9A5B] font-semibold mr-1">
                  Precious Metal:
                </span>
                {[
                  { id: 'yellow_gold', label: '18K Yellow Gold', color: '#D4AF37' },
                  { id: 'rose_gold', label: 'Champagne Rose Gold', color: '#B76E79' },
                  { id: 'platinum', label: 'Platinum & Ice Diamond', color: '#E5E4E2' },
                  { id: 'sapphire', label: 'Ceylon Royal Sapphire', color: '#1D3D63' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => onRingFinishChange(m.id as RingFinish)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      ringFinish === m.id
                        ? 'bg-[#FAF8F3] text-[#121A13] font-semibold'
                        : 'bg-[#1C271E] text-[#C0CDAF] hover:bg-[#28382B]'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-black/20"
                      style={{ backgroundColor: m.color }}
                    />
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'lights' && (
              <div className="flex flex-wrap items-center gap-2 w-full">
                <span className="text-[11px] uppercase tracking-wider text-[#8A9A5B] font-semibold mr-1">
                  Lighting Mood:
                </span>
                {[
                  { id: 'golden_hour', label: '🌅 Golden Hour Glow', desc: 'Warm Ceylon sunlight' },
                  { id: 'candlelight', label: '🕯️ Candlelight Ambiance', desc: 'Intimate warm romance' },
                  { id: 'colombo_night', label: '✨ Colombo Starlit Night', desc: 'Deep sapphire elegance' },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => onLightingChange(l.id as LightingAtmosphere)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      lighting === l.id
                        ? 'bg-[#FAF8F3] text-[#121A13] font-semibold'
                        : 'bg-[#1C271E] text-[#C0CDAF] hover:bg-[#28382B]'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}

            {activeTab === 'camera' && (
              <div className="flex flex-wrap items-center gap-2 w-full">
                <span className="text-[11px] uppercase tracking-wider text-[#8A9A5B] font-semibold mr-1">
                  Camera Views:
                </span>
                {[
                  { id: 'default', label: 'Perspective View' },
                  { id: 'closeup', label: 'Macro Rings & Diamond' },
                  { id: 'topdown', label: 'Top-Down Monogram' },
                  { id: 'arch', label: 'Ceremony Aisle' },
                ].map((c) => (
                  <button
                    key={c.id}
                    onClick={() => onCameraPresetChange(c.id as CameraPreset)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      cameraPreset === c.id
                        ? 'bg-[#FAF8F3] text-[#121A13] font-semibold'
                        : 'bg-[#1C271E] text-[#C0CDAF] hover:bg-[#28382B]'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
