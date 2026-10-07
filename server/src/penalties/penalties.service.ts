import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron } from '@nestjs/schedule';
import { Penalty, PenaltyDocument } from './schemas/penalty.schema';
import { PlayersService } from '../players/players.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class PenaltiesService {
  constructor(
    @InjectModel(Penalty.name) private penaltyModel: Model<PenaltyDocument>,
    private playersService: PlayersService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  @Cron('59 23 * * *')
  async checkPenalties() {
    // In a full implementation, query users who missed ALL daily quests.
    // For now, this is a structural stub that logs the cron.
    console.log('Checking for missed daily quests to apply penalties...');
    // If a user missed all, apply -10 HP. If HP = 0, set inPenaltyZone = true
    // this.notificationsGateway.sendToUser(userId, 'penalty.warning', { message: 'You missed your daily quests!' });
  }
}
