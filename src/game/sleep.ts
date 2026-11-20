import { round } from './battle';
import type { SleepRecord } from '../types/game';

export const roundScore = round;

export function calculateSleepScore(record: SleepRecord, recentBedtimes: string[] = []): number {
  const basic = basicSleepPoints(record.hours);
  const regularity = isBedtimeRegular(record.bedtime, recentBedtimes) ? 15 : 0;
  const quality = Math.max(0, Math.min(5, record.quality)) * 9;
  return Math.min(80, basic + regularity + quality);
}

export function calculateWeeklySleepScore(records: SleepRecord[]): number {
  const week = records.slice(-7);
  if (week.length === 0) return 0;
  const basic = week.reduce((total, record) => total + basicSleepPoints(record.hours), 0);
  const averageQuality = week.reduce((total, record) => total + Math.max(0, Math.min(5, record.quality)), 0) / week.length;
  const regularity = isWeeklyRegular(week.map((record) => record.bedtime)) ? 15 : 0;
  return Math.min(200, basic + Math.round(averageQuality * 9) + regularity);
}

function basicSleepPoints(hours: number): number {
  if (hours >= 7) return 20;
  if (hours >= 6) return 15;
  if (hours >= 5) return 5;
  return 0;
}

function isBedtimeRegular(bedtime: string, recent: string[]): boolean {
  return recent.length > 0 && recent.every((time) => circularTimeDifference(bedtime, time) <= 60);
}

function isWeeklyRegular(bedtimes: string[]): boolean {
  if (bedtimes.length < 2) return false;
  const minutes = bedtimes.map(minuteOfDay);
  return minutes.every((time) => minutes.every((other) => circularMinuteDifference(time, other) <= 60));
}

function circularTimeDifference(first: string, second: string): number {
  return circularMinuteDifference(minuteOfDay(first), minuteOfDay(second));
}

function circularMinuteDifference(first: number, second: number): number {
  const difference = Math.abs(first - second);
  return Math.min(difference, 1440 - difference);
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

export function sleepReward(record: SleepRecord): { stones: number; ticket: number; staminaFull: boolean } {
  if (record.hours >= 7) return { stones: 100, ticket: 1, staminaFull: true };
  if (record.hours >= 6) return { stones: 25, ticket: 0, staminaFull: true };
  return { stones: 0, ticket: 0, staminaFull: false };
}
