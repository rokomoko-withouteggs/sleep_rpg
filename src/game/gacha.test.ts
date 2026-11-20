import { describe, expect, it } from 'vitest';
import { rollGacha10 } from './gacha';

const banner = { id: 'test', name: 'Test', description: 'Test', rates: { SSR: 3, SR: 17, R: 60, N: 20 }, lineup: [{ itemId: 'n', name: 'N', rarity: 'N' as const, type: 'skill' as const }, { itemId: 'r', name: 'R', rarity: 'R' as const, type: 'skill' as const }, { itemId: 'sr', name: 'SR', rarity: 'SR' as const, type: 'equipment' as const }, { itemId: 'ssr', name: 'SSR', rarity: 'SSR' as const, type: 'character' as const }] };

describe('gacha', () => {
  it('rolls exactly ten items', () => expect(rollGacha10(banner, () => 0.99)).toHaveLength(10));
  it('uses configured rarity boundaries', () => {
    expect(rollGacha10(banner, () => 0.01)[0].rarity).toBe('SSR');
  });
});
