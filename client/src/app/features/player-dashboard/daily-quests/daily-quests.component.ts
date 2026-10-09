import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestResult, QuestService } from '../../../core/services/quest.service';
import { PlayerService } from '../../../core/services/player.service';
import { NotificationService } from '../../../core/services/notification.service';
import { QuestCardComponent } from '../../../shared/components/quest-card/quest-card.component';

@Component({
  selector: 'app-daily-quests',
  standalone: true,
  imports: [CommonModule, QuestCardComponent],
  templateUrl: './daily-quests.component.html',
  styleUrl: './daily-quests.component.scss'
})
export class DailyQuestsComponent implements OnInit, OnDestroy {
  questService = inject(QuestService);
  playerService = inject(PlayerService);
  notificationService = inject(NotificationService);

  timeLeft = signal('00:00:00');
  private timer?: ReturnType<typeof setInterval>;
  private midnightReloadDone = false;

  ngOnInit() {
    this.questService.loadDailyQuests().subscribe();
    this.playerService.loadPlayer().subscribe();
    this.tick();
    this.timer = setInterval(() => this.tick(), 1000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  /** Counts down to local midnight, when the daily quests reset. */
  private tick() {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const diff = Math.max(0, midnight.getTime() - now.getTime());
    const pad = (n: number) => String(n).padStart(2, '0');
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    this.timeLeft.set(`${pad(h)}:${pad(m)}:${pad(s)}`);

    // A new day started: reload the fresh quests once
    if (diff < 1500 && !this.midnightReloadDone) {
      this.midnightReloadDone = true;
      setTimeout(() => {
        this.questService.loadDailyQuests().subscribe();
        this.midnightReloadDone = false;
      }, 3000);
    }
  }

  private handleResult(res: QuestResult) {
    this.notificationService.showAlert(this.questService.rewardMessage(res), res.completed ? 'SUCCESS' : 'INFO');
    this.questService.loadDailyQuests().subscribe();
    this.playerService.loadPlayer().subscribe();
  }

  private handleError(err: any) {
    this.notificationService.showAlert(err?.error?.message || 'COULD NOT UPDATE QUEST', 'ERROR');
  }

  onQuestComplete(id: string) {
    this.questService.completeQuest(id).subscribe({
      next: res => this.handleResult(res),
      error: err => this.handleError(err)
    });
  }

  onQuestProgress(e: { id: string; amount: number }) {
    this.questService.addProgress(e.id, e.amount).subscribe({
      next: res => this.handleResult(res),
      error: err => this.handleError(err)
    });
  }
}
