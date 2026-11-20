import characters from '../data/characters.json';
import { useGameStore } from '../store/gameStore';

export function FormationScreen() {
  const party = useGameStore((state) => state.party);
  const setParty = useGameStore((state) => state.setParty);
  const remove = (id: string) => setParty(party.filter((item) => item !== id));
  const add = (id: string) => { if (party.length < 4 && !party.includes(id)) setParty([...party, id]); };

  return <div className="formation-layout">
    <section className="panel"><h1>ストーリー編成</h1><div className="party-slots">{Array.from({ length: 4 }).map((_, index) => {
      const id = party[index];
      const character = characters.find((item) => item.id === id);
      return <button key={index} onClick={() => id && remove(id)}><strong>{character?.name ?? '空き枠'}</strong><small>{character?.role}</small></button>;
    })}</div></section>
    <section className="panel"><h2>所持キャラ</h2><div className="character-list">{characters.map((character) => <button key={character.id} onClick={() => add(character.id)}>{character.name}<small>{character.rarity}</small></button>)}</div></section>
  </div>;
}
