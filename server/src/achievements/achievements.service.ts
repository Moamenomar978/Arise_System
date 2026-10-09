import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Achievement, AchievementDocument } from './schemas/achievement.schema';
import { Player, PlayerDocument } from '../players/schemas/player.schema';
import { QuestProgress, QuestProgressDocument } from '../quests/schemas/quest-progress.schema';
import { Goal, GoalDocument } from '../goals/schemas/goal.schema';
import { Penalty, PenaltyDocument } from '../penalties/schemas/penalty.schema';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { ACHIEVEMENTS, AchievementContext } from './achievements.catalog';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectModel(Achievement.name) private achievementModel: Model<AchievementDocument>,
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
    @InjectModel(QuestProgress.name) private progressModel: Model<QuestProgressDocument>,
    @InjectModel(Goal.name) private goalModel: Model<GoalDocument>,
    @InjectModel(Penalty.name) private penaltyModel: Model<PenaltyDocument>,
    private notificationsGateway: NotificationsGateway,
  ) {}

  /**
   * Looks at the player's current numbers and unlocks every achievement whose
   * condition is met. Safe to call as often as you like.
   */
  async evaluate(userId: string): Promise<string[]> {
    const [player, questsDone, goalsDone, penaltiesCleared, have] = await Promise.all([
      this.playerModel.findOne({ userId }).lean(),
      this.progressModel.countDocuments({ userId, completed: true }),
      this.goalModel.countDocuments({ userId, completed: true }),
      this.penaltyModel.countDocuments({ userId, resolved: true }),
      this.achievementModel.find({ userId }).distinct('code'),
    ]);
    if (!player) return [];

    const ctx: AchievementContext = {
      level: player.level ?? 1,
      rank: player.rank ?? 'E',
      bestStreak: (player as any).bestStreak ?? 0,
      purchases: (player as any).purchases ?? 0,
      questsDone,
      goalsDone,
      penaltiesCleared,
    };

    const owned = new Set(have);
    const unlocked: string[] = [];

    for (const def of ACHIEVEMENTS) {
      if (owned.has(def.code) || !def.test(ctx)) continue;
      try {
        await new this.achievementModel({
          userId,
          code: def.code,
          title: def.title,
          description: def.description,
          icon: def.icon,
        }).save();
        unlocked.push(def.code);
        this.notificationsGateway.sendToUser(userId, 'achievement.earned', {
          title: def.title,
          description: def.description,
          icon: def.icon,
        });
      } catch (e: any) {
        if (e?.code !== 11000) throw e; // already unlocked by a parallel request
      }
    }
    return unlocked;
  }

  /** The whole catalog, with an `unlocked` flag for this player. */
  async getUserAchievements(userId: string) {
    const mine = await this.achievementModel.find({ userId }).lean();
    const byCode = new Map(mine.map((a: any) => [a.code, a]));
    return ACHIEVEMENTS.map((def) => {
      const got: any = byCode.get(def.code);
      return {
        id: def.code,
        title: def.title,
        description: def.description,
        icon: def.icon,
        unlocked: !!got,
        unlockedAt: got?.createdAt ?? null,
      };
    });
  }
}
