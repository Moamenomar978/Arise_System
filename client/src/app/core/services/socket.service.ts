import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';
import { PlayerService } from './player.service';
import { SERVER_URL } from '../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket | null = null;
  private auth = inject(AuthService);
  private notifications = inject(NotificationService);
  private playerService = inject(PlayerService);
  private router = inject(Router);

  connect() {
    if (this.socket) return; // already connected
    const token = this.auth.getToken();
    if (!token) return;

    this.socket = io(SERVER_URL, { auth: { token } });

    this.socket.on('system_message', (msg: string) => {
      this.notifications.showAlert(msg, 'INFO');
    });

    this.socket.on('player.levelUp', (data: any) => {
      this.notifications.showAlert(`LEVEL UP! You are now level ${data.level}`, 'SUCCESS');
      this.playerService.loadPlayer().subscribe();
    });

    this.socket.on('player.rankUp', (data: any) => {
      this.notifications.showAlert(`RANK UP! You are now ${data.rank}-Rank`, 'SUCCESS');
    });

    this.socket.on('achievement.earned', (data: any) => {
      this.notifications.showAlert(`ACHIEVEMENT UNLOCKED: ${data.icon ?? ''} ${data.title}`, 'SUCCESS');
    });

    this.socket.on('streak.updated', (data: any) => {
      this.notifications.showAlert(`🔥 ${data.streak}-DAY STREAK! +${data.bonusGold} GOLD`, 'SUCCESS');
      this.playerService.loadPlayer().subscribe();
    });

    this.socket.on('penalty.warning', (data: any) => {
      this.notifications.showAlert(data.message, 'WARNING');
      this.playerService.loadPlayer().subscribe();
    });

    this.socket.on('penalty.zone', (data: any) => {
      this.notifications.showAlert(data.message, 'ERROR');
      this.playerService.loadPlayer().subscribe();
      this.router.navigate(['/penalty-zone']);
    });

    this.socket.on('penalty.cleared', (data: any) => {
      this.notifications.showAlert(data.message, 'SUCCESS');
      this.playerService.loadPlayer().subscribe();
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}
