import { useEffect, useMemo, useState } from 'react';
import chapters from '../data/chapters.json';
import characters from '../data/characters.json';
import enemies from '../data/enemies.json';
import { useGameStore } from '../store/gameStore';
import { defendedDamage, maxHp, normalAttack, ultimateDamage, ultimateHeal, ultimateAttackBuff } from '../game/battle';
import { chooseSemiAutoAction } from '../game/ai';

interface Unit {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  role: string;
  gauge: number;
  defending: boolean;
  assetKey: string;
}

type Action = 'attack' | 'skill' | 'ultimate' | 'defend';

function makeEnemies(stageId: string | null): Unit[] {
  const stage = chapters.flatMap((chapter) => chapter.stages).find((item) => item.id === stageId);
  return (stage?.enemies ?? []).flatMap((entry) => {
    const template = enemies.find((item) => item.id === entry.enemyId);
    if (!template) return [];
    return Array.from({ length: entry.count }, (_, index) => ({
      id: `${template.id}-${index}`,
      name: template.name,
      hp: template.hp,
      maxHp: template.hp,
      attack: template.attack,
      role: 'enemy',
      gauge: 0,
      defending: false,
      assetKey: template.assetKey,
    }));
  });
}

export function BattleScreen({ stageId, onExit }: { stageId: string | null; onExit: () => void }) {
  const partyIds = useGameStore((state) => state.party);
  const playerLevel = useGameStore((state) => state.playerLevel);
  const spendStamina = useGameStore((state) => state.spendStamina);
  const clearStage = useGameStore((state) => state.clearStage);
  const gainPlayerExp = useGameStore((state) => state.gainPlayerExp);
  const stage = useMemo(() => chapters.flatMap((chapter) => chapter.stages).find((item) => item.id === stageId), [stageId]);
  const initialAllies = useMemo<Unit[]>(() => partyIds.slice(0, 4).flatMap((id) => {
    const template = characters.find((item) => item.id === id);
    if (!template) return [];
    const hp = maxHp(template, playerLevel);
    return [{ id, name: template.name, hp, maxHp: hp, attack: template.attack, role: template.role, gauge: 0, defending: false, assetKey: template.assetKey }];
  }), [partyIds, playerLevel]);
  const [allyState, setAllyState] = useState(initialAllies);
  const [enemyState, setEnemyState] = useState(() => makeEnemies(stageId));
  const [skillCooldowns, setSkillCooldowns] = useState<Record<string, number>>({});
  const [auto, setAuto] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(0);
  const [activeAlly, setActiveAlly] = useState(0);
  const [log, setLog] = useState('戦闘開始');
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<'win' | 'lose' | null>(null);
  const [started, setStarted] = useState(stage?.type === 'conversation');
  const [paidStamina, setPaidStamina] = useState(false);

  const livingEnemies = enemyState.filter((unit) => unit.hp > 0);
  const livingAllies = allyState.filter((unit) => unit.hp > 0);

  useEffect(() => {
    if (!stage || stage.type === 'conversation' || finished) return;
    if (enemyState.length > 0 && livingEnemies.length === 0) {
      setFinished(true);
      setResult('win');
      clearStage(stage.id);
      gainPlayerExp(stage.type === 'boss' ? 1000 : 500);
    } else if (allyState.length > 0 && livingAllies.length === 0) {
      setFinished(true);
      setResult('lose');
    }
  }, [stage, enemyState, allyState, finished, livingEnemies.length, livingAllies.length, clearStage, gainPlayerExp]);

  const act = (action: Action) => {
    if (!stage || finished || !allyState.length) return;
    if (stage.type === 'conversation') {
      clearStage(stage.id);
      onExit();
      return;
    }
    if (!started) {
      if (!spendStamina(stage.stamina)) {
        setLog('スタミナが足りません');
        return;
      }
      setPaidStamina(true);
      setStarted(true);
    }

    const actorIndex = allyState.findIndex((unit, index) => index >= activeAlly && unit.hp > 0);
    const resolvedActorIndex = actorIndex >= 0 ? actorIndex : allyState.findIndex((unit) => unit.hp > 0);
    const actor = allyState[resolvedActorIndex];
    const targetIndex = enemyState[selectedTarget]?.hp > 0 ? selectedTarget : enemyState.findIndex((unit) => unit.hp > 0);
    const target = enemyState[targetIndex];
    if (!actor || !target) return;
    const template = characters.find((item) => item.id === actor.id);
    if (!template) return;
    const cooldown = skillCooldowns[actor.id] ?? 0;
    if (action === 'ultimate' && actor.gauge < 5) { setLog('必殺ゲージが5未満です'); return; }
    if (action === 'skill' && cooldown > 0) { setLog(`スキルCT中: 残り${cooldown}ターン`); return; }

    const nextAllies = allyState.map((unit) => ({ ...unit, defending: false }));
    const nextEnemies = enemyState.map((unit) => ({ ...unit }));
    let actionMessage = '';

    if (action === 'defend') {
      nextAllies[resolvedActorIndex].defending = true;
      actionMessage = `${actor.name}は防御した`;
    } else if (action === 'ultimate' && template.role === 'dreamHealer') {
      const heal = ultimateHeal(template, playerLevel);
      nextAllies.forEach((unit) => { if (unit.hp > 0) unit.hp = Math.min(unit.maxHp, unit.hp + heal); });
      nextAllies[resolvedActorIndex].gauge = 0;
      actionMessage = `${actor.name}は味方を${heal}回復`;
    } else if (action === 'ultimate' && template.role === 'napSupport') {
      nextAllies[resolvedActorIndex].gauge = 0;
      actionMessage = `${actor.name}の必殺技で味方を支援`;
    } else {
      const base = action === 'ultimate'
        ? ultimateDamage(template, playerLevel)
        : Math.round(normalAttack(template, playerLevel) * (action === 'skill' ? 1.5 : 1));
      const damage = defendedDamage(base, target.defending);
      nextEnemies[targetIndex].hp = Math.max(0, nextEnemies[targetIndex].hp - damage);
      if (action === 'ultimate') nextAllies[resolvedActorIndex].gauge = 0;
      else nextAllies[resolvedActorIndex].gauge = Math.min(5, nextAllies[resolvedActorIndex].gauge + 1);
      if (action === 'skill') setSkillCooldowns((current) => ({ ...current, [actor.id]: template.skillCooldown }));
      actionMessage = `${actor.name}の${action === 'ultimate' ? '必殺' : action === 'skill' ? 'スキル' : '攻撃'}で${damage}ダメージ`;
    }

    if (action !== 'defend') {
      nextEnemies.forEach((enemy) => {
        if (enemy.hp <= 0) return;
        const guardIndex = nextAllies.findIndex((unit) => unit.hp > 0 && unit.defending);
        const recipientIndex = guardIndex >= 0 ? guardIndex : nextAllies.findIndex((unit) => unit.hp > 0);
        if (recipientIndex < 0) return;
        const received = defendedDamage(enemy.attack, nextAllies[recipientIndex].defending);
        nextAllies[recipientIndex].hp = Math.max(0, nextAllies[recipientIndex].hp - received);
        nextAllies[recipientIndex].gauge = Math.min(5, nextAllies[recipientIndex].gauge + 1);
      });
    }
    setAllyState(nextAllies);
    setEnemyState(nextEnemies);
    setSkillCooldowns((current) => Object.fromEntries(Object.entries(current).map(([id, turns]) => [id, Math.max(0, turns - 1)])));
    setActiveAlly((resolvedActorIndex + 1) % Math.max(1, nextAllies.length));
    setLog(actionMessage);
  };

  useEffect(() => {
    if (!auto || finished || stage?.type === 'conversation') return;
    const timer = window.setTimeout(() => {
      const index = allyState.findIndex((unit) => unit.hp > 0);
      if (index < 0) return;
      const unit = allyState[index];
      const choice = chooseSemiAutoAction(unit.gauge, unit.hp / unit.maxHp, unit.role);
      setActiveAlly(index);
      act(choice);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [auto, allyState, enemyState, finished, stage, activeAlly]);

  if (!stage) return <div className="panel"><p>ステージが選択されていません</p><button onClick={onExit}>戻る</button></div>;

  if (stage.type === 'conversation') {
    const line = stage.conversation?.[0];
    return <section className="panel conversation-panel"><h1>{stage.name}</h1><p><strong>{line?.speaker ?? 'ナビ'}</strong></p><p>{line?.text ?? '物語が始まります。'}</p><button onClick={() => act('attack')}>次へ</button></section>;
  }

  return <div className="battle-layout">
    <h1>{stage.name}{paidStamina && <small> ・スタミナ消費済み</small>}</h1>
    <div className="battle-field">
      <section className="battle-side"><h2>味方</h2>{allyState.map((unit, index) => <button key={unit.id} className={`unit-card ${activeAlly === index ? 'selected' : ''}`} onClick={() => setActiveAlly(index)} disabled={unit.hp <= 0}><b>{unit.name}</b><span>HP {unit.hp}/{unit.maxHp}</span><span>必殺ゲージ {unit.gauge}/5</span><span>スキルCT {skillCooldowns[unit.id] ?? 0}</span></button>)}</section>
      <section className="battle-side"><h2>敵（対象を選択）</h2>{enemyState.map((unit, index) => <button key={unit.id} className={`unit-card enemy ${selectedTarget === index ? 'selected' : ''}`} onClick={() => setSelectedTarget(index)} disabled={unit.hp <= 0}><b>{unit.name}</b><span>HP {unit.hp}/{unit.maxHp}</span></button>)}</section>
    </div>
    <div className="battle-controls"><p role="status">{finished ? result === 'win' ? '勝利！' : '敗北…' : log}</p><button className={auto ? 'active' : ''} onClick={() => setAuto((value) => !value)}>{auto ? 'セミオートON' : 'セミオートOFF'}</button><button onClick={() => act('attack')} disabled={finished}>通常攻撃</button><button onClick={() => act('skill')} disabled={finished}>スキル</button><button onClick={() => act('ultimate')} disabled={finished}>必殺</button><button onClick={() => act('defend')} disabled={finished}>防御</button>{finished && <button onClick={onExit}>結果を閉じる</button>}</div>
  </div>;
}
