import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

import { AppModule } from './app.module';
import { DatabaseExceptionFilter, OpenAIExceptionFilter } from './common/filter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter({ logger: true }));

  app.setGlobalPrefix('/api/v1');
  app.useGlobalFilters(new DatabaseExceptionFilter());
  app.useGlobalFilters(new OpenAIExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(4000);
}

bootstrap();
