import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../../core/services/player.service';
import { AuthService } from '../../../core/services/auth.service';
import { RankBadgeComponent } from '../../../shared/components/rank-badge/rank-badge.component';
import { XpProgressComponent } from '../../../shared/components/xp-progress/xp-progress.component';

const RANK_TITLES: Record<string, string> = {
  E: 'Novice Hunter',
  D: 'Apprentice Hunter',
  C: 'Skilled Hunter',
  B: 'Veteran Hunter',
  A: 'Elite Hunter',
  S: 'Shadow Monarch'
};

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RankBadgeComponent, XpProgressComponent],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.scss'
})
export class OverviewComponent {
  playerService = inject(PlayerService);
  authService = inject(AuthService);

  titleFor(rank: string) {
    return RANK_TITLES[rank] ?? 'Hunter';
  }
}
