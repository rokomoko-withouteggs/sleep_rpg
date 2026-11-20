import type { SleepDataSource, SleepRecord } from './sleepDataSource';

const STORAGE_KEY = 'sleep-rpg:sleep-records';

export class SurveySleepDataSource implements SleepDataSource {
  async getDailySleep(date: string): Promise<SleepRecord | null> {
    const records = await this.listSleepRecords();
    return records.find((record) => record.date === date) ?? null;
  }

  async saveDailySleep(record: SleepRecord): Promise<void> {
    const records = await this.listSleepRecords();
    const next = [...records.filter((item) => item.date !== record.date), record]
      .sort((a, b) => a.date.localeCompare(b.date));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  async listSleepRecords(): Promise<SleepRecord[]> {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    try {
      return JSON.parse(raw) as SleepRecord[];
    } catch {
      return [];
    }
  }
}
