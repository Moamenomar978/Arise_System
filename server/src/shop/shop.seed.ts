// Items inserted the first time the server starts with an empty shop.
export const SEED_ITEMS = [
  { name: 'Health Potion', description: 'Restores 50 HP', price: 100, icon: '💊', effectType: 'heal', effectValue: 50 },
  { name: 'Greater Health Potion', description: 'Restores all HP', price: 250, icon: '🧪', effectType: 'heal', effectValue: 9999 },
  { name: 'XP Scroll', description: 'Instantly gives 100 XP', price: 300, icon: '📜', effectType: 'xp', effectValue: 100 },
  { name: 'Stat Token', description: 'Gives 1 stat point', price: 500, icon: '🪙', effectType: 'statpoint', effectValue: 1 },
  { name: 'Streak Freeze', description: 'Protects your streak and HP for one missed day', price: 350, icon: '🧊', effectType: 'streakfreeze', effectValue: 1 },
  { name: 'Penalty Pardon', description: 'Instantly leaves the Penalty Zone (half HP)', price: 400, icon: '💎', effectType: 'pardon', effectValue: 0 },
  { name: "Hunter's Badge", description: 'A collectible badge for your inventory', price: 800, icon: '🎖️', effectType: 'none', effectValue: 0 },
];
