export enum Rank {
  E = 'E',
  D = 'D',
  C = 'C',
  B = 'B',
  A = 'A',
  S = 'S',
}

/** Level thresholds for each rank */
export const RANK_THRESHOLDS: Record<Rank, { min: number; max: number }> = {
  [Rank.E]: { min: 1, max: 10 },
  [Rank.D]: { min: 11, max: 25 },
  [Rank.C]: { min: 26, max: 50 },
  [Rank.B]: { min: 51, max: 80 },
  [Rank.A]: { min: 81, max: 120 },
  [Rank.S]: { min: 121, max: Infinity },
};

/** Color associated with each rank */
export const RANK_COLORS: Record<Rank, string> = {
  [Rank.E]: '#808080',   // Gray
  [Rank.D]: '#4CAF50',   // Green
  [Rank.C]: '#2196F3',   // Blue
  [Rank.B]: '#9C27B0',   // Purple
  [Rank.A]: '#FFD700',   // Gold
  [Rank.S]: '#FF1744',   // Red (Glowing)
};

/** Get rank for a given level */
export function getRankForLevel(level: number): Rank {
  if (level >= 121) return Rank.S;
  if (level >= 81) return Rank.A;
  if (level >= 51) return Rank.B;
  if (level >= 26) return Rank.C;
  if (level >= 11) return Rank.D;
  return Rank.E;
}
