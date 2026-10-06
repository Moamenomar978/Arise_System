import { Injectable, inject, signal } from '@angular/core';
import { Quest, QuestType } from '../models/quest.model';
import { ApiService } from './api.service';
import { map, tap } from 'rxjs';

/** Quest exactly as the server stores it (used by the admin screen). */
export interface AdminQuest {
  _id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'main' | 'special';
  rank: 'E' | 'D' | 'C' | 'B' | 'A' | 'S';
  targetAmount: number;
  rewardXp: number;
  rewardGold: number;
  isActive: boolean;
}

export type QuestPayload = Omit<AdminQuest, '_id'>;

const TYPE_TO_CLIENT: Record<string, QuestType> = {
  daily: 'DAILY',
  weekly: 'WEEKLY',
  main: 'STORY',
  special: 'HIDDEN'
};

@Injectable({
  providedIn: 'root'
})
export class QuestService {
  private api = inject(ApiService);

  dailyQuests = signal<Quest[]>([]);
  availableQuests = signal<Quest[]>([]);
  adminQuests = signal<AdminQuest[]>([]);

  /** Converts a server quest (with progress) into the shape the UI uses. */
  private toQuest(q: any): Quest {
    return {
      id: q._id,
      title: q.title,
      description: q.description,
      type: TYPE_TO_CLIENT[String(q.type).toLowerCase()] ?? 'STORY',
      rank: q.rank ?? 'E',
      rewards: { xp: q.rewardXp ?? 0, gold: q.rewardGold ?? 0 },
      status: q.completed ? 'COMPLETED' : 'AVAILABLE',
      deadline: q.deadline,
      objectives: [
        {
          id: q._id,
          description: q.title,
          current: q.completed ? (q.targetAmount ?? 1) : (q.progress ?? 0),
          target: q.targetAmount ?? 1
        }
      ]
    };
  }

  private loadAll() {
    return this.api.get<any[]>('/quests').pipe(map(list => list.map(q => this.toQuest(q))));
  }

  loadDailyQuests() {
    return this.loadAll().pipe(
      tap(quests => this.dailyQuests.set(quests.filter(q => q.type === 'DAILY')))
    );
  }

  loadAvailableQuests() {
    return this.loadAll().pipe(
      tap(quests => this.availableQuests.set(quests.filter(q => q.type !== 'DAILY')))
    );
  }

  completeQuest(id: string) {
    return this.api.post<any>(`/quests/${id}/complete`, {});
  }

  // ---------------------------------------------------------------- admin

  loadAdminQuests() {
    return this.api.get<AdminQuest[]>('/quests/admin/all').pipe(
      tap(list => this.adminQuests.set(list))
    );
  }

  createQuest(payload: QuestPayload) {
    return this.api.post<AdminQuest>('/quests', payload);
  }

  updateQuest(id: string, payload: Partial<QuestPayload>) {
    return this.api.put<AdminQuest>(`/quests/${id}`, payload);
  }

  deleteQuest(id: string) {
    return this.api.delete<{ deleted: boolean }>(`/quests/${id}`);
  }
}
