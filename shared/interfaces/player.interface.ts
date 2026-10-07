import { Rank } from '../enums/rank.enum';
import { StatType } from '../enums/stat-type.enum';

export interface IPlayerStats {
  [StatType.STR]: number;
  [StatType.AGI]: number;
  [StatType.VIT]: number;
  [StatType.INT]: number;
  [StatType.PER]: number;
  [StatType.LCK]: number;
}

export interface IPlayer {
  _id?: string;
  userId: string;
  hunterName: string;
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  rank: Rank;
  availableStatPoints: number;
  stats: IPlayerStats;
  hp: number;
  maxHp: number;
  gold: number;
  streak: number;
  titles: string[];
  unlockedSkills: string[];
  createdAt: Date;
  updatedAt: Date;
}

/** Calculate XP required for next level: 100 * level^1.5 */
export function calculateXpToNextLevel(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

/** Default stats for a new player */
export const DEFAULT_PLAYER_STATS: IPlayerStats = {
  [StatType.STR]: 1,
  [StatType.AGI]: 1,
  [StatType.VIT]: 1,
  [StatType.INT]: 1,
  [StatType.PER]: 1,
  [StatType.LCK]: 1,
};

/** Stat points awarded per level up */
export const STAT_POINTS_PER_LEVEL = 3;

/** Max HP value */
export const MAX_HP = 100;

/** HP lost when missing all daily quests */
export const HP_PENALTY = 10;

/** HP recovered per completed daily quest */
export const HP_RECOVERY_PER_DAILY = 5;

/** HP recovered per recovery quest in penalty zone */
export const HP_RECOVERY_PER_PENALTY_QUEST = 20;
