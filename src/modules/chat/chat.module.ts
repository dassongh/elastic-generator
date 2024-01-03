import { Module } from '@nestjs/common';

import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

import { MessageModule } from './message/message.module';

import { OpenAIModule } from '../openai/openai.module';
import { UserModule } from '../user/user.module';
import { ChatRepository } from './chat.repository';

@Module({
  imports: [MessageModule, OpenAIModule, UserModule],
  controllers: [ChatController],
  providers: [ChatService, ChatRepository],
})
export class ChatModule {}
