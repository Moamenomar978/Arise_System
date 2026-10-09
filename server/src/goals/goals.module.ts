import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GoalsController } from './goals.controller';
import { GoalsService } from './goals.service';
import { Goal, GoalSchema } from './schemas/goal.schema';
import { PlayersModule } from '../players/players.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AchievementsModule } from '../achievements/achievements.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Goal.name, schema: GoalSchema }]),
    forwardRef(() => PlayersModule),
    forwardRef(() => NotificationsModule),
    AchievementsModule,
  ],
  controllers: [GoalsController],
  providers: [GoalsService],
  exports: [GoalsService],
})
export class GoalsModule {}
