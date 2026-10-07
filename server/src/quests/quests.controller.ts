import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { QuestsService } from './quests.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UpdateQuestDto } from './dto/update-quest.dto';

@Controller('quests')
@UseGuards(JwtAuthGuard)
export class QuestsController {
  constructor(private readonly questsService: QuestsService) {}

  // ----- player -----
  @Get()
  getAllUserQuests(@Request() req) {
    return this.questsService.getUserQuests(req.user.userId);
  }

  @Post(':id/complete')
  completeQuest(@Request() req, @Param('id') questId: string) {
    return this.questsService.completeQuest(req.user.userId, questId);
  }

  // ----- admin -----
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Get('admin/all')
  getAllForAdmin() {
    return this.questsService.findAllForAdmin();
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Post()
  createQuest(@Body() createQuestDto: CreateQuestDto) {
    return this.questsService.create(createQuestDto);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Put(':id')
  updateQuest(@Param('id') id: string, @Body() dto: UpdateQuestDto) {
    return this.questsService.update(id, dto);
  }

  @UseGuards(RolesGuard)
  @Roles('admin')
  @Delete(':id')
  deleteQuest(@Param('id') id: string) {
    return this.questsService.remove(id);
  }
}
