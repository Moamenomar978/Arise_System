import { Component, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PenaltyService, PenaltyStatus } from '../../core/services/penalty.service';
import { PlayerService } from '../../core/services/player.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-penalty-zone',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './penalty-zone.component.html',
  styleUrl: './penalty-zone.component.scss'
})
export class PenaltyZoneComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private penaltyService = inject(PenaltyService);
  private playerService = inject(PlayerService);
  private notifications = inject(NotificationService);

  status = signal<PenaltyStatus | null>(null);
  loading = signal(true);
  msLeft = signal(0);
  private timer?: ReturnType<typeof setInterval>;

  started = computed(() => !!this.status()?.startedAt);
  finished = computed(() => this.started() && this.msLeft() <= 0);

  timeLeft = computed(() => {
    const total = Math.max(0, Math.ceil(this.msLeft() / 1000));
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`;
  });

  ngOnInit() {
    this.load();
    this.timer = setInterval(() => this.tick(), 1000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private load() {
    this.penaltyService.status().subscribe({
      next: s => {
        this.status.set(s);
        this.tick();
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notifications.showAlert('COULD NOT LOAD PENALTY STATUS', 'ERROR');
      }
    });
  }

  private tick() {
    const s = this.status();
    this.msLeft.set(s?.endsAt ? new Date(s.endsAt).getTime() - Date.now() : 0);
  }

  enter() {
    this.penaltyService.start().subscribe({
      next: s => {
        this.status.set(s);
        this.tick();
      },
      error: err => this.notifications.showAlert(err?.error?.message || 'COULD NOT START', 'ERROR')
    });
  }

  survive() {
    this.penaltyService.complete().subscribe({
      next: () => {
        this.notifications.showAlert('YOU SURVIVED THE PENALTY ZONE', 'SUCCESS');
        this.playerService.loadPlayer().subscribe(() => this.router.navigate(['/dashboard']));
      },
      error: err => {
        this.notifications.showAlert(err?.error?.message || 'COULD NOT COMPLETE', 'ERROR');
        this.load();
      }
    });
  }

  back() {
    this.router.navigate(['/dashboard']);
  }
}
