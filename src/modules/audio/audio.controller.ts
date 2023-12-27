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

import { AudioService } from './audio.service';
import { GenerateAudioDto, UpdateAudioDto } from './dto';

import { BaseParamDto, BaseQueryDto } from '../../common/dto';
import { Response } from '../../common/interfaces';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('audio')
export class AudioController {
  constructor(private audioService: AudioService) {}

  @Post('generate')
  public async generateAudio(@GetUser('id') userId: number, @Body() dto: GenerateAudioDto): Promise<Response> {
    const data = await this.audioService.generateAudioFromText(userId, dto);
    return { data };
  }

  @Get()
  public async get(@GetUser('id') userId: number, @Query() { page, limit }: BaseQueryDto): Promise<Response> {
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const offset = limit * (page - 1);

    const { 0: data, 1: count } = await this.audioService.get(userId, { limit, offset });

    return {
      pagination: { page, limit, count },
      data,
    };
  }

  @Get('/:id')
  public async getById(@GetUser('id') userId: number, @Param() { id }: BaseParamDto): Promise<Response> {
    const data = await this.audioService.getById(userId, id);
    return { data };
  }

  @Get('/:id/play')
  @Header('Content-Type', 'audio/mp3')
  public async play(@GetUser('id') userId: number, @Param() { id }: BaseParamDto): Promise<StreamableFile> {
    const buffer = await this.audioService.getFile(userId, id);
    return new StreamableFile(buffer);
  }

  @Put('/:id')
  public async update(
    @GetUser('id') userId: number,
    @Param() { id }: BaseParamDto,
    @Body() dto: UpdateAudioDto
  ): Promise<Response> {
    const data = await this.audioService.update(userId, id, dto);
    return { data };
  }

  @Delete('/:id')
  public async delete(@GetUser('id') userId: number, @Param() { id }: BaseParamDto): Promise<Response> {
    await this.audioService.delete(userId, id);
    return { message: 'ok' };
  }
}
