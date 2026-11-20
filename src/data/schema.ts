import { z } from 'zod';

export const effectSchema = z.object({
  type: z.enum(['ultimatePower', 'damageUp', 'defenseUp', 'attackUp']),
  value: z.number(),
  duration: z.number().optional(),
});

export const characterSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum(['knightGuard', 'remAttacker', 'dreamHealer', 'napSupport']),
  hpBase: z.number(),
  attack: z.number(),
  rarity: z.enum(['N', 'R', 'SR', 'SSR']),
  skillName: z.string(),
  skillCooldown: z.number(),
  ultimateName: z.string(),
  ultimatePower: z.number(),
  assetKey: z.string(),
});

export const enemySchema = z.object({
  id: z.string(),
  name: z.string(),
  hp: z.number(),
  attack: z.number(),
  assetKey: z.string(),
});

export const stageSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['conversation', 'battle', 'miniBoss', 'boss']),
  stamina: z.number(),
  enemies: z.array(z.object({ enemyId: z.string(), count: z.number().default(1) })).optional(),
  conversation: z.array(z.object({ speaker: z.string(), text: z.string(), assetKey: z.string().optional() })).optional(),
  unlockPrevious: z.string().nullable().optional(),
});

export const chapterSchema = z.object({
  id: z.string(),
  title: z.string(),
  stages: z.array(stageSchema),
});

export const bannerSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  rates: z.object({ SSR: z.number(), SR: z.number(), R: z.number(), N: z.number() }),
  lineup: z.array(z.object({ itemId: z.string(), name: z.string(), rarity: z.enum(['N', 'R', 'SR', 'SSR']), type: z.enum(['character', 'equipment', 'skill']) })),
});
