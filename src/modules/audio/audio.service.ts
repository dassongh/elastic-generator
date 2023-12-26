import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { FileStorageService } from '../file-storage/file-storage.service';
import { OpenAIService } from '../openai/openai.service';

import { DeleteResult } from 'typeorm/browser';
import { Pagination } from '../../common/interfaces';
import { User } from '../user/user.entity';
import { AudioLink } from './audio.entity';
import { GenerateAudioDto, UpdateAudioDto } from './dto';

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

    const buffer = await this.openAIService.generateAudioFromText(user.openAiKey, dto.text);

    const fileName = `${Date.now()}.mp3`;
    await this.fileStorageService.save(buffer, fileName);

    const fileLink = `${this.config.get('BASE_URL')}/audio/${fileName}`;
    const audioEntity = await this.audioLinkRepository.save({ userId, link: fileLink, title: dto.title });

    return audioEntity;
  }

  public async get(userId: number, { limit, offset }: Pagination): Promise<[AudioLink[], number]> {
    const { 0: audioLinks, 1: count } = await this.audioLinkRepository.findAndCount({
      where: { userId },
      select: ['id', 'title', 'link'],
      skip: offset,
      take: limit,
    });

    return [audioLinks, count];
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
