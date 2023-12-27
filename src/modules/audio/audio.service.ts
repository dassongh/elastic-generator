import { DeleteResult, Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { ROOT_AUDIO_DIR } from './audio.constants';
import { Audio } from './audio.entity';
import { GenerateAudioDto, GetAudioDto, UpdateAudioDto } from './dto';

import { Pagination } from '../../common/interfaces';
import { FileStorageService } from '../file-storage/file-storage.service';
import { OpenAIService } from '../openai/openai.service';
import { User } from '../user/user.entity';

@Injectable()
export class AudioService {
  constructor(
    @InjectRepository(Audio) private audioRepository: Repository<Audio>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private fileStorageService: FileStorageService,
    private openAIService: OpenAIService
  ) {}

  public async generateAudioFromText(userId: number, dto: GenerateAudioDto): Promise<Audio> {
    const user = await this.userRepository.findOne({ where: { id: userId }, select: ['id', 'openAiKey'] });
    if (!user.openAiKey) {
      throw new NotFoundException('OpenAI key not found');
    }

    const openAiServicePayload = { text: dto.text, voice: dto.voice };
    const buffer = await this.openAIService.generateAudioFromText(user.openAiKey, openAiServicePayload);

    const fileName = `${Date.now()}.mp3`;
    await this.fileStorageService.save(buffer, ROOT_AUDIO_DIR, fileName);

    const entityPayload = {
      userId,
      fileName,
      title: dto.title,
      voice: dto.voice,
      transcription: dto.text,
    };
    const audioEntity = await this.audioRepository.save(entityPayload);

    return audioEntity;
  }

  public async get(userId: number, { limit, offset }: Pagination): Promise<[GetAudioDto[], number]> {
    const { 0: audios, 1: count } = await this.audioRepository.findAndCount({
      where: { userId },
      select: ['id', 'title'],
      skip: offset,
      take: limit,
    });

    return [audios, count];
  }

  public async getById(userId: number, audioId: number): Promise<Audio> {
    return this.audioRepository.findOneOrFail({ where: { userId, id: audioId } });
  }

  public async getFile(userId: number, audioId: number): Promise<Buffer> {
    const { fileName } = await this.audioRepository.findOneOrFail({
      where: { userId, id: audioId },
      select: ['fileName'],
    });

    return this.fileStorageService.get(ROOT_AUDIO_DIR, fileName);
  }

  public async update(userId: number, audioId: number, dto: UpdateAudioDto): Promise<Audio> {
    const audio = await this.audioRepository.findOneByOrFail({ userId, id: audioId });
    const payload = { ...audio, ...dto };
    return this.audioRepository.save(payload);
  }

  public async delete(userId: number, audioId: number): Promise<DeleteResult | void> {
    const audio = await this.audioRepository.findOneBy({ userId, id: audioId });
    if (!audio) return;

    await this.fileStorageService.delete(ROOT_AUDIO_DIR, audio.fileName);
    return this.audioRepository.delete(audioId);
  }
}
