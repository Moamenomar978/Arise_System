import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AchievementsController } from './achievements.controller';
import { AchievementsService } from './achievements.service';
import { Achievement, AchievementSchema } from './schemas/achievement.schema';
import { Player, PlayerSchema } from '../players/schemas/player.schema';
import { QuestProgress, QuestProgressSchema } from '../quests/schemas/quest-progress.schema';
import { Goal, GoalSchema } from '../goals/schemas/goal.schema';
import { Penalty, PenaltySchema } from '../penalties/schemas/penalty.schema';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Achievement.name, schema: AchievementSchema },
      { name: Player.name, schema: PlayerSchema },
      { name: QuestProgress.name, schema: QuestProgressSchema },
      { name: Goal.name, schema: GoalSchema },
      { name: Penalty.name, schema: PenaltySchema },
    ]),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [AchievementsController],
  providers: [AchievementsService],
  exports: [AchievementsService],
})
export class AchievementsModule {}
