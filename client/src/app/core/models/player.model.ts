export interface PlayerStats {
  strength: number;
  agility: number;
  sense: number;
  vitality: number;
  intelligence: number;
  availablePoints: number;
}

export interface Player {
  id: string;
  userId: string;
  level: number;
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  xp: number;
  xpToNextLevel: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  gold: number;
  stats: PlayerStats;
}
