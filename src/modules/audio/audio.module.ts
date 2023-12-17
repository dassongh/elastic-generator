import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AudioController } from './audio.controller';
import { AudioService } from './audio.service';

import { FileStorageService } from '../file-storage/file-storage.service';
import { OpenAIService } from '../openai/openai.service';
import { AudioLink } from './audio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AudioLink])],
  controllers: [AudioController],
  providers: [AudioService, FileStorageService, OpenAIService],
})
export class AudioModule {}
