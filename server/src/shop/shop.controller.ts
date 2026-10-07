import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ShopService } from './shop.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateShopItemDto } from './dto/create-shop-item.dto';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Get('items')
  findAll() {
    return this.shopService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post('purchase/:itemId')
  purchaseItem(@Request() req, @Param('itemId') itemId: string) {
    return this.shopService.purchaseItem(req.user.userId, itemId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('items')
  createItem(@Body() createShopItemDto: CreateShopItemDto) {
    return this.shopService.create(createShopItemDto);
  }
}
