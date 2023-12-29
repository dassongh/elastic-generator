import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Image } from './image.entity';

import { OpenAIService } from '../openai/openai.service';
import { User } from '../user/user.entity';
import { GenerateImageDto } from './dto/generate-image.dto';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image) private imageRepository: Repository<Image>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private openAIService: OpenAIService
  ) {}

  public async generateImage(userId: number, dto: GenerateImageDto): Promise<any> {
    const user = await this.userRepository.findOne({ where: { id: userId }, select: ['id', 'openAiKey'] });
    if (!user.openAiKey) {
      throw new NotFoundException('OpenAI key not found');
    }

    const imageFromOpenAi = await this.openAIService.generateImage(user.openAiKey, dto.prompt);

    const imagePayload = {
      userId,
      link: imageFromOpenAi.data[0].url,
      prompt: dto.prompt,
      title: dto.title,
    };
    const image = await this.imageRepository.save(imagePayload);

    return image;
  }
}
