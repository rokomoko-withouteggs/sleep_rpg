import { useState } from 'react';
import banners from '../data/banners.json';
import { rollGacha, rollGacha10, type GachaBanner } from '../game/gacha';
import { useGameStore } from '../store/gameStore';

export function GachaScreen() {
  const [results, setResults] = useState<ReturnType<typeof rollGacha>>([]);
  const stones = useGameStore((state) => state.dreamStones);
  const addDreamStones = useGameStore((state) => state.addDreamStones);
  const addGachaItem = useGameStore((state) => state.addGachaItem);
  const banner = banners[0] as GachaBanner;

  const draw = (count: 1 | 10) => {
    const cost = count === 10 ? 3000 : 300;
    if (stones < cost) return;
    addDreamStones(-cost);
    const items = count === 10 ? rollGacha10(banner) : rollGacha(banner);
    items.forEach((item) => addGachaItem(item.itemId));
    setResults(items);
  };

  return <div className="gacha-layout"><section className="panel"><h1>{banner.name}</h1><p>{banner.description}</p><p>所持石 ◆ {stones}</p><div className="row-actions"><button onClick={() => draw(1)}>単発 300</button><button onClick={() => draw(10)}>10連 3000</button></div></section><section className="panel"><h2>排出内容</h2>{results.length ? <div className="gacha-results">{results.map((item, index) => <div key={`${item.itemId}-${index}`}><b>{item.rarity}</b><span>{item.name}</span></div>)}</div> : <p>ガチャを引いてください</p>}</section></div>;
}
