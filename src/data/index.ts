import chaptersJson from './data/chapters.json';
import charactersJson from './data/characters.json';
import enemiesJson from './data/enemies.json';
import bannersJson from './data/banners.json';
import weekendBossJson from './data/weekendBoss.json';
import tutorialJson from './data/tutorial.json';
import manifestJson from '../public/assets/placeholders/manifest.json';
import { bannerSchema, characterSchema, chapterSchema, enemySchema } from './data/schema';

export const chapters = zArray(chapterSchema, chaptersJson);
export const characters = zArray(characterSchema, charactersJson);
export const enemies = zArray(enemySchema, enemiesJson);
export const banners = zArray(bannerSchema, bannersJson);
export const weekendBoss = weekendBossJson;
export const tutorial = tutorialJson;
export const assetManifest = manifestJson as Record<string, string>;

function zArray<T>(schema: { parse: (value: unknown) => T }, values: unknown): T[] {
  if (!Array.isArray(values)) throw new Error('ゲームデータ配列ではありません');
  return values.map((value) => schema.parse(value));
}
