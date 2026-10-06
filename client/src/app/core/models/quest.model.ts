export type QuestType = 'DAILY' | 'WEEKLY' | 'STORY' | 'HIDDEN';
export type QuestStatus = 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';

export interface QuestReward {
  xp: number;
  gold: number;
  items?: string[];
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: QuestType;
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  rewards: QuestReward;
  status: QuestStatus;
  deadline?: string;
  objectives: {
    id: string;
    description: string;
    current: number;
    target: number;
  }[];
}
