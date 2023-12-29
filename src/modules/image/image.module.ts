import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ImageController } from './image.controller';
import { Image } from './image.entity';
import { ImageService } from './image.service';

import { OpenAIModule } from '../openai/openai.module';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Image, User]), OpenAIModule],
  providers: [ImageService],
  controllers: [ImageController],
})
export class ImageModule {}
