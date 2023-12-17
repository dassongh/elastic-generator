import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { FileStorageService } from '../file-storage/file-storage.service';
import { OpenAIService } from '../openai/openai.service';

import { AudioLink } from './audio.entity';

@Injectable()
export class AudioService {
  constructor(
    @InjectRepository(AudioLink) private audioLinkRepository: Repository<AudioLink>,
    private fileStorageService: FileStorageService,
    private openAIService: OpenAIService,
    private config: ConfigService
  ) {}

  public async generateAudioFromText(userId: number, text: string): Promise<string> {
    const buffer = await this.openAIService.generateAudioFromText(text);
    const fileName = `${Date.now()}.mp3`;
    await this.fileStorageService.saveAudioFile(buffer, fileName);

    const fileLink = `${this.config.get('BASE_URL')}/audio/${fileName}`;
    await this.audioLinkRepository.save({ userId, link: fileLink });

    return fileLink;
  }
}
