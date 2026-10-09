import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PlayerService } from '../../core/services/player.service';
import { SocketService } from '../../core/services/socket.service';
import { RankBadgeComponent } from '../../shared/components/rank-badge/rank-badge.component';
import { HasRoleDirective } from '../../shared/directives/has-role.directive';

@Component({
  selector: 'app-player-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RankBadgeComponent, HasRoleDirective],
  templateUrl: './player-layout.component.html',
  styleUrl: './player-layout.component.scss'
})
export class PlayerLayoutComponent implements OnInit, OnDestroy {
  authService = inject(AuthService);
  playerService = inject(PlayerService);
  private socketService = inject(SocketService);
  private router = inject(Router);

  ngOnInit() {
    this.playerService.loadPlayer().subscribe({
      next: player => {
        // A player with 0 HP has to clear the Penalty Zone first
        if (player.inPenaltyZone) {
          this.router.navigate(['/penalty-zone']);
        }
      }
    });
    // Live alerts: level up, achievements, streaks, penalties
    this.socketService.connect();
  }

  ngOnDestroy() {
    this.socketService.disconnect();
  }

  logout() {
    this.socketService.disconnect();
    this.authService.logout();
  }
}
