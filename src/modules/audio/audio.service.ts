import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { FileStorageService } from '../file-storage/file-storage.service';
import { OpenAIService } from '../openai/openai.service';

import { User } from '../user/user.entity';
import { AudioLink } from './audio.entity';

@Injectable()
export class AudioService {
  constructor(
    @InjectRepository(AudioLink) private audioLinkRepository: Repository<AudioLink>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private fileStorageService: FileStorageService,
    private openAIService: OpenAIService,
    private config: ConfigService
  ) {}

  public async generateAudioFromText(userId: number, text: string): Promise<string> {
    const user = await this.userRepository.findOne({ where: { id: userId }, select: { id: true, openAiKey: true } });
    if (!user.openAiKey) {
      throw new NotFoundException('OpenAI key not found');
    }

    const buffer = await this.openAIService.generateAudioFromText(user.openAiKey, text);
    const fileName = `${Date.now()}.mp3`;
    await this.fileStorageService.saveAudioFile(buffer, fileName);

    const fileLink = `${this.config.get('BASE_URL')}/audio/${fileName}`;
    await this.audioLinkRepository.save({ userId, link: fileLink });

    return fileLink;
  }
}
