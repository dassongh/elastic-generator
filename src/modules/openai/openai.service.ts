import fs from 'node:fs';

import OpenAI from 'openai';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OpenAIService {
  private openai: OpenAI;

  constructor(config: ConfigService) {
    this.openai = new OpenAI({
      apiKey: config.get<string>('OPENAI_KEY'),
    });
  }

  public async generateAudioFromText(pathToFile: string, text: string): Promise<void> {
    const mp3file = await this.openai.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: text,
    });

    const buffer = Buffer.from(await mp3file.arrayBuffer());
    return fs.promises.writeFile(pathToFile, buffer);
  }
}
