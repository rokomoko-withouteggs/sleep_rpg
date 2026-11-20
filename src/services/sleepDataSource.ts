export interface SleepRecord {
  date: string;
  hours: number;
  bedtime: string;
  quality: number;
}

export interface SleepDataSource {
  getDailySleep(date: string): Promise<SleepRecord | null>;
  saveDailySleep(record: SleepRecord): Promise<void>;
  listSleepRecords(): Promise<SleepRecord[]>;
}
