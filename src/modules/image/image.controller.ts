import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Post,
  Put,
  Query,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';

import { GenerateImageDto, UpdateImageDto } from './dto';
import { ImageService } from './image.service';

import { BaseParamDto, BaseQueryDto } from '../../common/dto';
import { Response } from '../../common/interfaces';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('images')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Post('generate')
  public async generateImage(@GetUser('id') userId: number, @Body() dto: GenerateImageDto): Promise<Response> {
    const data = await this.imageService.generateImage(userId, dto);
    return { data };
  }

  @Get()
  public async get(@GetUser('id') userId: number, @Query() { page, limit }: BaseQueryDto): Promise<Response> {
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const offset = limit * (page - 1);

    const { data, count } = await this.imageService.get(userId, { limit, offset });

    return {
      pagination: { page, limit, count },
      data,
    };
  }

  @Get('/:id')
  public async getById(@GetUser('id') userId: number, @Param() { id }: BaseParamDto): Promise<Response> {
    const data = await this.imageService.getById(userId, id);
    return { data };
  }

  @Get('/:id/serve')
  @Header('Content-Type', 'image/png')
  public async serve(@GetUser('id') userId: number, @Param() { id }: BaseParamDto): Promise<StreamableFile> {
    const buffer = await this.imageService.getFile(userId, id);
    return new StreamableFile(buffer);
  }

  @Put('/:id')
  public async update(
    @GetUser('id') userId: number,
    @Param() { id }: BaseParamDto,
    @Body() dto: UpdateImageDto
  ): Promise<Response> {
    const data = await this.imageService.update(userId, id, dto);
    return { data };
  }

  @Delete('/:id')
  public async delete(@GetUser('id') userId: number, @Param() { id }: BaseParamDto): Promise<Response> {
    await this.imageService.delete(userId, id);
    return { message: 'ok' };
  }
}
