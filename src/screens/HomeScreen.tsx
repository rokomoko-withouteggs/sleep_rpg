import { useGameStore } from '../store/gameStore';
import chapters from '../data/chapters.json';
import { sleepRank, calculateWeeklySleepScore } from '../game/sleep';

export function HomeScreen({ onStartBattle }: { onStartBattle: (stageId: string) => void }) {
  const records = useGameStore((state) => state.sleepRecords);
  const cleared = useGameStore((state) => state.clearedStages);
  const stones = useGameStore((state) => state.dreamStones);
  const party = useGameStore((state) => state.party);
  const rank = sleepRank(calculateWeeklySleepScore(records));

  return <div className="home-grid">
    <section className="hero-card">
      <div><p>睡眠バフ</p><h1>ランク {rank}</h1><p>{rank === 'S' || rank === 'A' ? 'EXP・ドロップ・ゴールドアップ' : rank === 'D' ? 'EXP-10%、高難易度制限' : '現在の睡眠バフなし'}</p></div>
    </section>
    <section className="panel"><h2>睡眠サマリ</h2><p>記録 {records.length}日</p><p>◆ {stones}</p></section>
    <section className="panel"><h2>ストーリー進行</h2><p>{cleared.length}ステージクリア</p><button onClick={() => useGameStore.getState().setScreen('story')}>ストーリーへ</button><ul>{chapters.map((chapter) => <li key={chapter.id}>{chapter.title}</li>)}</ul></section>
    <section className="panel"><h2>編成</h2><p>{party.join(' / ')}</p><button onClick={() => useGameStore.getState().setScreen('formation')}>編成する</button></section>
  </div>;
}
