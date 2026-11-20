import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import tutorial from '../data/tutorial.json';

export function Tutorial() {
  const [index, setIndex] = useState(0);
  const completeTutorial = useGameStore((state) => state.completeTutorial);
  const setScreen = useGameStore((state) => state.setScreen);

  if (index >= tutorial.length) {
    completeTutorial();
    return null;
  }

  const item = tutorial[index];
  const destinations = ['sleep', 'story', 'formation', 'gacha', 'weekend'] as const;

  return (
    <div className="tutorial-overlay" role="dialog" aria-modal="true">
      <div className="tutorial-card">
        <p>チュートリアル {index + 1}/{tutorial.length}</p>
        <h2>{item.title}</h2>
        <p>{item.text}</p>
        <div className="row-actions">
          <button className="secondary" onClick={() => setIndex(tutorial.length)}>スキップ</button>
          <button onClick={() => {
            setScreen(destinations[index]);
            setIndex((value) => value + 1);
          }}>次へ</button>
        </div>
      </div>
    </div>
  );
}
