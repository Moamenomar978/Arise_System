import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { ApiService } from './api.service';

export interface AdminUser {
  id: string;
  hunterName: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  level: number;
  rank: string;
  gold: number;
  xp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminUserService {
  private api = inject(ApiService);

  users = signal<AdminUser[]>([]);

  loadUsers() {
    return this.api.get<AdminUser[]>('/admin/users').pipe(tap(list => this.users.set(list)));
  }

  resetProgress(id: string) {
    return this.api.post<{ reset: boolean }>(`/admin/users/${id}/reset-progress`, {});
  }

  deleteUser(id: string) {
    return this.api.delete<{ deleted: boolean }>(`/admin/users/${id}`);
  }
}
