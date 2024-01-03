import { Module } from '@nestjs/common';

import { AudioController } from './audio.controller';
import { AudioService } from './audio.service';

import { FileStorageModule } from '../file-storage/file-storage.module';
import { OpenAIModule } from '../openai/openai.module';
import { UserModule } from '../user/user.module';
import { AudioRepository } from './audio.repository';

@Module({
  imports: [UserModule, FileStorageModule, OpenAIModule],
  controllers: [AudioController],
  providers: [AudioService, AudioRepository],
})
export class AudioModule {}
