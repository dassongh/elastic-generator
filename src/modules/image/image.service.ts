import { DeleteResult } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';

import { GetImageDto, UpdateImageDto } from './dto';
import { GenerateImageDto } from './dto/generate-image.dto';
import { ROOT_IMAGES_DIR } from './image.constants';
import { Image } from './image.entity';

import { PaginatedResponse, Pagination } from '../../common/interfaces';
import { FileStorageService } from '../file-storage/file-storage.service';
import { OpenAIService } from '../openai/openai.service';
import { UserRepository } from '../user/user.repository';
import { ImageRepository } from './image.repository';

@Injectable()
export class ImageService {
  constructor(
    private imageRepository: ImageRepository,
    private userRepository: UserRepository,
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

  public async get(userId: number, { limit, offset }: Pagination): Promise<PaginatedResponse<GetImageDto[]>> {
    const { 0: images, 1: count } = await this.imageRepository.findAndCount({
      where: { userId },
      select: ['id', 'title'],
      skip: offset,
      take: limit,
    });

    return { data: images, count };
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
