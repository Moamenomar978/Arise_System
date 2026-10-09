export interface PlayerStats {
  strength: number;
  agility: number;
  sense: number;
  vitality: number;
  intelligence: number;
  availablePoints: number;
}

export interface InventoryItem {
  itemId: string;
  name: string;
  icon?: string;
  quantity: number;
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
  streak: number;
  bestStreak: number;
  streakFreezes: number;
  inPenaltyZone: boolean;
  inventory: InventoryItem[];
}
