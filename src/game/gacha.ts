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
  const totalRate = Object.values(banner.rates).reduce((sum, rate) => sum + rate, 0);
  if (Math.abs(totalRate - 100) > 0.0001) {
    throw new Error(`ガチャ排出率の合計は100である必要があります（現在: ${totalRate}）`);
  }
  if (banner.lineup.length === 0) throw new Error('ガチャに排出アイテムがありません');

  const value = Math.min(Math.max(random(), 0), 0.999999999) * 100;
  let cumulative = 0;
  let rarity: GachaItem['rarity'] = 'N';
  for (const candidate of ['SSR', 'SR', 'R', 'N'] as const) {
    cumulative += banner.rates[candidate];
    if (value < cumulative) {
      rarity = candidate;
      break;
    }
  }

  const pool = banner.lineup.filter((item) => item.rarity === rarity);
  const selectedPool = pool.length ? pool : banner.lineup;
  const itemIndex = Math.min(Math.floor(random() * selectedPool.length), selectedPool.length - 1);
  return [selectedPool[Math.max(0, itemIndex)]];
}

export function rollGacha10(banner: GachaBanner, random = Math.random): GachaItem[] {
  return Array.from({ length: 10 }, () => rollGacha(banner, random)[0]);
}
