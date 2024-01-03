import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { Audio } from './modules/audio/audio.entity';
import { Chat } from './modules/chat/chat.entity';
import { Message } from './modules/chat/message/message.entity';
import { Image } from './modules/image/image.entity';
import { User } from './modules/user/user.entity';

import { AudioModule } from './modules/audio/audio.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChatModule } from './modules/chat/chat.module';
import { FileStorageModule } from './modules/file-storage/file-storage.module';
import { ImageModule } from './modules/image/image.module';
import { OpenAIModule } from './modules/openai/openai.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService): Promise<TypeOrmModuleOptions> => ({
        type: 'postgres',
        host: config.get<string>('POSTGRES_HOST'),
        port: config.get<number>('POSTGRES_PORT'),
        username: config.get<string>('POSTGRES_USER'),
        password: config.get<string>('POSTGRES_PASSWORD'),
        database: config.get<string>('POSTGRES_DB'),
        entities: [User, Audio, Image, Chat, Message],
        synchronize: true,
      }),
    }),
    AuthModule,
    UserModule,
    OpenAIModule,
    AudioModule,
    FileStorageModule,
    ImageModule,
    ChatModule,
  ],
})
export class AppModule {}
