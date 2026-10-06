import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestService } from '../../../core/services/quest.service';
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
  notificationService = inject(NotificationService);

  timeLeft = signal('00:00:00');
  private timer?: ReturnType<typeof setInterval>;

  ngOnInit() {
    this.questService.loadDailyQuests().subscribe();
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
    if (diff < 1500 && this.timer) {
      // a new day started: reload the fresh quests
      setTimeout(() => this.questService.loadDailyQuests().subscribe(), 2000);
    }
  }

  onQuestComplete(id: string) {
    this.questService.completeQuest(id).subscribe({
      next: () => {
        this.notificationService.showAlert(`Quest Completed!`, 'SUCCESS');
        this.questService.loadDailyQuests().subscribe();
      },
      error: (err) => {
        this.notificationService.showAlert(err?.error?.message || 'COULD NOT COMPLETE QUEST', 'ERROR');
      }
    });
  }
}
