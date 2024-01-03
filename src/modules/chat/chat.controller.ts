import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { Chat } from './chat.entity';
import { ChatService } from './chat.service';
import { GenerateChatDto } from './dto';

import { BaseQueryDto } from '../../common/dto';
import { Response } from '../../common/interfaces';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

@Controller('chats')
@UseGuards(JwtGuard)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post()
  async generateChat(@GetUser('id') userId: number, @Body() dto: GenerateChatDto): Promise<Chat> {
    return this.chatService.generateChat(userId, dto);
  }

  @Get()
  public async get(@GetUser('id') userId: number, @Query() { page, limit }: BaseQueryDto): Promise<Response> {
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const offset = limit * (page - 1);

    const { 0: data, 1: count } = await this.chatService.get(userId, { limit, offset });

    return {
      pagination: { page, limit, count },
      data,
    };
  }
}
