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

    const arrayBuffer = await mp3file.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  public async generateImage(apiKey: string, prompt: string): Promise<Buffer> {
    const openAi = new OpenAI({ apiKey });

    const image = await openAi.images.generate({
      prompt,
      response_format: 'b64_json',
      size: '512x512',
      model: 'dall-e-2',
    });

    return Buffer.from(image.data[0].b64_json, 'base64');
  }

  public async generateText(
    apiKey: string,
    chatMessages: OpenAI.Chat.ChatCompletionMessageParam[],
    userMessage: OpenAI.Chat.ChatCompletionUserMessageParam
  ): Promise<OpenAI.Chat.ChatCompletion> {
    const openAi = new OpenAI({ apiKey });

    return openAi.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [...chatMessages, userMessage],
    });
  }
}
