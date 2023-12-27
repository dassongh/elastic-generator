import fs from 'node:fs/promises';

import { Injectable } from '@nestjs/common';

import { ROOT_AUDIO_DIR } from './file-storage.constants';

@Injectable()
export class FileStorageService {
  public saveAudio(buffer: Buffer, fileName: string) {
    return this.save(`${ROOT_AUDIO_DIR}/${fileName}`, buffer);
  }

  public getAudio(fileName: string): Promise<Buffer> {
    return this.read(`${ROOT_AUDIO_DIR}/${fileName}`);
  }

  public async deleteAudio(fileName: string): Promise<void> {
    return this.delete(`${ROOT_AUDIO_DIR}/${fileName}`);
  }

  private save(path: string, buffer: Buffer) {
    return fs.writeFile(path, buffer);
  }

  private read(path: string): Promise<Buffer> {
    return fs.readFile(path);
  }

  private async delete(path: string): Promise<void> {
    try {
      await fs.stat(path);
    } catch (error: any) {
      if (error.code === 'ENOENT') return;
    }

    return fs.unlink(path);
  }
}
