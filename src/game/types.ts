export type Role = 'knightGuard' | 'remAttacker' | 'dreamHealer' | 'napSupport';

export interface CharacterTemplate {
  id: string;
  name: string;
  role: Role;
  hpBase: number;
  attack: number;
  rarity: 'N' | 'R' | 'SR' | 'SSR';
  skillName: string;
  skillCooldown: number;
  ultimateName: string;
  ultimatePower: number;
  assetKey: string;
}
