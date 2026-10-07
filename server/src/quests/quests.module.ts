import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuestsController } from './quests.controller';
import { QuestsService } from './quests.service';
import { Quest, QuestSchema } from './schemas/quest.schema';
import { QuestProgress, QuestProgressSchema } from './schemas/quest-progress.schema';
import { PlayersModule } from '../players/players.module';
import { UsersModule } from '../users/users.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Quest.name, schema: QuestSchema },
      { name: QuestProgress.name, schema: QuestProgressSchema },
    ]),
    forwardRef(() => PlayersModule),
    forwardRef(() => UsersModule),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [QuestsController],
  providers: [QuestsService],
  exports: [QuestsService],
})
export class QuestsModule {}
