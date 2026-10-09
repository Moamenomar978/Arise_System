import { Injectable, BadRequestException, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { ShopItem, ShopItemDocument } from './schemas/shop-item.schema';
import { CreateShopItemDto } from './dto/create-shop-item.dto';
import { SEED_ITEMS } from './shop.seed';
import { PlayersService } from '../players/players.service';
import { AchievementsService } from '../achievements/achievements.service';

@Injectable()
export class ShopService implements OnModuleInit {
  private readonly logger = new Logger(ShopService.name);

  constructor(
    @InjectModel(ShopItem.name) private shopItemModel: Model<ShopItemDocument>,
    private playersService: PlayersService,
    private achievementsService: AchievementsService,
  ) {}

  async onModuleInit() {
    try {
      if ((await this.shopItemModel.estimatedDocumentCount()) === 0) {
        await this.shopItemModel.insertMany(SEED_ITEMS);
        this.logger.log(`Seeded ${SEED_ITEMS.length} shop items`);
      }
    } catch (e) {
      this.logger.error('Could not seed the shop: ' + (e as Error).message);
    }
  }

  async create(createShopItemDto: CreateShopItemDto): Promise<ShopItemDocument> {
    const item = new this.shopItemModel(createShopItemDto);
    return item.save();
  }

  async findAll(): Promise<ShopItemDocument[]> {
    return this.shopItemModel.find().sort({ price: 1 }).exec();
  }

  async purchaseItem(userId: string, itemId: string) {
    if (!isValidObjectId(itemId)) throw new BadRequestException('Invalid item id');
    const item = await this.shopItemModel.findById(itemId);
    if (!item) throw new NotFoundException('Item not found');

    // Refuse useless purchases before taking any gold
    const before = await this.playersService.findByUserId(userId);
    if (item.effectType === 'heal' && before.hp >= before.maxHp) {
      throw new BadRequestException('Your HP is already full');
    }
    if (item.effectType === 'pardon' && !before.inPenaltyZone) {
      throw new BadRequestException('You are not in the Penalty Zone');
    }

    // Atomic: fails without taking anything if the player cannot afford it
    await this.playersService.spendGold(userId, item.price);

    switch (item.effectType) {
      case 'heal':
        await this.playersService.heal(userId, item.effectValue);
        break;
      case 'xp':
        await this.playersService.addExperience(userId, item.effectValue);
        break;
      case 'statpoint':
        await this.playersService.addStatPoints(userId, item.effectValue);
        break;
      case 'streakfreeze':
        await this.playersService.addStreakFreeze(userId, item.effectValue || 1);
        break;
      case 'pardon':
        await this.playersService.clearPenalty(userId);
        break;
      default:
        await this.playersService.addToInventory(userId, { id: String(item._id), name: item.name, icon: item.icon });
    }

    await this.achievementsService.evaluate(userId);

    const after = await this.playersService.findByUserId(userId);
    return { success: true, item, remainingGold: after.gold };
  }
}
