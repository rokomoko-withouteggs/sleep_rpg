import type { CharacterTemplate } from '../game/types';

export interface GachaItem {
  itemId: string;
  name: string;
  rarity: 'N' | 'R' | 'SR' | 'SSR';
  type: 'character' | 'equipment' | 'skill';
}

export interface GachaBanner {
  id: string;
  name: string;
  description: string;
  rates: Record<GachaItem['rarity'], number>;
  lineup: GachaItem[];
}

export function rollGacha(banner: GachaBanner, random = Math.random): GachaItem[] {
  const item = () => {
    const roll = random() * 100;
    let cumulative = 0;
    let rarity: GachaItem['rarity'] = 'N';
    for (const name of ['SSR', 'SR', 'R', 'N'] as const) {
      cumulative += banner.rates[name];
      if (roll < cumulative) { rarity = name; break; }
    }
    const pool = banner.lineup.filter((entry) => entry.rarity === rarity);
    const fallback = pool[0] ?? banner.lineup[0];
    if (!fallback) throw new Error('ガチャに排出アイテムがありません');
    return fallback;
  };
  return Array.from({ length: 1 }, item);
}

export function rollGacha10(banner: GachaBanner, random = Math.random): GachaItem[] {
  return Array.from({ length: 10 }, () => rollGacha(banner, random)[0]);
}
