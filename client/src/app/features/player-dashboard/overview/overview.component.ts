import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../../core/services/player.service';
import { RankBadgeComponent } from '../../../shared/components/rank-badge/rank-badge.component';
import { XpProgressComponent } from '../../../shared/components/xp-progress/xp-progress.component';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RankBadgeComponent, XpProgressComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  playerService = inject(PlayerService);
}
