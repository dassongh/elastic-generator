import fs from 'node:fs/promises';

import { Injectable } from '@nestjs/common';

import { ROOT_AUDIO_DIR } from './file-storage.constants';

@Injectable()
export class FileStorageService {
  public save(buffer: Buffer, fileName: string) {
    return fs.writeFile(`${ROOT_AUDIO_DIR}/${fileName}`, buffer);
  }

  public get(fileName: string): Promise<Buffer> {
    return fs.readFile(`${ROOT_AUDIO_DIR}/${fileName}`);
  }

  public async delete(fileName: string): Promise<void> {
    const path = `${ROOT_AUDIO_DIR}/${fileName}`;
    try {
      await fs.stat(path);
    } catch (error: any) {
      if (error.code === 'ENOENT') return;
    }

    return fs.unlink(path);
  }
}
