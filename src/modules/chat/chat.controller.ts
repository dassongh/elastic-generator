import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';

import { Chat } from './chat.entity';
import { ChatService } from './chat.service';
import { GenerateChatDto, GenerateMessageDto } from './dto';

import { BaseParamDto, BaseQueryDto } from '../../common/dto';
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

  @Post('/:id/generate-message')
  async generateMessage(@GetUser('id') userId: number, @Param() { id }: BaseParamDto, @Body() dto: GenerateMessageDto) {
    return this.chatService.generateMessage(userId, id, dto);
  }

  @Get()
  public async get(@GetUser('id') userId: number, @Query() { page, limit }: BaseQueryDto): Promise<Response> {
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const offset = limit * (page - 1);

    const { data, count } = await this.chatService.get(userId, { limit, offset });

    return {
      pagination: { page, limit, count },
      data,
    };
  }

  @Get('/:id')
  public async getById(@GetUser('id') userId: number, @Param() { id }: BaseParamDto): Promise<Response> {
    const data = await this.chatService.getById(userId, id);
    return { data };
  }

  @Delete('/:id')
  public async delete(@GetUser('id') userId: number, @Param() { id }: BaseParamDto) {
    await this.chatService.delete(userId, id);
    return { message: 'ok' };
  }
}
