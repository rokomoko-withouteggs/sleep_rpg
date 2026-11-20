import type { ReactNode } from 'react';
import { useGameStore } from '../store/gameStore';

export function AppLayout({ children }: { children: ReactNode }) {
  const setScreen = useGameStore((state) => state.setScreen);
  const level = useGameStore((state) => state.playerLevel);
  const stones = useGameStore((state) => state.dreamStones);
  const stamina = useGameStore((state) => state.stamina);

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="home-button" onClick={() => setScreen('home')} aria-label="ホームへ">⌂ ホーム</button>
        <div className="status-bar">
          <span>Lv {level}</span><span>◆ {stones}</span><span>スタミナ {stamina}/100</span>
        </div>
      </header>
      <main className="main-content">{children}</main>
      <nav className="quick-nav" aria-label="クイック遷移">
        <button onClick={() => setScreen('sleep')}>睡眠</button>
        <button onClick={() => setScreen('story')}>ストーリー</button>
        <button onClick={() => setScreen('weekend')}>週ボス</button>
        <button onClick={() => setScreen('formation')}>編成</button>
        <button onClick={() => setScreen('gacha')}>ガチャ</button>
      </nav>
    </div>
  );
}
