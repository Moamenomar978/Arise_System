import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from './schemas/player.schema';
import { AllocateStatsDto } from './dto/allocate-stats.dto';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { dayKey, yesterdayKey } from '../common/date.util';

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

  // ------------------------------------------------------------------
  // Gold, health and items (used by the shop)
  // ------------------------------------------------------------------

  /** Takes gold atomically: fails (and takes nothing) if the player cannot afford it. */
  async spendGold(userId: string, amount: number): Promise<PlayerDocument> {
    const player = await this.playerModel.findOneAndUpdate(
      { userId, gold: { $gte: amount } },
      { $inc: { gold: -amount, purchases: 1 } },
      { new: true },
    );
    if (!player) throw new BadRequestException('Not enough gold');
    return player;
  }

  async heal(userId: string, amount: number): Promise<PlayerDocument> {
    const player = await this.findByUserId(userId);
    player.hp = Math.min(player.maxHp, player.hp + amount);
    return player.save();
  }

  async addStatPoints(userId: string, amount: number): Promise<PlayerDocument> {
    const player = await this.findByUserId(userId);
    player.statPoints += amount;
    return player.save();
  }

  async addStreakFreeze(userId: string, amount = 1): Promise<PlayerDocument> {
    const player = await this.findByUserId(userId);
    player.streakFreezes += amount;
    return player.save();
  }

  async addToInventory(userId: string, item: { id: string; name: string; icon?: string }) {
    const player = await this.findByUserId(userId);
    const existing = player.inventory.find((i) => i.itemId === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      player.inventory.push({ itemId: item.id, name: item.name, icon: item.icon, quantity: 1 });
    }
    return player.save();
  }

  // ------------------------------------------------------------------
  // Streaks
  // ------------------------------------------------------------------

  /**
   * Called when a daily quest is completed. The first one of each day extends the
   * streak and pays a small gold bonus (5 gold per streak day, up to 10 days).
   */
  async registerDailyActivity(userId: string) {
    const player = await this.findByUserId(userId);
    const today = dayKey();

    if (player.lastActiveDate === today) {
      return { streak: player.streak, bonusGold: 0, isNewDay: false };
    }

    player.streak = player.lastActiveDate === yesterdayKey() ? player.streak + 1 : 1;
    player.bestStreak = Math.max(player.bestStreak, player.streak);
    player.lastActiveDate = today;
    const bonusGold = Math.min(player.streak, 10) * 5;
    player.gold += bonusGold;
    await player.save();

    this.notificationsGateway.sendToUser(userId, 'streak.updated', { streak: player.streak, bonusGold });
    return { streak: player.streak, bonusGold, isNewDay: true };
  }

  // ------------------------------------------------------------------
  // Penalties
  // ------------------------------------------------------------------

  /** Removes HP. At 0 HP the player is sent to the penalty zone. */
  async damage(userId: string, amount: number) {
    const player = await this.findByUserId(userId);
    player.hp = Math.max(0, player.hp - amount);
    let enteredZone = false;
    if (player.hp === 0 && !player.inPenaltyZone) {
      player.inPenaltyZone = true;
      player.penaltyStartedAt = undefined;
      enteredZone = true;
    }
    await player.save();
    return { player, enteredZone };
  }

  /** Leaves the penalty zone with half HP. */
  async clearPenalty(userId: string): Promise<PlayerDocument> {
    const player = await this.findByUserId(userId);
    player.inPenaltyZone = false;
    player.penaltyStartedAt = undefined;
    player.hp = Math.max(player.hp, Math.ceil(player.maxHp / 2));
    return player.save();
  }
}
