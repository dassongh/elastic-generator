import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseExceptionFilter } from './common/filter/database-exception.filter';
import { OpenAIExceptionFilter } from './common/filter/openai-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/v1');
  app.useGlobalFilters(new DatabaseExceptionFilter());
  app.useGlobalFilters(new OpenAIExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(4000);
}

bootstrap();
