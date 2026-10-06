import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuestService } from '../../../core/services/quest.service';
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

  onQuestComplete(id: string) {
    this.questService.completeQuest(id).subscribe({
      next: (res) => {
        this.notificationService.showAlert(`Quest Completed!`, 'SUCCESS');
        this.questService.loadAvailableQuests().subscribe();
      }
    });
  }
}
