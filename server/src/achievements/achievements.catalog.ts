const RANKS = ['E', 'D', 'C', 'B', 'A', 'S'];

export interface AchievementContext {
  level: number;
  rank: string;
  bestStreak: number;
  purchases: number;
  questsDone: number;
  goalsDone: number;
  penaltiesCleared: number;
}

export interface AchievementDef {
  code: string;
  title: string;
  description: string;
  icon: string;
  test: (c: AchievementContext) => boolean;
}

const rankAtLeast = (rank: string, min: string) => RANKS.indexOf(rank) >= RANKS.indexOf(min);

export const ACHIEVEMENTS: AchievementDef[] = [
  { code: 'first_quest', title: 'First Blood', description: 'Complete your first quest', icon: '⚔️', test: (c) => c.questsDone >= 1 },
  { code: 'quests_10', title: 'Getting Serious', description: 'Complete 10 quests', icon: '📜', test: (c) => c.questsDone >= 10 },
  { code: 'quests_50', title: 'Veteran Hunter', description: 'Complete 50 quests', icon: '🏹', test: (c) => c.questsDone >= 50 },

  { code: 'goals_1', title: 'Goal Setter', description: 'Complete your first personal goal', icon: '🎯', test: (c) => c.goalsDone >= 1 },
  { code: 'goals_5', title: 'Iron Will', description: 'Complete 5 personal goals', icon: '💪', test: (c) => c.goalsDone >= 5 },

  { code: 'level_5', title: 'Rising Hunter', description: 'Reach level 5', icon: '⭐', test: (c) => c.level >= 5 },
  { code: 'level_10', title: 'Seasoned Hunter', description: 'Reach level 10', icon: '🌟', test: (c) => c.level >= 10 },
  { code: 'level_25', title: 'Elite Hunter', description: 'Reach level 25', icon: '💫', test: (c) => c.level >= 25 },

  { code: 'rank_c', title: 'C-Rank Hunter', description: 'Reach C-Rank', icon: '🥉', test: (c) => rankAtLeast(c.rank, 'C') },
  { code: 'rank_a', title: 'A-Rank Hunter', description: 'Reach A-Rank', icon: '🥈', test: (c) => rankAtLeast(c.rank, 'A') },
  { code: 'rank_s', title: 'S-Rank Hunter', description: 'Reach S-Rank', icon: '👑', test: (c) => rankAtLeast(c.rank, 'S') },

  { code: 'streak_3', title: 'On Fire', description: 'Keep a 3-day streak', icon: '🔥', test: (c) => c.bestStreak >= 3 },
  { code: 'streak_7', title: 'Unstoppable', description: 'Keep a 7-day streak', icon: '⚡', test: (c) => c.bestStreak >= 7 },
  { code: 'streak_30', title: 'Shadow Monarch', description: 'Keep a 30-day streak', icon: '👤', test: (c) => c.bestStreak >= 30 },

  { code: 'first_purchase', title: 'Big Spender', description: 'Buy something from the shop', icon: '🛒', test: (c) => c.purchases >= 1 },
  { code: 'survivor', title: 'Survivor', description: 'Survive the Penalty Zone', icon: '🛡️', test: (c) => c.penaltiesCleared >= 1 },
];
