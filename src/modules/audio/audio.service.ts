import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { FileStorageService } from '../file-storage/file-storage.service';
import { OpenAIService } from '../openai/openai.service';

import { Pagination } from '../../common/interfaces';
import { User } from '../user/user.entity';
import { AudioLink } from './audio.entity';
import { GenerateAudioDto } from './dto';

@Injectable()
export class AudioService {
  constructor(
    @InjectRepository(AudioLink) private audioLinkRepository: Repository<AudioLink>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private fileStorageService: FileStorageService,
    private openAIService: OpenAIService,
    private config: ConfigService
  ) {}

  public async generateAudioFromText(userId: number, dto: GenerateAudioDto): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id: userId }, select: ['id', 'openAiKey'] });
    if (!user.openAiKey) {
      throw new NotFoundException('OpenAI key not found');
    }

    const buffer = await this.openAIService.generateAudioFromText(user.openAiKey, dto.text);

    const fileName = `${Date.now()}.mp3`;
    await this.fileStorageService.saveAudioFile(buffer, fileName);

    const fileLink = `${this.config.get('BASE_URL')}/audio/${fileName}`;
    await this.audioLinkRepository.save({ userId, link: fileLink, title: dto.title });

    return fileLink;
  }

  public async getAudioLinks(userId: number, { limit, offset }: Pagination): Promise<[AudioLink[], number]> {
    const { 0: audioLinks, 1: count } = await this.audioLinkRepository.findAndCount({
      where: { userId },
      select: ['id', 'title', 'link'],
      skip: offset,
      take: limit,
    });

    return [audioLinks, count];
  }
}
