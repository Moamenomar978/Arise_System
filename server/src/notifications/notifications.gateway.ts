import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({ cors: { origin: 'http://localhost:4200', credentials: true } })
@Injectable()
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, string[]> = new Map();

  constructor(private jwtService: JwtService, private configService: ConfigService) {}

  async handleConnection(client: Socket) {
    try {
      // The Angular client sends the token in `auth: { token }`
      const token =
        (client.handshake.auth?.token as string) ||
        client.handshake.headers.authorization?.split(' ')[1];
      if (!token) {
        client.disconnect();
        return;
      }
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('jwt.secret'),
      });
      const userId = String(payload.sub);
      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, []);
      }
      this.userSockets.get(userId).push(client.id);
    } catch (e) {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, sockets] of this.userSockets.entries()) {
      const index = sockets.indexOf(client.id);
      if (index !== -1) {
        sockets.splice(index, 1);
        if (sockets.length === 0) {
          this.userSockets.delete(userId);
        }
        break;
      }
    }
  }

  sendToUser(userId: string, event: string, data: any) {
    const sockets = this.userSockets.get(String(userId));
    if (sockets) {
      sockets.forEach((socketId) => {
        this.server.to(socketId).emit(event, { source: '[SYSTEM]', ...data });
      });
    }
  }
}
