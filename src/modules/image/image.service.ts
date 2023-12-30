import { DeleteResult, Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { GetImageDto, UpdateImageDto } from './dto';
import { Image } from './image.entity';

import { Pagination } from '../../common/interfaces';
import { FileStorageService } from '../file-storage/file-storage.service';
import { OpenAIService } from '../openai/openai.service';
import { User } from '../user/user.entity';
import { GenerateImageDto } from './dto/generate-image.dto';
import { ROOT_IMAGES_DIR } from './image.constants';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image) private imageRepository: Repository<Image>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private fileStorageService: FileStorageService,
    private openAIService: OpenAIService
  ) {}

  public async generateImage(userId: number, dto: GenerateImageDto): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id: userId }, select: ['id', 'openAiKey'] });
    if (!user.openAiKey) {
      throw new NotFoundException('OpenAI key not found');
    }

    const buffer = await this.openAIService.generateImage(user.openAiKey, dto.prompt);

    const fileName = `${Date.now()}.png`;
    await this.fileStorageService.save(buffer, ROOT_IMAGES_DIR, fileName);

    const imagePayload = {
      userId,
      fileName,
      prompt: dto.prompt,
      title: dto.title,
    };
    const image = await this.imageRepository.save(imagePayload);

    return image;
  }

  public async get(userId: number, { limit, offset }: Pagination): Promise<[GetImageDto[], number]> {
    const { 0: images, 1: count } = await this.imageRepository.findAndCount({
      where: { userId },
      select: ['id', 'title'],
      skip: offset,
      take: limit,
    });

    return [images, count];
  }

  public async getById(userId: number, imageId: number): Promise<Image> {
    return this.imageRepository.findOneOrFail({ where: { userId, id: imageId } });
  }

  public async getFile(userId: number, imageId: number): Promise<Buffer> {
    const { fileName } = await this.imageRepository.findOneOrFail({
      where: { userId, id: imageId },
      select: ['fileName'],
    });

    return this.fileStorageService.get(ROOT_IMAGES_DIR, fileName);
  }

  public async update(userId: number, imageId: number, dto: UpdateImageDto): Promise<Image> {
    const audio = await this.imageRepository.findOneByOrFail({ userId, id: imageId });
    const payload = { ...audio, ...dto };
    return this.imageRepository.save(payload);
  }

  public async delete(userId: number, imageId: number): Promise<DeleteResult> {
    const audio = await this.imageRepository.findOneBy({ userId, id: imageId });
    if (!audio) return;

    await this.fileStorageService.delete(ROOT_IMAGES_DIR, audio.fileName);
    return this.imageRepository.delete(imageId);
  }
}
