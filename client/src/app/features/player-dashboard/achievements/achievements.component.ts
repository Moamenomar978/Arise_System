import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { NotificationService } from '../../../core/services/notification.service';

interface AchievementView {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt: string | null;
}

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './achievements.component.html',
  styleUrl: './achievements.component.scss'
})
export class AchievementsComponent implements OnInit {
  private api = inject(ApiService);
  private notifications = inject(NotificationService);

  achievements = signal<AchievementView[]>([]);
  unlockedCount = computed(() => this.achievements().filter(a => a.unlocked).length);

  ngOnInit() {
    this.api.get<AchievementView[]>('/achievements').subscribe({
      next: list => this.achievements.set(list),
      error: () => this.notifications.showAlert('COULD NOT LOAD ACHIEVEMENTS', 'ERROR')
    });
  }
}
