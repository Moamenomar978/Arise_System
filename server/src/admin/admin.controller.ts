import { Controller, Delete, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AdminService } from './admin.service';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  stats() {
    return this.adminService.stats();
  }

  @Get('users')
  listUsers() {
    return this.adminService.listUsers();
  }

  @Post('users/:id/reset-progress')
  resetProgress(@Param('id') id: string) {
    return this.adminService.resetProgress(id);
  }

  @Delete('users/:id')
  deleteUser(@Request() req, @Param('id') id: string) {
    return this.adminService.deleteUser(id, req.user.userId);
  }
}
