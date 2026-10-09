import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Goal, GoalDocument } from './schemas/goal.schema';
import { AddStepDto, CreateGoalDto, UpdateGoalDto } from './dto/goal.dto';
import { PlayersService } from '../players/players.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';
import { AchievementsService } from '../achievements/achievements.service';

export const GOAL_REWARDS: Record<string, { xp: number; gold: number }> = {
  easy: { xp: 50, gold: 25 },
  medium: { xp: 120, gold: 60 },
  hard: { xp: 250, gold: 125 },
  epic: { xp: 500, gold: 250 },
};

@Injectable()
export class GoalsService {
  constructor(
    @InjectModel(Goal.name) private goalModel: Model<GoalDocument>,
    private playersService: PlayersService,
    private notificationsGateway: NotificationsGateway,
    private achievementsService: AchievementsService,
  ) {}

  /** Adds the completion percentage and the reward the goal will pay. */
  private toView(goal: GoalDocument) {
    const o: any = goal.toObject();
    const total = o.steps.length;
    const done = o.steps.filter((s) => s.done).length;
    return {
      ...o,
      progress: total ? Math.round((done / total) * 100) : 0,
      reward: GOAL_REWARDS[o.difficulty] ?? GOAL_REWARDS.medium,
    };
  }

  private assertId(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid id');
  }

  private async findOwned(userId: string, id: string): Promise<GoalDocument> {
    this.assertId(id);
    const goal = await this.goalModel.findOne({ _id: id, userId });
    if (!goal) throw new NotFoundException('Goal not found');
    return goal;
  }

  async list(userId: string) {
    const goals = await this.goalModel.find({ userId }).sort({ completed: 1, createdAt: -1 });
    return goals.map((g) => this.toView(g));
  }

  async create(userId: string, dto: CreateGoalDto) {
    const goal = await new this.goalModel({
      userId,
      title: dto.title.trim(),
      description: dto.description?.trim() ?? '',
      difficulty: dto.difficulty,
      deadline: dto.deadline ? new Date(dto.deadline) : undefined,
      steps: dto.steps.map((t) => ({ title: t.trim(), done: false })),
    }).save();
    return this.toView(goal);
  }

  async update(userId: string, id: string, dto: UpdateGoalDto) {
    const goal = await this.findOwned(userId, id);
    if (goal.completed) throw new BadRequestException('Goal already completed');
    if (dto.title !== undefined) goal.title = dto.title.trim();
    if (dto.description !== undefined) goal.description = dto.description.trim();
    if (dto.difficulty !== undefined) goal.difficulty = dto.difficulty;
    if (dto.deadline !== undefined) goal.deadline = new Date(dto.deadline);
    await goal.save();
    return this.toView(goal);
  }

  async addStep(userId: string, id: string, dto: AddStepDto) {
    const goal = await this.findOwned(userId, id);
    if (goal.completed) throw new BadRequestException('Goal already completed');
    if (goal.steps.length >= 20) throw new BadRequestException('A goal can have at most 20 steps');
    goal.steps.push({ title: dto.title.trim(), done: false });
    await goal.save();
    return this.toView(goal);
  }

  async toggleStep(userId: string, id: string, stepId: string) {
    const goal = await this.findOwned(userId, id);
    if (goal.completed) throw new BadRequestException('Goal already completed');

    const step = goal.steps.find((s) => String(s._id) === stepId);
    if (!step) throw new NotFoundException('Step not found');
    step.done = !step.done;
    await goal.save();

    let reward: { xp: number; gold: number } | null = null;

    if (goal.steps.every((s) => s.done)) {
      const r = GOAL_REWARDS[goal.difficulty] ?? GOAL_REWARDS.medium;
      // Only one request can flip `completed` from false to true, so the
      // reward is paid exactly once even with double clicks.
      const completed = await this.goalModel.findOneAndUpdate(
        { _id: id, userId, completed: false },
        { $set: { completed: true, completedAt: new Date(), rewardXp: r.xp, rewardGold: r.gold } },
        { new: true },
      );
      if (completed) {
        await this.playersService.addExperience(userId, r.xp);
        const player = await this.playersService.findByUserId(userId);
        player.gold += r.gold;
        await player.save();
        this.notificationsGateway.sendToUser(userId, 'goal.completed', {
          goalTitle: goal.title,
          rewardXp: r.xp,
          rewardGold: r.gold,
        });
        reward = r;
        await this.achievementsService.evaluate(userId);
        return { goal: this.toView(completed), reward };
      }
    }

    return { goal: this.toView(goal), reward };
  }

  async remove(userId: string, id: string) {
    this.assertId(id);
    const res = await this.goalModel.deleteOne({ _id: id, userId });
    if (res.deletedCount === 0) throw new NotFoundException('Goal not found');
    return { deleted: true };
  }
}
