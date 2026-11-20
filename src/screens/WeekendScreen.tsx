import { useState } from 'react';
import weekendBoss from '../data/weekendBoss.json';
import { LocalRoomRepository } from '../services/roomRepository';

export function WeekendScreen() {
  const [code, setCode] = useState('WEEKEND');
  const [joined, setJoined] = useState(false);
  const join = () => {
    new LocalRoomRepository().join(code, { id: 'self', name: 'あなた', avatarId: 'lumi', isSelf: true, sleepRank: 'A' });
    setJoined(true);
  };

  return <div className="weekend-layout"><section className="panel"><h1>週末ボス</h1><h2>{weekendBoss.name}</h2><p>{weekendBoss.appearMessage}</p><label>ルームコード<input value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} /></label><button onClick={join}>ルームに参加</button>{joined && <button>週末ボスに挑む</button>}</section><section className="panel"><h2>チーム概要</h2><p>自分枠のみ編集可能</p><p>睡眠バフ：準備中</p></section></div>;
}
