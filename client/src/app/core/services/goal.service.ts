import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from './api.service';
import { CreateGoalPayload, Goal } from '../models/goal.model';

@Injectable({
  providedIn: 'root'
})
export class GoalService {
  private api = inject(ApiService);

  goals = signal<Goal[]>([]);

  loadGoals() {
    return this.api.get<Goal[]>('/goals').pipe(tap(list => this.goals.set(list)));
  }

  createGoal(payload: CreateGoalPayload) {
    return this.api.post<Goal>('/goals', payload);
  }

  addStep(goalId: string, title: string) {
    return this.api.post<Goal>(`/goals/${goalId}/steps`, { title });
  }

  toggleStep(goalId: string, stepId: string) {
    return this.api.post<{ goal: Goal; reward: { xp: number; gold: number } | null }>(
      `/goals/${goalId}/steps/${stepId}/toggle`,
      {}
    );
  }

  deleteGoal(goalId: string) {
    return this.api.delete<{ deleted: boolean }>(`/goals/${goalId}`);
  }
}
