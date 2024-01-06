import { Message } from '../message/message.entity';

export abstract class GetChatsDto {
  id: number;
  modelRole: string;
  createdAt: Date;
  lastMessage: Omit<Message, 'chat' | 'chatId'>;
}
