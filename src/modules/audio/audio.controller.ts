import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { AudioService } from './audio.service';
import { GenerateAudioDto } from './dto';

import { BaseQueryDto } from '../../common/dto';
import { Response } from '../../common/interfaces';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';

@UseGuards(JwtGuard)
@Controller('audio')
export class AudioController {
  constructor(private audioService: AudioService) {}

  @Post('generate')
  public async generateAudio(@GetUser('id') userId: number, @Body() { text }: GenerateAudioDto): Promise<Response> {
    const link = await this.audioService.generateAudioFromText(userId, text);
    return { data: { link } };
  }

  @Get('files')
  public async getAudioLinks(@GetUser('id') userId: number, @Query() { page, limit }: BaseQueryDto): Promise<Response> {
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const offset = limit * (page - 1);

    const { 0: links, 1: count } = await this.audioService.getAudioLinks(userId, { limit, offset });

    return {
      pagination: { page, limit, count },
      data: links,
    };
  }
}
