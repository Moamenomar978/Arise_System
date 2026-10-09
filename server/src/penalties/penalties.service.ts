import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cron } from '@nestjs/schedule';
import { Penalty, PenaltyDocument } from './schemas/penalty.schema';
import { Player, PlayerDocument } from '../players/schemas/player.schema';
import { Quest, QuestDocument } from '../quests/schemas/quest.schema';
import { QuestProgress, QuestProgressDocument } from '../quests/schemas/quest-progress.schema';
import { PlayersService } from '../players/players.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { AchievementsService } from '../achievements/achievements.service';
import { dayKey } from '../common/date.util';

export const MISSED_DAY_DAMAGE = 10;

@Injectable()
export class PenaltiesService {
  private readonly logger = new Logger(PenaltiesService.name);

  constructor(
    @InjectModel(Penalty.name) private penaltyModel: Model<PenaltyDocument>,
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
    @InjectModel(Quest.name) private questModel: Model<QuestDocument>,
    @InjectModel(QuestProgress.name) private progressModel: Model<QuestProgressDocument>,
    private playersService: PlayersService,
    private notificationsGateway: NotificationsGateway,
    private achievementsService: AchievementsService,
  ) {}

  /** How long the penalty zone lasts. Set PENALTY_MINUTES in .env to change it. */
  private durationMinutes(): number {
    return Number(process.env.PENALTY_MINUTES) || 30;
  }

  // ------------------------------------------------------------------
  // Nightly check
  // ------------------------------------------------------------------

  @Cron('59 23 * * *')
  async checkPenalties() {
    const result = await this.runNightlyCheck();
    this.logger.log(`Nightly check done: ${result.penalized} penalized, ${result.protectedByFreeze} protected by freeze`);
  }

  /** Every player who completed no daily quest today loses HP (or uses a streak freeze). */
  async runNightlyCheck() {
    const today = dayKey();
    const dailyQuests = await this.questModel.find({ type: 'daily', isActive: { $ne: false } }).select('_id');
    if (dailyQuests.length === 0) return { penalized: 0, protectedByFreeze: 0 };

    const doneUsers = await this.progressModel.distinct('userId', {
      questId: { $in: dailyQuests.map((q) => q._id) },
      periodKey: today,
      completed: true,
    });
    const done = new Set(doneUsers.map(String));

    // New players get a grace day: nobody is punished on the day they joined
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const players = await this.playerModel
      .find({ inPenaltyZone: { $ne: true }, createdAt: { $lt: startOfToday } } as any)
      .select('userId')
      .lean();
    let penalized = 0;
    let protectedByFreeze = 0;

    for (const p of players) {
      const userId = String(p.userId);
      if (done.has(userId)) continue;
      try {
        const usedFreeze = await this.penalize(userId, today);
        if (usedFreeze) protectedByFreeze++;
        else penalized++;
      } catch (e) {
        this.logger.error(`Could not penalize ${userId}: ${(e as Error).message}`);
      }
    }
    return { penalized, protectedByFreeze };
  }

  /** Returns true when a streak freeze absorbed the missed day. */
  private async penalize(userId: string, today: string): Promise<boolean> {
    const player = await this.playersService.findByUserId(userId);

    if (player.streakFreezes > 0) {
      player.streakFreezes -= 1;
      player.lastActiveDate = today; // keeps the streak chain alive
      await player.save();
      this.notificationsGateway.sendToUser(userId, 'penalty.warning', {
        message: 'You missed your daily quests, but a Streak Freeze protected you.',
      });
      return true;
    }

    player.streak = 0;
    await player.save();

    const { player: hurt, enteredZone } = await this.playersService.damage(userId, MISSED_DAY_DAMAGE);
    await new this.penaltyModel({
      userId,
      reason: `Missed all daily quests on ${today} (-${MISSED_DAY_DAMAGE} HP)`,
    }).save();

    this.notificationsGateway.sendToUser(userId, 'penalty.warning', {
      message: `You missed your daily quests! -${MISSED_DAY_DAMAGE} HP (${hurt.hp}/${hurt.maxHp})`,
    });
    if (enteredZone) {
      this.notificationsGateway.sendToUser(userId, 'penalty.zone', {
        message: 'HP reached 0. You have been sent to the Penalty Zone.',
      });
    }
    return false;
  }

  // ------------------------------------------------------------------
  // Penalty zone (player side)
  // ------------------------------------------------------------------

  async getStatus(userId: string) {
    const player = await this.playersService.findByUserId(userId);
    const duration = this.durationMinutes();
    const startedAt = player.penaltyStartedAt ?? null;
    return {
      inPenaltyZone: player.inPenaltyZone,
      hp: player.hp,
      maxHp: player.maxHp,
      durationMinutes: duration,
      startedAt,
      endsAt: startedAt ? new Date(new Date(startedAt).getTime() + duration * 60000) : null,
    };
  }

  async start(userId: string) {
    const player = await this.playersService.findByUserId(userId);
    if (!player.inPenaltyZone) throw new BadRequestException('You are not in the Penalty Zone');
    if (!player.penaltyStartedAt) {
      player.penaltyStartedAt = new Date();
      await player.save();
    }
    return this.getStatus(userId);
  }

  async complete(userId: string) {
    const status = await this.getStatus(userId);
    if (!status.inPenaltyZone) throw new BadRequestException('You are not in the Penalty Zone');
    if (!status.startedAt || !status.endsAt) throw new BadRequestException('Enter the Penalty Zone first');

    const msLeft = new Date(status.endsAt).getTime() - Date.now();
    if (msLeft > 0) {
      throw new BadRequestException(`The penalty is not over yet. ${Math.ceil(msLeft / 60000)} minute(s) left.`);
    }

    await this.playersService.clearPenalty(userId);
    await this.penaltyModel.updateMany({ userId, resolved: false }, { $set: { resolved: true } });
    this.notificationsGateway.sendToUser(userId, 'penalty.cleared', { message: 'You survived the Penalty Zone.' });
    await this.achievementsService.evaluate(userId);
    return this.getStatus(userId);
  }
}
