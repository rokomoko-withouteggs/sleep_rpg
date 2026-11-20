import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import chapters from '../data/chapters.json';

export function StoryScreen({ onStartBattle }: { onStartBattle: (stageId: string) => void }) {
  const [chapterIndex, setChapterIndex] = useState(0);
  const cleared = useGameStore((state) => state.clearedStages);
  const stamina = useGameStore((state) => state.stamina);
  const party = useGameStore((state) => state.party);
  const chapter = chapters[chapterIndex];

  const isUnlocked = (stageIndex: number) => {
    const stage = chapter.stages[stageIndex];
    return !stage.unlockPrevious || cleared.includes(stage.unlockPrevious);
  };

  return <div className="story-layout">
    <aside className="party-portraits">{party.map((id) => <div className="portrait" key={id}>{id}</div>)}</aside>
    <section className="panel story-list">
      <div className="chapter-tabs">{chapters.map((item, index) => <button className={index === chapterIndex ? 'active' : ''} key={item.id} onClick={() => setChapterIndex(index)}>{item.title}</button>)}</div>
      {chapter.stages.map((stage, index) => {
        const unlocked = isUnlocked(index);
        return <button className="stage-row" disabled={!unlocked || stage.stamina > stamina} key={stage.id} onClick={() => onStartBattle(stage.id)}>
          <span><strong>{stage.id}</strong> {stage.name}</span><small>{stage.type === 'conversation' ? '会話' : `戦闘 / ST ${stage.stamina}`}</small>
          {cleared.includes(stage.id) && <b>クリア</b>}
        </button>;
      })}
    </section>
  </div>;
}
