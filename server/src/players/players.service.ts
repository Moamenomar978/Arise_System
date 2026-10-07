import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from './schemas/player.schema';
import { AllocateStatsDto } from './dto/allocate-stats.dto';
import { NotificationsGateway } from '../notifications/notifications.gateway';

@Injectable()
export class PlayersService {
  constructor(
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  async create(userId: string): Promise<PlayerDocument> {
    const createdPlayer = new this.playerModel({ userId });
    return createdPlayer.save();
  }

  async findByUserId(userId: string): Promise<PlayerDocument> {
    const player = await this.playerModel.findOne({ userId }).exec();
    if (!player) throw new NotFoundException('Player profile not found');
    return player;
  }

  async allocateStats(userId: string, allocateStatsDto: AllocateStatsDto): Promise<PlayerDocument> {
    const player = await this.findByUserId(userId);
    const totalAllocated = Object.values(allocateStatsDto).reduce((a, b) => a + b, 0);

    if (totalAllocated > player.statPoints) {
      throw new BadRequestException('Not enough stat points');
    }

    player.statPoints -= totalAllocated;
    player.stats.strength += allocateStatsDto.strength;
    player.stats.agility += allocateStatsDto.agility;
    player.stats.intelligence += allocateStatsDto.intelligence;
    player.stats.perception += allocateStatsDto.perception;
    player.stats.vitality += allocateStatsDto.vitality;
    // `stats` is a Mixed type, so Mongoose does not detect nested changes on its own
    player.markModified('stats');

    // Update Max HP based on vitality (example: 1 vitality = 10 HP)
    player.maxHp = 100 + (player.stats.vitality - 1) * 10;
    if (player.hp > player.maxHp) player.hp = player.maxHp;

    return player.save();
  }

  async addExperience(userId: string, amount: number): Promise<PlayerDocument> {
    const player = await this.findByUserId(userId);
    player.currentXP += amount;

    let leveledUp = false;
    const oldRank = player.rank;

    while (true) {
      const xpToNextLevel = Math.floor(100 * Math.pow(player.level, 1.5));
      if (player.currentXP >= xpToNextLevel) {
        player.currentXP -= xpToNextLevel;
        player.level += 1;
        player.statPoints += 3;
        player.hp = player.maxHp; // Heal on level up
        leveledUp = true;
      } else {
        break;
      }
    }

    if (player.level >= 121) player.rank = 'S';
    else if (player.level >= 81) player.rank = 'A';
    else if (player.level >= 51) player.rank = 'B';
    else if (player.level >= 26) player.rank = 'C';
    else if (player.level >= 11) player.rank = 'D';

    await player.save();

    if (leveledUp) {
      this.notificationsGateway.sendToUser(userId, 'player.levelUp', { level: player.level });
      if (oldRank !== player.rank) {
        this.notificationsGateway.sendToUser(userId, 'player.rankUp', { rank: player.rank });
      }
    }

    return player;
  }
}
