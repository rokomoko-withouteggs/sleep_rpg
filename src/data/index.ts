import { z } from 'zod';
import chaptersJson from './chapters.json';
import charactersJson from './characters.json';
import enemiesJson from './enemies.json';
import bannersJson from './banners.json';
import weekendBossJson from './weekendBoss.json';
import tutorialJson from './tutorial.json';
import manifestJson from './assets.json';
import { bannerSchema, characterSchema, chapterSchema, enemySchema } from './schema';

export const chapters = parseArray(chapterSchema, chaptersJson);
export const characters = parseArray(characterSchema, charactersJson);
export const enemies = parseArray(enemySchema, enemiesJson);
export const banners = parseArray(bannerSchema, bannersJson);
export const weekendBoss = weekendBossJson;
export const tutorial = tutorialJson;
export const assetManifest = manifestJson as Record<string, string>;

function parseArray<T>(schema: z.ZodType<T>, values: unknown): T[] {
  if (!Array.isArray(values)) throw new Error('ゲームデータ配列ではありません');
  return values.map((value: unknown) => schema.parse(value));
}
