import fs from 'node:fs/promises';

import { Injectable } from '@nestjs/common';

@Injectable()
export class FileStorageService {
  public save(buffer: Buffer, rootDir: string, fileName: string) {
    return fs.writeFile(`${rootDir}/${fileName}`, buffer);
  }

  public get(rootDir: string, fileName: string): Promise<Buffer> {
    return fs.readFile(`${rootDir}/${fileName}`);
  }

  public async delete(rootDir: string, fileName: string): Promise<void> {
    const path = `${rootDir}/${fileName}`;
    try {
      await fs.stat(path);
    } catch (error: any) {
      if (error.code === 'ENOENT') return;
    }

    return fs.unlink(path);
  }
}
