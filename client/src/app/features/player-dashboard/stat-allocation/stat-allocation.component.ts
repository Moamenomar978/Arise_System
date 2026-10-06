import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../../core/services/player.service';
import { NotificationService } from '../../../core/services/notification.service';
import { StatBarComponent } from '../../../shared/components/stat-bar/stat-bar.component';

@Component({
  selector: 'app-stat-allocation',
  standalone: true,
  imports: [CommonModule, StatBarComponent],
  templateUrl: './stat-allocation.component.html',
  styleUrl: './stat-allocation.component.scss'
})
export class StatAllocationComponent {
  playerService = inject(PlayerService);
  notificationService = inject(NotificationService);

  allocate(statName: string) {
    const player = this.playerService.player();
    if (!player || player.stats.availablePoints <= 0) {
      this.notificationService.showAlert('Not enough stat points', 'WARNING');
      return;
    }
    
    this.playerService.allocateStat(statName, 1).subscribe({
      next: () => this.notificationService.showAlert(`+1 ${statName.toUpperCase()}`, 'INFO')
    });
  }
}
