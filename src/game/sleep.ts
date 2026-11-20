import type { SleepRecord } from '../types/game';

export const round = (value: number): number => Math.floor(value + 0.5);

export function calculateSleepScore(record: SleepRecord, recentBedtimes: string[] = []): number {
  let basic = 0;
  if (record.hours >= 7) basic = 20;
  else if (record.hours >= 6) basic = 15;
  else if (record.hours >= 5) basic = 5;

  let regularity = 0;
  const bedtimes = recentBedtimes.filter(Boolean);
  if (bedtimes.length > 0) {
    const target = minuteOfDay(record.bedtime);
    const diffs = bedtimes.map((time) => Math.abs(minuteOfDay(time) - target));
    if (diffs.every((diff) => diff <= 60)) regularity = 15;
  }

  const quality = Math.max(0, Math.min(5, record.quality)) * 9;
  return Math.min(200, basic + regularity + quality);
}

export function sleepRank(score: number): 'S' | 'A' | 'B' | 'C' | 'D' {
  if (score >= 180) return 'S';
  if (score >= 150) return 'A';
  if (score >= 120) return 'B';
  if (score >= 80) return 'C';
  return 'D';
}

export function minuteOfDay(time: string): number {
  const [hour, minute] = time.split(':').map(Number);
  return hour * 60 + minute;
}

export function sleepReward(record: SleepRecord): { stones: number; ticket: number } {
  if (record.hours >= 7) return { stones: 100, ticket: 1 };
  if (record.hours >= 6) return { stones: 25, ticket: 0 };
  return { stones: 0, ticket: 0 };
}
