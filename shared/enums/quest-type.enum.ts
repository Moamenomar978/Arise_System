export enum QuestType {
  DAILY = 'DAILY',       // Auto-generated each day, must complete before midnight
  WEEKLY = 'WEEKLY',     // Larger goals, reset weekly
  SPECIAL = 'SPECIAL',   // One-time challenges from admin (Gate / Boss Raid)
  STORY = 'STORY',       // Long-term milestones (Main quest line)
}

/** Quest type descriptions */
export const QUEST_TYPE_DESCRIPTIONS: Record<QuestType, string> = {
  [QuestType.DAILY]: 'Complete before midnight or face the penalty zone',
  [QuestType.WEEKLY]: 'Larger goals that reset every week',
  [QuestType.SPECIAL]: 'One-time challenges — Boss Raids and Gates',
  [QuestType.STORY]: 'Long-term milestones on your journey',
};
