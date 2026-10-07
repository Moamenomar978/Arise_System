import { BadRequestException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { Quest, QuestDocument } from './schemas/quest.schema';
import { QuestProgress, QuestProgressDocument } from './schemas/quest-progress.schema';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';
import { SEED_QUESTS } from './quests.seed';
import { PlayersService } from '../players/players.service';
import { UsersService } from '../users/users.service';
import { NotificationsGateway } from '../notifications/notifications.gateway';

const pad = (n: number) => String(n).padStart(2, '0');

/** ISO week number, e.g. 2026-W41 */
function isoWeekKey(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${pad(week)}`;
}

/** Which "period" a quest's progress belongs to right now. */
export function periodKeyFor(type: string, now = new Date()): string {
  if (type === 'daily') return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  if (type === 'weekly') return isoWeekKey(now);
  return 'once';
}

/** When the current period ends (used for the countdown in the UI). */
function deadlineFor(type: string, now = new Date()): string | undefined {
  if (type === 'daily') {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();
  }
  if (type === 'weekly') {
    const daysUntilMonday = ((8 - now.getDay()) % 7) || 7;
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + daysUntilMonday).toISOString();
  }
  return undefined;
}

@Injectable()
export class QuestsService implements OnModuleInit {
  private readonly logger = new Logger(QuestsService.name);

  constructor(
    @InjectModel(Quest.name) private questModel: Model<QuestDocument>,
    @InjectModel(QuestProgress.name) private progressModel: Model<QuestProgressDocument>,
    private playersService: PlayersService,
    private usersService: UsersService,
    private notificationsGateway: NotificationsGateway,
  ) {}

  /** Insert the ready-made quests the first time the app runs. */
  async onModuleInit() {
    try {
      const count = await this.questModel.estimatedDocumentCount();
      if (count === 0) {
        await this.questModel.insertMany(SEED_QUESTS);
        this.logger.log(`Seeded ${SEED_QUESTS.length} default quests`);
      }
    } catch (e) {
      this.logger.error('Could not seed quests: ' + (e as Error).message);
    }
  }

  // ---------------------------------------------------------------- admin

  create(dto: CreateQuestDto): Promise<QuestDocument> {
    return new this.questModel(dto).save();
  }

  findAllForAdmin() {
    return this.questModel.find().sort({ type: 1, createdAt: 1 }).exec();
  }

  async update(id: string, dto: UpdateQuestDto): Promise<QuestDocument> {
    this.assertId(id);
    const quest = await this.questModel.findByIdAndUpdate(id, { $set: dto }, { new: true, runValidators: true });
    if (!quest) throw new NotFoundException('Quest not found');
    return quest;
  }

  async remove(id: string) {
    this.assertId(id);
    const quest = await this.questModel.findByIdAndDelete(id);
    if (!quest) throw new NotFoundException('Quest not found');
    await this.progressModel.deleteMany({ questId: id });
    return { deleted: true };
  }

  // --------------------------------------------------------------- players

  async getUserQuests(userId: string) {
    const now = new Date();
    const quests = await this.questModel.find({ isActive: { $ne: false } }).sort({ createdAt: 1 }).exec();
    const keys = [...new Set(quests.map((q) => periodKeyFor(q.type, now)))];
    const progresses = await this.progressModel.find({ userId, periodKey: { $in: keys } });

    return quests.map((quest) => {
      const key = periodKeyFor(quest.type, now);
      const progress = progresses.find(
        (p) => p.questId.toString() === quest._id.toString() && p.periodKey === key,
      );
      return {
        ...quest.toObject(),
        progress: progress ? progress.currentAmount : 0,
        completed: progress ? progress.completed : false,
        deadline: deadlineFor(quest.type, now),
      };
    });
  }

  async completeQuest(userId: string, questId: string) {
    this.assertId(questId);
    const quest = await this.questModel.findById(questId);
    if (!quest || quest.isActive === false) throw new NotFoundException('Quest not found');

    const periodKey = periodKeyFor(quest.type);

    // Atomic "complete once per period": if it is already completed the filter
    // does not match, the upsert tries to insert, and the unique index rejects it.
    let progress: QuestProgressDocument | null;
    try {
      progress = await this.progressModel.findOneAndUpdate(
        { userId, questId, periodKey, completed: { $ne: true } },
        { $set: { currentAmount: quest.targetAmount, completed: true } },
        { upsert: true, new: true },
      );
    } catch (e: any) {
      if (e?.code === 11000) {
        return this.progressModel.findOne({ userId, questId, periodKey });
      }
      throw e;
    }

    await this.playersService.addExperience(userId, quest.rewardXp);
    const player = await this.playersService.findByUserId(userId);
    player.gold += quest.rewardGold;
    await player.save();

    this.notificationsGateway.sendToUser(userId, 'quest.completed', {
      questTitle: quest.title,
      rewardXp: quest.rewardXp,
      rewardGold: quest.rewardGold,
    });

    return progress;
  }

  private assertId(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid quest id');
  }
}
