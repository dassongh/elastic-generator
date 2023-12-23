import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';

import { SaveUserKeyDto } from './dto';
import { User } from './user.entity';
import { UserService } from './user.service';

import { Response } from '../../common/interfaces';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  public getMe(@GetUser() user: User): Response {
    return { data: user };
  }

  @Get(':id')
  public async getById(@Param('id') id: number): Promise<Response> {
    const user = await this.userService.getById(id);
    return { data: user };
  }

  @HttpCode(HttpStatus.OK)
  @Post('openai')
  public async saveOpenAiKey(@GetUser('id') userId: number, @Body() { key }: SaveUserKeyDto): Promise<Response> {
    await this.userService.saveOpenAiKey(userId, key);
    return { message: 'ok' };
  }
}
