export type SceneMode = 'rings' | 'arch' | 'toast';

export type RingFinish = 'yellow_gold' | 'rose_gold' | 'platinum' | 'sapphire';

export type LightingAtmosphere = 'golden_hour' | 'candlelight' | 'colombo_night';

export type CameraPreset = 'default' | 'closeup' | 'topdown' | 'arch';

export interface RsvpData {
  id: string;
  name: string;
  attending: boolean;
  guestsCount: number;
  mealPreference: 'standard' | 'vegetarian' | 'vegan' | 'other';
  mealNote?: string;
  message?: string;
  timestamp: string;
}

export interface VenueDetail {
  id: string;
  type: 'Ceremony' | 'Reception';
  time: string;
  date: string;
  title: string;
  locationName: string;
  address: string;
  cityPostal: string;
  mapUrl: string;
  calStartTime: string;
  calEndTime: string;
}
