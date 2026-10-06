import { Injectable, inject } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket!: Socket;
  private auth = inject(AuthService);
  private notifications = inject(NotificationService);

  connect() {
    const token = this.auth.getToken();
    if (!token) return;

    this.socket = io('http://localhost:3000', {
      auth: { token }
    });

    this.socket.on('system_message', (msg: string) => {
      this.notifications.showAlert(msg, 'INFO');
    });

    this.socket.on('quest_completed', (data: any) => {
      this.notifications.showAlert(`Quest Completed: ${data.title}`, 'SUCCESS');
    });
    
    this.socket.on('level_up', (data: any) => {
      this.notifications.showAlert(`LEVEL UP! You are now level ${data.level}`, 'SUCCESS');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
