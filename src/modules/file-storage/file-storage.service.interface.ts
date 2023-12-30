export interface IFileStorageService {
  save(buffer: Buffer, rootDir: string, fileName: string): Promise<void>;
  get(rootDir: string, fileName: string): Promise<Buffer>;
  delete(rootDir: string, fileName: string): Promise<void>;
}
