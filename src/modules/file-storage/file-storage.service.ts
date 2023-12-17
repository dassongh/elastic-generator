import fs from 'node:fs/promises';

import { Injectable } from '@nestjs/common';

import { ROOT_AUDIO_DIR } from './file-storage.constants';

@Injectable()
export class FileStorageService {
  public saveAudioFile(buffer: Buffer, fileName: string) {
    return fs.writeFile(`${ROOT_AUDIO_DIR}/${fileName}`, buffer);
  }
}
