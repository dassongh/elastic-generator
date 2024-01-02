import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { Chat } from './chat.entity';
import { ChatService } from './chat.service';
import { GenerateChatDto } from './dto';

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
}
