import { Controller, Get, Param, UseGuards } from '@nestjs/common';

import { User } from './user.entity';

import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.userService.getById(id);
  }
}
