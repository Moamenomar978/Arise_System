import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';

export interface PenaltyStatus {
  inPenaltyZone: boolean;
  hp: number;
  maxHp: number;
  durationMinutes: number;
  startedAt: string | null;
  endsAt: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class PenaltyService {
  private api = inject(ApiService);

  status() {
    return this.api.get<PenaltyStatus>('/penalties/status');
  }

  start() {
    return this.api.post<PenaltyStatus>('/penalties/start', {});
  }

  complete() {
    return this.api.post<PenaltyStatus>('/penalties/complete', {});
  }
}
