import { ChatCompletionUserMessageParam } from 'openai/resources/index';

import { Injectable, NotFoundException } from '@nestjs/common';

import { DEFAULT_MODEL_ROLE_MESSAGE } from './chat.constants';
import { Chat } from './chat.entity';
import { ChatRepository } from './chat.repository';
import { GenerateChatDto, GenerateMessageDto, GetChatsDto } from './dto';

import { Role } from './message/message.constants';
import { MessageRepository } from './message/message.repository';

import { PaginatedResponse, Pagination } from '../../common/interfaces';
import { OpenAIService } from '../openai/openai.service';
import { UserRepository } from '../user/user.repository';
import { Message } from './message/message.entity';

@Injectable()
export class ChatService {
  constructor(
    private chatRepository: ChatRepository,
    private messageRepository: MessageRepository,
    private userRepository: UserRepository,
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

  public async generateMessage(userId: number, chatId: number, { content }: GenerateMessageDto): Promise<Message> {
    const { openAiKey } = await this.userRepository.findOne({ where: { id: userId }, select: ['openAiKey'] });
    if (!openAiKey) {
      throw new NotFoundException('OpenAI key not found');
    }

    const existedMessages = await this.messageRepository.find({
      where: { chatId },
      select: ['role', 'content'],
      order: { createdAt: 'ASC' },
    });
    if (!existedMessages.length) {
      throw new NotFoundException('Chat not found');
    }

    const messagePayload = { role: Role.USER, content };
    await this.messageRepository.save({ ...messagePayload, chatId });

    const generatedMessage = await this.openAIService.generateText(
      openAiKey,
      existedMessages,
      messagePayload as ChatCompletionUserMessageParam
    );

    const modelResponseMessagePayload = {
      chatId,
      role: Role.ASSISTANT,
      content: generatedMessage.choices[0].message.content,
    };
    const response = await this.messageRepository.save(modelResponseMessagePayload);

    return response;
  }

  public async get(userId: number, pagination: Pagination): Promise<PaginatedResponse<GetChatsDto[]>> {
    const { 0: chats, 1: count } = await Promise.all([
      this.chatRepository.getChats(userId, pagination),
      this.chatRepository.count({ where: { userId } }),
    ]);

    const chatsView = chats.map(chat => ({
      id: chat.id,
      modelRole: chat.modelRole,
      createdAt: chat.chatCreatedAt,
      lastMessage: {
        id: chat.messageId,
        content: chat.content,
        role: chat.role,
        createdAt: chat.messageCreatedAt,
      },
    }));

    return { data: chatsView, count };
  }

  public getById(userId: number, chatId: number): Promise<Chat> {
    return this.chatRepository.findOneOrFail({ where: { userId, id: chatId }, relations: { messages: true } });
  }

  public delete(userId: number, chatId: number) {
    return this.chatRepository.delete({ userId, id: chatId });
  }
}
