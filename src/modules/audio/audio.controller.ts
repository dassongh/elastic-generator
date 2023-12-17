import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { Response } from '../../common/interfaces';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { AudioService } from './audio.service';

@UseGuards(JwtGuard)
@Controller('audio')
export class AudioController {
  constructor(private audioService: AudioService) {}

  @Post('generate')
  public async generateAudio(@GetUser('id') userId: number, @Body('text') text: string): Promise<Response> {
    const link = await this.audioService.generateAudioFromText(userId, text);
    return { data: { link } };
  }
}
