import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AudioController } from './audio.controller';
import { AudioService } from './audio.service';

import { FileStorageModule } from '../file-storage/file-storage.module';
import { OpenAIModule } from '../openai/openai.module';
import { User } from '../user/user.entity';
import { AudioLink } from './audio.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AudioLink, User]), FileStorageModule, OpenAIModule],
  controllers: [AudioController],
  providers: [AudioService],
})
export class AudioModule {}
