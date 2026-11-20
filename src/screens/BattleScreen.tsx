import { useEffect, useMemo, useState } from 'react';
import chapters from '../data/chapters.json';
import characters from '../data/characters.json';
import enemies from '../data/enemies.json';
import { useGameStore } from '../store/gameStore';
import { defendedDamage, maxHp, normalAttack, ultimateDamage, ultimateHeal, ultimateAttackBuff } from '../game/battle';
import { chooseSemiAutoAction } from '../game/ai';

interface Unit { id: string; name: string; hp: number; maxHp: number; attack: number; role: string; gauge: number; defending: boolean; assetKey: string }

export function BattleScreen({ stageId, onExit }: { stageId: string | null; onExit: () => void }) {
  const partyIds = useGameStore((state) => state.party);
  const playerLevel = useGameStore((state) => state.playerLevel);
  const spendStamina = useGameStore((state) => state.spendStamina);
  const clearStage = useGameStore((state) => state.clearStage);
  const gainPlayerExp = useGameStore((state) => state.gainPlayerExp);
  const stage = useMemo(() => chapters.flatMap((chapter) => chapter.stages).find((item) => item.id === stageId), [stageId]);
  const [auto, setAuto] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(0);
  const [log, setLog] = useState('戦闘開始');
  const [turn, setTurn] = useState(0);
  const [finished, setFinished] = useState(false);

  const allies = useMemo<Unit[]>(() => partyIds.slice(0, 4).map((id) => {
    const template = characters.find((item) => item.id === id)!;
    const hp = maxHp(template, playerLevel);
    return { id, name: template.name, hp, maxHp: hp, attack: template.attack, role: template.role, gauge: 0, defending: false, assetKey: template.assetKey };
  }), [partyIds, playerLevel]);
  const [allyState, setAllyState] = useState<Unit[]>(allies);
  const [enemyState, setEnemyState] = useState<Unit[]>(() => {
    const result: Unit[] = [];
    stage?.enemies?.forEach((entry) => {
      const template = enemies.find((item) => item.id === entry.enemyId)!;
      for (let index = 0; index < entry.count; index++) result.push({ id: `${template.id}-${index}`, name: template.name, hp: template.hp, maxHp: template.hp, attack: template.attack, role: 'enemy', gauge: 0, defending: false, assetKey: template.assetKey });
    });
    return result;
  });

  useEffect(() => { if (stage && allyState.every((unit) => unit.hp <= 0) && !finished) setFinished(true); if (enemyState.every((unit) => unit.hp <= 0) && enemyState.length > 0 && !finished) { setFinished(true); clearStage(stage?.id ?? ''); gainPlayerExp(500); } }, [allyState, enemyState, clearStage, gainPlayerExp, stage, finished]);

  if (!stage) return <div className="panel"><p>ステージが選択されていません</p><button onClick={onExit}>戻る</button></div>;

  const act = (action: 'attack' | 'skill' | 'ultimate' | 'defend', allyIndex = turn % Math.max(allyState.length, 1)) => {
    const acting = allyState[allyIndex];
    if (!acting || acting.hp <= 0) return;
    const target = enemyState[selectedTarget] ?? enemyState.find((unit) => unit.hp > 0);
    if (!target || enemyState.every((unit) => unit.hp <= 0)) return;

    const template = characters.find((item) => item.id === acting.id)!;
    const nextAllies = allyState.map((unit) => ({ ...unit, defending: false }));
    const nextEnemies = enemyState.map((unit) => ({ ...unit, defending: false }));

    if (action === 'defend') {
      nextAllies[allyIndex].defending = true;
      setLog(`${acting.name}は防御した`);
    } else if (action === 'ultimate' && acting.gauge >= 5) {
      nextAllies[allyIndex].gauge = 0;
      if (template.role === 'dreamHealer') {
        const heal = ultimateHeal(template, playerLevel);
        nextAllies.forEach((unit, index) => { if (unit.hp > 0) unit.hp = Math.min(unit.maxHp, unit.hp + heal); nextAllies[index] = unit; });
        setLog(`${acting.name}は味方を回復した（+${heal}）`);
      } else if (template.role === 'napSupport') {
        setLog(`${acting.name}は味方を強化した（${ultimateAttackBuff(template, playerLevel)}）`);
      } else {
        const damage = defendedDamage(ultimateDamage(template, playerLevel), target.defending);
        const enemyIndex = nextEnemies.findIndex((unit) => unit.id === target.id);
        nextEnemies[enemyIndex].hp -= damage;
        setLog(`${acting.name}の必殺で${damage}ダメージ`);
      }
    } else {
      const damage = defendedDamage(normalAttack(template, playerLevel), target.defending);
      const enemyIndex = nextEnemies.findIndex((unit) => unit.id === target.id);
      nextEnemies[enemyIndex].hp -= damage;
      nextAllies[allyIndex].gauge = Math.min(5, nextAllies[allyIndex].gauge + 1);
      setLog(`${acting.name}の通常攻撃で${damage}ダメージ`);
    }

    nextEnemies.forEach((enemy) => { if (enemy.hp > 0) {
      const targetAllyIndex = nextAllies.findIndex((unit) => unit.hp > 0);
      if (targetAllyIndex >= 0) {
        nextAllies[targetAllyIndex].gauge = Math.min(5, nextAllies[targetAllyIndex].gauge + 1);
        const damage = defendedDamage(enemy.attack, nextAllies[targetAllyIndex].defending);
        nextAllies[targetAllyIndex].hp -= damage;
      }
    } });

    setAllyState(nextAllies);
    setEnemyState(nextEnemies);
    setTurn((value) => value + 1);
  };

  useEffect(() => { if (!auto || finished) return;
    const timer = window.setTimeout(() => {
      const index = allyState.findIndex((unit) => unit.hp > 0);
      if (index >= 0) act(chooseSemiAutoAction(allyState[index].gauge, allyState[index].hp / allyState[index].maxHp, allyState[index].role), index);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [auto, allyState, enemyState, finished, turn]);

  return <div className="battle-layout">
    <div className="battle-field">
      <section className="battle-side"><h2>味方</h2>{allyState.map((unit, index) => <button key={unit.id} className="unit-card" onClick={() => act('attack', index)} disabled={unit.hp <= 0}><b>{unit.name}</b><span>HP {Math.max(0, unit.hp)}/{unit.maxHp}</span><span>ゲージ {unit.gauge}/5</span></button>)}</section>
      <section className="battle-side"><h2>敵</h2>{enemyState.map((unit, index) => <button key={unit.id} className={`unit-card enemy ${selectedTarget === index ? 'selected' : ''}`} onClick={() => setSelectedTarget(index)} disabled={unit.hp <= 0}><b>{unit.name}</b><span>HP {Math.max(0, unit.hp)}/{unit.maxHp}</span></button>)}</section>
    </div>
    <div className="battle-controls"><p>{log}</p><button className={auto ? 'active' : ''} onClick={() => setAuto((value) => !value)}>{auto ? 'セミオートON' : 'セミオートOFF'}</button><button onClick={() => act('attack')}>通常攻撃</button><button onClick={() => act('skill')}>スキル</button><button onClick={() => act('ultimate')}>必殺</button><button onClick={() => act('defend')}>防御</button>{finished && <button onClick={() => { if (enemyState.every((unit) => unit.hp <= 0)) { if (stage.stamina) spendStamina(stage.stamina); } onExit(); }}>結果を閉じる</button>}</div>
  </div>;
}
