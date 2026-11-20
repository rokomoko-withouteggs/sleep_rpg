import { describe, expect, it } from 'vitest';
import { defendedDamage, maxHp, normalAttack, ultimateDamage, ultimateHeal } from './battle';
import type { CharacterTemplate } from './types';

const attacker: CharacterTemplate = { id: 'a', name: 'A', role: 'remAttacker', hpBase: 100, attack: 100, rarity: 'R', skillName: 'x', skillCooldown: 1, ultimateName: 'x', ultimatePower: 2, assetKey: 'x' };

describe('battle formulas', () => {
  it('rounds normal damage', () => {
    expect(normalAttack(attacker, 1)).toBe(22 + 0); // (100*1.01*.22)=22.22
  });
  it('rounds ultimate damage', () => {
    expect(ultimateDamage(attacker, 1)).toBe(31); // 100*2*1.02*.15=30.6
  });
  it('rounds defending damage to one fifth', () => expect(defendedDamage(31, true)).toBe(6));
  it('calculates max HP', () => expect(maxHp(attacker, 1, 10)).toBe(113));
  it('calculates healer ultimate recovery', () => {
    const healer = { ...attacker, role: 'dreamHealer' as const };
    expect(ultimateHeal(healer, 1)).toBe(31);
  });
});
