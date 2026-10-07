import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(private gateway: NotificationsGateway) {}

  notifyUser(userId: string, event: string, payload: any) {
    this.gateway.sendToUser(userId, event, payload);
  }
}
