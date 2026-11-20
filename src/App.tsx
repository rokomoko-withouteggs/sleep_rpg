import { useEffect, useState } from 'react';
import { useGameStore } from './store/gameStore';
import { audioManager } from './services/audioManager';
import { SleepScreen } from './screens/SleepScreen';
import { HomeScreen } from './screens/HomeScreen';
import { StoryScreen } from './screens/StoryScreen';
import { BattleScreen } from './screens/BattleScreen';
import { FormationScreen } from './screens/FormationScreen';
import { GachaScreen } from './screens/GachaScreen';
import { WeekendScreen } from './screens/WeekendScreen';
import { Tutorial } from './components/Tutorial';
import { AppLayout } from './components/AppLayout';

export default function App() {
  const screen = useGameStore((state) => state.screen);
  const tutorialComplete = useGameStore((state) => state.tutorialComplete);
  const [battleStageId, setBattleStageId] = useState<string | null>(null);

  useEffect(() => {
    const scene = screen === 'battle' ? 'battle' : screen === 'story' ? 'story' : 'home';
    void audioManager.play(scene);
  }, [screen]);

  const startBattle = (stageId: string) => {
    setBattleStageId(stageId);
    useGameStore.getState().setScreen('battle');
  };

  const content = (() => {
    switch (screen) {
      case 'sleep': return <SleepScreen />;
      case 'story': return <StoryScreen onStartBattle={startBattle} />;
      case 'battle': return <BattleScreen stageId={battleStageId} onExit={() => useGameStore.getState().setScreen('story')} />;
      case 'formation': return <FormationScreen />;
      case 'gacha': return <GachaScreen />;
      case 'weekend': return <WeekendScreen />;
      default: return <HomeScreen onStartBattle={startBattle} />;
    }
  })();

  return <AppLayout>{content}{!tutorialComplete && <Tutorial />}</AppLayout>;
}
