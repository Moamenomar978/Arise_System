import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShopItem, ShopItemDocument } from './schemas/shop-item.schema';
import { CreateShopItemDto } from './dto/create-shop-item.dto';
import { PlayersService } from '../players/players.service';

@Injectable()
export class ShopService {
  constructor(
    @InjectModel(ShopItem.name) private shopItemModel: Model<ShopItemDocument>,
    private playersService: PlayersService,
  ) {}

  async create(createShopItemDto: CreateShopItemDto): Promise<ShopItemDocument> {
    const item = new this.shopItemModel(createShopItemDto);
    return item.save();
  }

  async findAll(): Promise<ShopItemDocument[]> {
    return this.shopItemModel.find().exec();
  }

  async purchaseItem(userId: string, itemId: string) {
    const item = await this.shopItemModel.findById(itemId);
    if (!item) throw new NotFoundException('Item not found');

    const player = await this.playersService.findByUserId(userId);
    if (player.gold < item.price) {
      throw new BadRequestException('Not enough gold');
    }

    player.gold -= item.price;
    await player.save();

    return { success: true, item, remainingGold: player.gold };
  }
}
