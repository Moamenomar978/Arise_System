import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Player, PlayerSchema } from '../players/schemas/player.schema';
import { QuestProgress, QuestProgressSchema } from '../quests/schemas/quest-progress.schema';
import { Goal, GoalSchema } from '../goals/schemas/goal.schema';
import { Penalty, PenaltySchema } from '../penalties/schemas/penalty.schema';
import { Achievement, AchievementSchema } from '../achievements/schemas/achievement.schema';
import { Quest, QuestSchema } from '../quests/schemas/quest.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Player.name, schema: PlayerSchema },
      { name: QuestProgress.name, schema: QuestProgressSchema },
      { name: Goal.name, schema: GoalSchema },
      { name: Penalty.name, schema: PenaltySchema },
      { name: Quest.name, schema: QuestSchema },
      { name: Achievement.name, schema: AchievementSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
