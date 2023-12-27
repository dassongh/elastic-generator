import { DeleteResult, Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { AudioLink } from './audio.entity';
import { GenerateAudioDto, GetAudioDto, UpdateAudioDto } from './dto';

import { Pagination } from '../../common/interfaces';
import { FileStorageService } from '../file-storage/file-storage.service';
import { OpenAIService } from '../openai/openai.service';
import { User } from '../user/user.entity';

@Injectable()
export class AudioService {
  constructor(
    @InjectRepository(AudioLink) private audioLinkRepository: Repository<AudioLink>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private fileStorageService: FileStorageService,
    private openAIService: OpenAIService,
    private config: ConfigService
  ) {}

  public async generateAudioFromText(userId: number, dto: GenerateAudioDto): Promise<AudioLink> {
    const user = await this.userRepository.findOne({ where: { id: userId }, select: ['id', 'openAiKey'] });
    if (!user.openAiKey) {
      throw new NotFoundException('OpenAI key not found');
    }

    const openAiServicePayload = { text: dto.text, voice: dto.voice };
    const buffer = await this.openAIService.generateAudioFromText(user.openAiKey, openAiServicePayload);

    const fileName = `${Date.now()}.mp3`;
    await this.fileStorageService.save(buffer, fileName);

    const entityPayload = {
      userId,
      link: `${this.config.get('BASE_URL')}/audio/${fileName}`,
      title: dto.title,
      voice: dto.voice,
      transcription: dto.text,
    };
    const audioEntity = await this.audioLinkRepository.save(entityPayload);

    return audioEntity;
  }

  public async get(userId: number, { limit, offset }: Pagination): Promise<[GetAudioDto[], number]> {
    const { 0: audioLinks, 1: count } = await this.audioLinkRepository.findAndCount({
      where: { userId },
      select: ['id', 'link', 'title'],
      skip: offset,
      take: limit,
    });

    return [audioLinks, count];
  }

  public async getById(userId: number, audioId: number): Promise<AudioLink> {
    return this.audioLinkRepository.findOneOrFail({ where: { userId, id: audioId } });
  }

  public async getFile(userId: number, audioId: number): Promise<Buffer> {
    const { link } = await this.audioLinkRepository.findOneOrFail({ where: { userId, id: audioId }, select: ['link'] });
    const fileName = this.getFileName(link);

    return this.fileStorageService.get(fileName);
  }

  public async update(userId: number, audioId: number, dto: UpdateAudioDto): Promise<AudioLink> {
    const audioLink = await this.audioLinkRepository.findOneByOrFail({ userId, id: audioId });
    const payload = { ...audioLink, ...dto };
    return this.audioLinkRepository.save(payload);
  }

  public async delete(userId: number, audioId: number): Promise<DeleteResult | void> {
    const audioLink = await this.audioLinkRepository.findOneBy({ userId, id: audioId });
    if (!audioLink) return;

    const fileName = this.getFileName(audioLink.link);
    await this.fileStorageService.delete(fileName);
    return this.audioLinkRepository.delete(audioId);
  }

  private getFileName(link: string): string {
    return link.split('/').pop();
  }
}
