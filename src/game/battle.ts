import type { CharacterTemplate } from './types';

export interface Effect {
  type: 'ultimatePower' | 'damageUp' | 'defenseUp' | 'attackUp';
  value: number;
  duration?: number;
}

export const round = (value: number): number => Math.floor(value + 0.5);

export function maxHp(template: CharacterTemplate, level: number, armorHp = 0): number {
  return round(template.hpBase * (1 + 0.03 * level) + armorHp);
}

export function normalAttack(template: CharacterTemplate, level: number, weaponAttack = 0, effects: Effect[] = []): number {
  let damage = (template.attack * (1 + 0.01 * level) * 0.22 + weaponAttack * 0.1);
  for (const effect of effects.filter((item) => item.type === 'damageUp')) damage *= effect.value;
  return round(damage);
}

export function ultimateDamage(template: CharacterTemplate, level: number, effects: Effect[] = []): number {
  if (template.role !== 'remAttacker' && template.role !== 'knightGuard') return 0;
  let damage = template.attack * template.ultimatePower * (1 + 0.02 * level) * 0.15;
  for (const effect of effects) if (effect.type === 'damageUp') damage *= effect.value;
  for (const effect of effects) if (effect.type === 'ultimatePower') damage *= effect.value;
  return round(damage);
}

export function ultimateHeal(template: CharacterTemplate, level: number): number {
  if (template.role !== 'dreamHealer') return 0;
  return round(template.attack * template.ultimatePower * (1 + 0.01 * level) * 0.15);
}

export function ultimateAttackBuff(template: CharacterTemplate, level: number): number {
  if (template.role !== 'napSupport') return 0;
  return round(template.attack * template.ultimatePower * (1 + 0.01 * level) * 0.0015);
}

export function defendedDamage(damage: number, defending: boolean): number {
  return round(defending ? damage / 5 : damage);
}
