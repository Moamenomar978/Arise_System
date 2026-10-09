import { Injectable, signal, inject } from '@angular/core';
import { Player } from '../models/player.model';
import { ApiService } from './api.service';
import { map, tap } from 'rxjs';

// Maps the client stat names to the field names used by the server
const STAT_TO_SERVER: Record<string, string> = {
  strength: 'strength',
  agility: 'agility',
  sense: 'perception',
  vitality: 'vitality',
  intelligence: 'intelligence'
};

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private api = inject(ApiService);

  player = signal<Player | null>(null);

  /** Converts the server's player document into the shape the UI uses. */
  private toPlayer(p: any): Player {
    const level = p.level ?? 1;
    const stats = p.stats ?? {};
    return {
      id: p._id,
      userId: p.userId,
      level,
      rank: p.rank ?? 'E',
      xp: p.currentXP ?? 0,
      xpToNextLevel: Math.floor(100 * Math.pow(level, 1.5)),
      hp: p.hp ?? 100,
      maxHp: p.maxHp ?? 100,
      mp: 100,
      maxMp: 100,
      gold: p.gold ?? 0,
      stats: {
        strength: stats.strength ?? 1,
        agility: stats.agility ?? 1,
        sense: stats.perception ?? 1,
        vitality: stats.vitality ?? 1,
        intelligence: stats.intelligence ?? 1,
        availablePoints: p.statPoints ?? 0
      },
      streak: p.streak ?? 0,
      bestStreak: p.bestStreak ?? 0,
      streakFreezes: p.streakFreezes ?? 0,
      inPenaltyZone: !!p.inPenaltyZone,
      inventory: p.inventory ?? []
    };
  }

  loadPlayer() {
    return this.api.get<any>('/players/me').pipe(
      map(p => this.toPlayer(p)),
      tap(p => this.player.set(p))
    );
  }

  allocateStat(stat: string, amount: number) {
    const key = STAT_TO_SERVER[stat] ?? stat;
    return this.api.post<any>('/players/allocate-stats', { [key]: amount }).pipe(
      map(p => this.toPlayer(p)),
      tap(p => this.player.set(p))
    );
  }
}
