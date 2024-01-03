import { Module } from '@nestjs/common';

import { ImageController } from './image.controller';
import { ImageService } from './image.service';

import { FileStorageModule } from '../file-storage/file-storage.module';
import { OpenAIModule } from '../openai/openai.module';
import { UserModule } from '../user/user.module';
import { ImageRepository } from './image.repository';

@Module({
  imports: [UserModule, OpenAIModule, FileStorageModule],
  providers: [ImageService, ImageRepository],
  controllers: [ImageController],
})
export class ImageModule {}
