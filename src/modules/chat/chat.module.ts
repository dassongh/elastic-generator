import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { MessageModule } from './message/message.module';

@Module({
  controllers: [ChatController],
  imports: [MessageModule],
})
export class ChatModule {}
