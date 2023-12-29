import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { GenerateImageDto } from './dto';
import { ImageService } from './image.service';

import { Response } from '../../common/interfaces';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('image')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Post('generate')
  public async generateImage(@GetUser('id') userId: number, @Body() dto: GenerateImageDto): Promise<Response> {
    const data = await this.imageService.generateImage(userId, dto);
    return { data };
  }
}
