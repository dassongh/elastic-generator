import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DEFAULT_MODEL_ROLE_MESSAGE } from './chat.constants';
import { Chat } from './chat.entity';
import { GenerateChatDto } from './dto';

import { OpenAIService } from '../openai/openai.service';
import { Role } from './message/message.constants';
import { Message } from './message/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    private openAIService: OpenAIService
  ) {}

  public async generateChat(userId: number, dto: GenerateChatDto): Promise<Chat> {
    const modelRole = dto.modelRole || DEFAULT_MODEL_ROLE_MESSAGE;
    const chatPayload = {
      userId,
      modelRole: modelRole,
      messages: [
        {
          role: Role.SYSTEM,
          content: modelRole,
        },
      ],
    };
    const chat = await this.chatRepository.save(chatPayload);
    return chat;
  }
}
