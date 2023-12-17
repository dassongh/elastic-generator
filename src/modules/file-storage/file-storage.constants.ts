import { resolve } from 'node:path';

export enum Directory {
  AUDIO = 'audio',
}

export const ROOT_AUDIO_DIR = resolve(__dirname, '..', '..', '..', 'storage', 'audio');
