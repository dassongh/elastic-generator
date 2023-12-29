import OpenAI from 'openai';

import { Injectable } from '@nestjs/common';
import { Voice } from './openai.constants';

@Injectable()
export class OpenAIService {
  public async generateAudioFromText(apiKey: string, { text, voice }: { text: string; voice: Voice }): Promise<Buffer> {
    const openAi = new OpenAI({ apiKey });

    const mp3file = await openAi.audio.speech.create({
      model: 'tts-1',
      voice,
      input: text,
      response_format: 'mp3',
    });

    const buffer = Buffer.from(await mp3file.arrayBuffer());
    return buffer;
  }

  public async generateImage(apiKey: string, prompt: string): Promise<OpenAI.Images.ImagesResponse> {
    const openAi = new OpenAI({ apiKey });

    return openAi.images.generate({
      prompt,
      response_format: 'url',
      size: '512x512',
      model: 'dall-e-2',
    });
  }
}
