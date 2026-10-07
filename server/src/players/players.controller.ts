import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PlayersService } from './players.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AllocateStatsDto } from './dto/allocate-stats.dto';

@Controller('players')
@UseGuards(JwtAuthGuard)
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Get('me')
  getProfile(@Request() req) {
    return this.playersService.findByUserId(req.user.userId);
  }

  @Post('allocate-stats')
  allocateStats(@Request() req, @Body() allocateStatsDto: AllocateStatsDto) {
    return this.playersService.allocateStats(req.user.userId, allocateStatsDto);
  }
}
