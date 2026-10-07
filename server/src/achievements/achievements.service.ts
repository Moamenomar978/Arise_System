import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Achievement, AchievementDocument } from './schemas/achievement.schema';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectModel(Achievement.name) private achievementModel: Model<AchievementDocument>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async checkAndAward(userId: string, title: string, description: string) {
    const existing = await this.achievementModel.findOne({ userId, title });
    if (!existing) {
      const achievement = new this.achievementModel({ userId, title, description });
      await achievement.save();
      this.notificationsGateway.sendToUser(userId, 'achievement.earned', { title, description });
    }
  }
  
  async getUserAchievements(userId: string): Promise<AchievementDocument[]> {
    return this.achievementModel.find({ userId }).exec();
  }
}
