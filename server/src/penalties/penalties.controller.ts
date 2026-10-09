import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { PenaltiesService } from './penalties.service';

@Controller('penalties')
@UseGuards(JwtAuthGuard)
export class PenaltiesController {
  constructor(private readonly penaltiesService: PenaltiesService) {}

  @Get('status')
  status(@Request() req) {
    return this.penaltiesService.getStatus(req.user.userId);
  }

  @Post('start')
  start(@Request() req) {
    return this.penaltiesService.start(req.user.userId);
  }

  @Post('complete')
  complete(@Request() req) {
    return this.penaltiesService.complete(req.user.userId);
  }

  // Admin only: runs the nightly check right now (handy for testing)
  @UseGuards(RolesGuard)
  @Roles('admin')
  @Post('run-check')
  runCheck() {
    return this.penaltiesService.runNightlyCheck();
  }
}
