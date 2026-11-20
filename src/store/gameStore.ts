import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameInventory, Screen, SleepRecord } from '../types/game';

interface GameState extends GameInventory {
  screen: Screen;
  setScreen: (screen: Screen) => void;
  saveSleep: (record: SleepRecord) => void;
  clearStage: (stageId: string) => void;
  setParty: (party: string[]) => void;
  spendStamina: (amount: number) => boolean;
  addDreamStones: (amount: number) => void;
  addGachaItem: (itemId: string) => void;
  completeTutorial: () => void;
  gainPlayerExp: (amount: number) => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      screen: 'home',
      dreamStones: 1000,
      tickets: 1,
      stamina: 100,
      gold: 5000,
      clearedStages: [],
      party: ['lumi', 'rem', 'sol', 'nap'],
      sleepRecords: [],
      tutorialComplete: false,
      playerLevel: 1,
      playerExp: 0,
      gachaItems: [],
      setScreen: (screen) => set({ screen }),
      saveSleep: (record) => set((state) => ({
        sleepRecords: [...state.sleepRecords.filter((item) => item.date !== record.date), record]
          .sort((a, b) => a.date.localeCompare(b.date)),
      })),
      clearStage: (stageId) => set((state) => ({
        clearedStages: state.clearedStages.includes(stageId)
          ? state.clearedStages
          : [...state.clearedStages, stageId],
      })),
      setParty: (party) => set({ party }),
      spendStamina: (amount) => {
        if (get().stamina < amount) return false;
        set((state) => ({ stamina: state.stamina - amount }));
        return true;
      },
      addDreamStones: (amount) => set((state) => ({ dreamStones: state.dreamStones + amount })),
      addGachaItem: (itemId) => set((state) => ({ gachaItems: [...state.gachaItems, itemId] })),
      completeTutorial: () => set({ tutorialComplete: true }),
      gainPlayerExp: (amount) => set((state) => {
        let level = state.playerLevel;
        let exp = state.playerExp + amount;
        while (exp >= level * 2 - 1) {
          exp -= level * 2 - 1;
          level += 1;
        }
        return { playerLevel: level, playerExp: exp };
      }),
    }),
    { name: 'sleep-rpg-game-state' },
  ),
);
