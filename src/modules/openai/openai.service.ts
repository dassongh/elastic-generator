import OpenAI from 'openai';

import { Injectable } from '@nestjs/common';

@Injectable()
export class OpenAIService {
  public async generateAudioFromText(apiKey: string, text: string): Promise<Buffer> {
    const openAi = new OpenAI({ apiKey });

    const mp3file = await openAi.audio.speech.create({
      model: 'tts-1',
      voice: 'alloy',
      input: text,
      response_format: 'mp3',
    });

    const buffer = Buffer.from(await mp3file.arrayBuffer());
    return buffer;
  }
}
