import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GoalsService } from './goals.service';
import { AddStepDto, CreateGoalDto, UpdateGoalDto } from './dto/goal.dto';

@Controller('goals')
@UseGuards(JwtAuthGuard)
export class GoalsController {
  constructor(private readonly goalsService: GoalsService) {}

  @Get()
  list(@Request() req) {
    return this.goalsService.list(req.user.userId);
  }

  @Post()
  create(@Request() req, @Body() dto: CreateGoalDto) {
    return this.goalsService.create(req.user.userId, dto);
  }

  @Put(':id')
  update(@Request() req, @Param('id') id: string, @Body() dto: UpdateGoalDto) {
    return this.goalsService.update(req.user.userId, id, dto);
  }

  @Post(':id/steps')
  addStep(@Request() req, @Param('id') id: string, @Body() dto: AddStepDto) {
    return this.goalsService.addStep(req.user.userId, id, dto);
  }

  @Post(':id/steps/:stepId/toggle')
  toggleStep(@Request() req, @Param('id') id: string, @Param('stepId') stepId: string) {
    return this.goalsService.toggleStep(req.user.userId, id, stepId);
  }

  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.goalsService.remove(req.user.userId, id);
  }
}
