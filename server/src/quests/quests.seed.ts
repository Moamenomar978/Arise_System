// Ready-made quests. They are inserted automatically the first time the
// server starts with an empty `quests` collection.
export const SEED_QUESTS = [
  // ---------- DAILY ----------
  { title: 'Push-Up Protocol', description: 'Do 100 push-ups (split them across the day if you need to).', type: 'daily', rank: 'E', targetAmount: 100, rewardXp: 40, rewardGold: 20 },
  { title: 'Core Conditioning', description: 'Do 100 sit-ups.', type: 'daily', rank: 'E', targetAmount: 100, rewardXp: 40, rewardGold: 20 },
  { title: 'Run the Distance', description: 'Run or jog 5 km.', type: 'daily', rank: 'D', targetAmount: 5, rewardXp: 60, rewardGold: 30 },
  { title: 'Mind Training', description: 'Study or read for 60 minutes without distractions.', type: 'daily', rank: 'E', targetAmount: 60, rewardXp: 50, rewardGold: 25 },
  { title: 'Code Sprint', description: 'Work on a project or practice coding for 45 minutes.', type: 'daily', rank: 'D', targetAmount: 45, rewardXp: 50, rewardGold: 25 },
  { title: 'Hydration Check', description: 'Drink 8 glasses of water.', type: 'daily', rank: 'E', targetAmount: 8, rewardXp: 20, rewardGold: 10 },
  { title: 'Early Rise', description: 'Wake up before 7 AM.', type: 'daily', rank: 'E', targetAmount: 1, rewardXp: 25, rewardGold: 15 },

  // ---------- WEEKLY ----------
  { title: 'Iron Week', description: 'Complete 4 workouts this week.', type: 'weekly', rank: 'D', targetAmount: 4, rewardXp: 200, rewardGold: 100 },
  { title: 'Knowledge Seeker', description: 'Finish 5 lessons or book chapters this week.', type: 'weekly', rank: 'D', targetAmount: 5, rewardXp: 180, rewardGold: 90 },
  { title: 'Distance Hunter', description: 'Run a total of 20 km this week.', type: 'weekly', rank: 'C', targetAmount: 20, rewardXp: 250, rewardGold: 120 },
  { title: 'Clean Streak', description: 'Avoid junk food for 5 days this week.', type: 'weekly', rank: 'D', targetAmount: 5, rewardXp: 150, rewardGold: 80 },

  // ---------- MAIN / STORY ----------
  { title: 'The Awakening', description: 'Complete every daily quest in a single day.', type: 'main', rank: 'E', targetAmount: 1, rewardXp: 100, rewardGold: 50 },
  { title: 'Dungeon of Discipline', description: 'Complete 30 daily quests in total.', type: 'main', rank: 'C', targetAmount: 30, rewardXp: 600, rewardGold: 300 },
  { title: 'The Long Road', description: 'Run 100 km in total.', type: 'main', rank: 'B', targetAmount: 100, rewardXp: 800, rewardGold: 400 },

  // ---------- SPECIAL / HIDDEN ----------
  { title: 'Hidden Quest: Midnight Gate', description: 'Focus for 2 hours straight with your phone away.', type: 'special', rank: 'B', targetAmount: 120, rewardXp: 400, rewardGold: 200 },
  { title: 'Boss Raid: The Trial', description: 'Finish one personal goal you have been putting off.', type: 'special', rank: 'S', targetAmount: 1, rewardXp: 1000, rewardGold: 500 },
];
