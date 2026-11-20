export type ActionType = 'attack' | 'skill' | 'ultimate' | 'defend';

export function chooseSemiAutoAction(gauge: number, hpRatio: number, role: string): ActionType {
  if (gauge >= 5) return 'ultimate';
  if (hpRatio < 0.3 && role === 'dreamHealer') return 'skill';
  return 'attack';
}
