export type Screen = 'home' | 'sleep' | 'story' | 'battle' | 'weekend' | 'formation' | 'gacha';

export interface SleepRecord {
  date: string;
  hours: number;
  bedtime: string;
  quality: number;
}

export interface GameInventory {
  dreamStones: number;
  tickets: number;
  stamina: number;
  gold: number;
  clearedStages: string[];
  party: string[];
  sleepRecords: SleepRecord[];
  tutorialComplete: boolean;
  playerLevel: number;
  playerExp: number;
  gachaItems: string[];
}
