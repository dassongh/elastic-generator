import { Injectable } from '@nestjs/common';

import { DEFAULT_MODEL_ROLE_MESSAGE } from './chat.constants';
import { Chat } from './chat.entity';
import { GenerateChatDto, GetChatsDto } from './dto';

import { Pagination } from '../../common/interfaces';
import { OpenAIService } from '../openai/openai.service';
import { ChatRepository } from './chat.repository';
import { Role } from './message/message.constants';

@Injectable()
export class ChatService {
  constructor(
    private chatRepository: ChatRepository,
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

  public async get(userId: number, { limit, offset }: Pagination): Promise<[GetChatsDto[], number]> {
    const { 0: chats, 1: count } = await this.chatRepository.findAndCount({
      where: { userId },
      select: ['id', 'modelRole', 'messages'],
      relations: { messages: {} },
      skip: offset,
      take: limit,
    });

    return [chats, count];
  }

  public async getById(userId: number, chatId: number): Promise<Chat> {
    return this.chatRepository.findOneOrFail({ where: { userId, id: chatId }, relations: { messages: true } });
  }
}
