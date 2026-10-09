export type GoalDifficulty = 'easy' | 'medium' | 'hard' | 'epic';

export interface GoalStep {
  _id: string;
  title: string;
  done: boolean;
}

export interface Goal {
  _id: string;
  title: string;
  description: string;
  difficulty: GoalDifficulty;
  deadline?: string;
  steps: GoalStep[];
  completed: boolean;
  completedAt?: string;
  progress: number;
  reward: { xp: number; gold: number };
}

export interface CreateGoalPayload {
  title: string;
  description?: string;
  difficulty: GoalDifficulty;
  deadline?: string;
  steps: string[];
}
