import { describe, expect, it } from 'vitest';
import { calculateSleepScore, calculateWeeklySleepScore, sleepRank, sleepReward } from './sleep';

describe('sleep score', () => {
  it('calculates daily points and quality', () => {
    const record = { date: '2026-11-20', hours: 7, bedtime: '23:30', quality: 5 };
    expect(calculateSleepScore(record)).toBe(65);
  });
  it('adds regularity bonus across midnight', () => {
    const record = { date: '2026-11-20', hours: 7, bedtime: '00:10', quality: 5 };
    expect(calculateSleepScore(record, ['23:40'])).toBe(80);
  });
  it('calculates a seven-day score against the 200-point scale', () => {
    const records = Array.from({ length: 7 }, (_, index) => ({
      date: `2026-11-${String(index + 1).padStart(2, '0')}`,
      hours: 7,
      bedtime: '23:30',
      quality: 5,
    }));
    expect(calculateWeeklySleepScore(records)).toBe(200);
  });
  it('maps ranks', () => {
    expect(sleepRank(180)).toBe('S');
    expect(sleepRank(150)).toBe('A');
    expect(sleepRank(120)).toBe('B');
    expect(sleepRank(80)).toBe('C');
    expect(sleepRank(79)).toBe('D');
  });
  it('returns daily stone, ticket and stamina rewards', () => {
    expect(sleepReward({ date: '2026-11-20', hours: 7, bedtime: '23:30', quality: 5 })).toEqual({ stones: 100, ticket: 1, staminaFull: true });
  });
});
