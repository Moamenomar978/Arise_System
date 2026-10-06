import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { PlayerService } from '../../core/services/player.service';
import { RankBadgeComponent } from '../../shared/components/rank-badge/rank-badge.component';
import { HasRoleDirective } from '../../shared/directives/has-role.directive';

@Component({
  selector: 'app-player-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RankBadgeComponent, HasRoleDirective],
  templateUrl: './player-layout.component.html',
  styleUrl: './player-layout.component.scss'
})
export class PlayerLayoutComponent implements OnInit {
  authService = inject(AuthService);
  playerService = inject(PlayerService);

  ngOnInit() {
    this.playerService.loadPlayer().subscribe();
  }

  logout() {
    this.authService.logout();
  }
}
