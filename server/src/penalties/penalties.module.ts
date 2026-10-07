import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PenaltiesService } from './penalties.service';
import { Penalty, PenaltySchema } from './schemas/penalty.schema';
import { PlayersModule } from '../players/players.module';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Penalty.name, schema: PenaltySchema }]),
    forwardRef(() => PlayersModule),
    forwardRef(() => NotificationsModule),
  ],
  providers: [PenaltiesService],
  exports: [PenaltiesService],
})
export class PenaltiesModule {}
