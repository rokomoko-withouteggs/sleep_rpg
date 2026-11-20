import { describe, expect, it } from 'vitest';
import { calculateSleepScore, sleepRank, sleepReward } from '../game/sleep';

describe('sleep score', () => {
  it('calculates 7-hour and quality reward correctly', () => {
    const record = { date: '2026-11-20', hours: 7, bedtime: '23:30', quality: 5 };
    expect(calculateSleepScore(record)).toBe(65);
  });
  it('adds regularity bonus', () => {
    const record = { date: '2026-11-20', hours: 7, bedtime: '23:30', quality: 5 };
    expect(calculateSleepScore(record, ['23:20', '23:40'])).toBe(80);
  });
  it('maps ranks', () => {
    expect(sleepRank(180)).toBe('S');
    expect(sleepRank(150)).toBe('A');
    expect(sleepRank(120)).toBe('B');
    expect(sleepRank(80)).toBe('C');
    expect(sleepRank(79)).toBe('D');
  });
  it('returns daily stone and ticket rewards', () => {
    expect(sleepReward({ date: '2026-11-20', hours: 7, bedtime: '23:30', quality: 5 })).toEqual({ stones: 100, ticket: 1 });
  });
});
