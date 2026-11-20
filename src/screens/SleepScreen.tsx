import { useMemo, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { sleepRank, sleepReward, calculateSleepScore } from '../game/sleep';

export function SleepScreen() {
  const today = new Date().toISOString().slice(0, 10);
  const records = useGameStore((state) => state.sleepRecords);
  const saveSleep = useGameStore((state) => state.saveSleep);
  const addDreamStones = useGameStore((state) => state.addDreamStones);
  const existing = records.find((record) => record.date === today);
  const [date, setDate] = useState(today);
  const [hours, setHours] = useState(existing?.hours ?? 7);
  const [bedtime, setBedtime] = useState(existing?.bedtime ?? '23:30');
  const [quality, setQuality] = useState(existing?.quality ?? 4);

  const bedtimes = useMemo(() => records.map((record) => record.bedtime), [records]);
  const record = { date, hours, bedtime, quality };
  const score = calculateSleepScore(record, bedtimes);
  const rank = sleepRank(score);

  const submit = () => {
    saveSleep(record);
    const reward = sleepReward(record);
    addDreamStones(reward.stones);
  };

  return (
    <div className="two-column">
      <section className="panel">
        <h1>睡眠習慣</h1>
        <label>日付<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label>
        <label>睡眠時間（時間）<input type="number" min="0" max="24" step="0.5" value={hours} onChange={(event) => setHours(Number(event.target.value))} /></label>
        <label>就寝時刻<input type="time" value={bedtime} onChange={(event) => setBedtime(event.target.value)} /></label>
        <fieldset><legend>睡眠の質</legend>{[1,2,3,4,5].map((star) => <label className="inline" key={star}><input type="radio" name="quality" checked={quality === star} onChange={() => setQuality(star)} />★{star}</label>)}</fieldset>
        <div className="score-card"><strong>{rank}</strong><span>{score}点</span></div>
        <button onClick={submit}>保存して報酬を受け取る</button>
      </section>
      <section className="panel">
        <h2>睡眠履歴</h2>
        <table><thead><tr><th>日付</th><th>時間</th><th>質</th><th>点数</th></tr></thead><tbody>
          {[...records].reverse().map((item) => <tr key={item.date}><td>{item.date}</td><td>{item.hours}h</td><td>{'★'.repeat(item.quality)}</td><td>{calculateSleepScore(item, records.map((r) => r.bedtime))}</td></tr>)}
        </tbody></table>
      </section>
    </div>
  );
}
