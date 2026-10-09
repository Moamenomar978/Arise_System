import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Player, PlayerDocument } from '../players/schemas/player.schema';
import { QuestProgress, QuestProgressDocument } from '../quests/schemas/quest-progress.schema';
import { Goal, GoalDocument } from '../goals/schemas/goal.schema';
import { Penalty, PenaltyDocument } from '../penalties/schemas/penalty.schema';
import { Achievement, AchievementDocument } from '../achievements/schemas/achievement.schema';
import { Quest, QuestDocument } from '../quests/schemas/quest.schema';
import { dayKey } from '../common/date.util';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
    @InjectModel(QuestProgress.name) private progressModel: Model<QuestProgressDocument>,
    @InjectModel(Goal.name) private goalModel: Model<GoalDocument>,
    @InjectModel(Penalty.name) private penaltyModel: Model<PenaltyDocument>,
    @InjectModel(Quest.name) private questModel: Model<QuestDocument>,
    @InjectModel(Achievement.name) private achievementModel: Model<AchievementDocument>,
  ) {}

  private assertId(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid user id');
  }

  async listUsers() {
    const users = await this.userModel.find().select('-password').sort({ createdAt: 1 }).lean();
    const players = await this.playerModel.find({ userId: { $in: users.map((u) => u._id) } }).lean();
    const byUser = new Map(players.map((p) => [String(p.userId), p]));

    return users.map((u: any) => {
      const p: any = byUser.get(String(u._id));
      const roles: string[] = Array.isArray(u.role) ? u.role : [u.role];
      return {
        id: String(u._id),
        hunterName: u.username,
        email: u.email,
        role: roles.includes('admin') ? 'ADMIN' : 'USER',
        createdAt: u.createdAt,
        level: p?.level ?? 1,
        rank: p?.rank ?? 'E',
        gold: p?.gold ?? 0,
        xp: p?.currentXP ?? 0,
      };
    });
  }

  /** Puts the player's level, XP, gold, stats and rank back to the starting values. */
  async resetProgress(id: string) {
    this.assertId(id);
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');

    await this.playerModel.updateOne(
      { userId: id },
      {
        $set: {
          level: 1,
          currentXP: 0,
          rank: 'E',
          hp: 100,
          maxHp: 100,
          gold: 0,
          statPoints: 0,
          stats: { strength: 1, agility: 1, intelligence: 1, perception: 1, vitality: 1 },
          inPenaltyZone: false,
          penaltyStartedAt: null,
          streak: 0,
          bestStreak: 0,
          lastActiveDate: '',
          streakFreezes: 0,
          purchases: 0,
          inventory: [],
        },
      },
      { upsert: true },
    );
    return { reset: true };
  }

  /** Deletes the account and everything that belongs to it. */
  async deleteUser(id: string, requesterId: string) {
    this.assertId(id);
    if (String(id) === String(requesterId)) {
      throw new BadRequestException('You cannot delete your own account');
    }
    const user = await this.userModel.findByIdAndDelete(id);
    if (!user) throw new NotFoundException('User not found');

    await Promise.all([
      this.playerModel.deleteMany({ userId: id }),
      this.progressModel.deleteMany({ userId: id }),
      this.goalModel.deleteMany({ userId: id }),
      this.penaltyModel.deleteMany({ userId: id }),
      this.achievementModel.deleteMany({ userId: id }),
    ]);
    return { deleted: true };
  }

  /** Numbers for the admin analytics page. */
  async stats() {
    const days: string[] = [];
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    since.setDate(since.getDate() - 6);
    for (let i = 0; i < 7; i++) {
      const d = new Date(since);
      d.setDate(since.getDate() + i);
      days.push(dayKey(d));
    }

    const [totalUsers, totalAdmins, totalQuests, totalCompletions, totalGoals, goalsCompleted, inPenaltyZone, players, recentProgress, recentUsers] =
      await Promise.all([
        this.userModel.countDocuments(),
        this.userModel.countDocuments({ role: 'admin' }),
        this.questModel.countDocuments(),
        this.progressModel.countDocuments({ completed: true }),
        this.goalModel.countDocuments(),
        this.goalModel.countDocuments({ completed: true }),
        this.playerModel.countDocuments({ inPenaltyZone: true }),
        this.playerModel.find().select('level rank').lean(),
        this.progressModel.find({ completed: true, updatedAt: { $gte: since } } as any).select('userId updatedAt').lean(),
        this.userModel.find({ createdAt: { $gte: since } } as any).select('createdAt').lean(),
      ]);

    // Active hunters per day = distinct players who completed a quest that day
    const activeSets = new Map<string, Set<string>>(days.map((d) => [d, new Set<string>()]));
    for (const p of recentProgress as any[]) {
      activeSets.get(dayKey(new Date(p.updatedAt)))?.add(String(p.userId));
    }
    const signups = new Map<string, number>(days.map((d) => [d, 0]));
    for (const u of recentUsers as any[]) {
      const k = dayKey(new Date(u.createdAt));
      if (signups.has(k)) signups.set(k, signups.get(k) + 1);
    }

    const rankDistribution: Record<string, number> = { E: 0, D: 0, C: 0, B: 0, A: 0, S: 0 };
    let levelSum = 0;
    for (const p of players as any[]) {
      rankDistribution[p.rank] = (rankDistribution[p.rank] ?? 0) + 1;
      levelSum += p.level ?? 1;
    }

    return {
      totalUsers,
      totalAdmins,
      totalQuests,
      totalCompletions,
      totalGoals,
      goalsCompleted,
      inPenaltyZone,
      averageLevel: players.length ? Math.round((levelSum / players.length) * 10) / 10 : 0,
      rankDistribution,
      activeByDay: days.map((d) => ({ date: d, count: activeSets.get(d).size })),
      signupsByDay: days.map((d) => ({ date: d, count: signups.get(d) })),
    };
  }
}
