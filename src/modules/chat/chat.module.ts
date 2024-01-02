import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatController } from './chat.controller';
import { Chat } from './chat.entity';
import { ChatService } from './chat.service';

import { Message } from './message/message.entity';
import { MessageModule } from './message/message.module';

import { OpenAIModule } from '../openai/openai.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message]), MessageModule, OpenAIModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
