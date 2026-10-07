export enum StatType {
  STR = 'STR',   // Strength — Fitness / Physical
  AGI = 'AGI',   // Agility — Speed / Reflexes / Sports
  VIT = 'VIT',   // Vitality — Health / Endurance / Sleep
  INT = 'INT',   // Intelligence — Education / Learning
  PER = 'PER',   // Perception — Awareness / Social Skills
  LCK = 'LCK',   // Luck — Creativity / Random acts
}

/** Human-readable labels for each stat */
export const STAT_LABELS: Record<StatType, string> = {
  [StatType.STR]: 'Strength',
  [StatType.AGI]: 'Agility',
  [StatType.VIT]: 'Vitality',
  [StatType.INT]: 'Intelligence',
  [StatType.PER]: 'Perception',
  [StatType.LCK]: 'Luck',
};

/** Real-life category each stat maps to */
export const STAT_CATEGORIES: Record<StatType, string> = {
  [StatType.STR]: 'Fitness & Physical Training',
  [StatType.AGI]: 'Speed, Reflexes & Sports',
  [StatType.VIT]: 'Health, Endurance & Sleep',
  [StatType.INT]: 'Education & Learning',
  [StatType.PER]: 'Social Skills & Awareness',
  [StatType.LCK]: 'Creativity & Exploration',
};
