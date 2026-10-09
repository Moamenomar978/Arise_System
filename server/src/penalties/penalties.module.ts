import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PenaltiesService } from './penalties.service';
import { PenaltiesController } from './penalties.controller';
import { Penalty, PenaltySchema } from './schemas/penalty.schema';
import { Player, PlayerSchema } from '../players/schemas/player.schema';
import { Quest, QuestSchema } from '../quests/schemas/quest.schema';
import { QuestProgress, QuestProgressSchema } from '../quests/schemas/quest-progress.schema';
import { PlayersModule } from '../players/players.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AchievementsModule } from '../achievements/achievements.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Penalty.name, schema: PenaltySchema },
      { name: Player.name, schema: PlayerSchema },
      { name: Quest.name, schema: QuestSchema },
      { name: QuestProgress.name, schema: QuestProgressSchema },
    ]),
    forwardRef(() => PlayersModule),
    forwardRef(() => NotificationsModule),
    AchievementsModule,
  ],
  controllers: [PenaltiesController],
  providers: [PenaltiesService],
  exports: [PenaltiesService],
})
export class PenaltiesModule {}
