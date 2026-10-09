import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestResult, QuestService } from '../../../core/services/quest.service';
import { PlayerService } from '../../../core/services/player.service';
import { NotificationService } from '../../../core/services/notification.service';
import { QuestCardComponent } from '../../../shared/components/quest-card/quest-card.component';

@Component({
  selector: 'app-quest-board',
  standalone: true,
  imports: [CommonModule, QuestCardComponent],
  templateUrl: './quest-board.component.html',
  styleUrl: './quest-board.component.scss'
})
export class QuestBoardComponent implements OnInit {
  questService = inject(QuestService);
  playerService = inject(PlayerService);
  notificationService = inject(NotificationService);
  activeFilter = 'ALL';

  ngOnInit() {
    this.questService.loadAvailableQuests().subscribe();
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
  }

  get filteredQuests() {
    if (this.activeFilter === 'ALL') return this.questService.availableQuests();
    return this.questService.availableQuests().filter(q => q.type === this.activeFilter);
  }

  private handleResult(res: QuestResult) {
    this.notificationService.showAlert(this.questService.rewardMessage(res), res.completed ? 'SUCCESS' : 'INFO');
    this.questService.loadAvailableQuests().subscribe();
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
