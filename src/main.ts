import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DatabaseExceptionFilter, OpenAIExceptionFilter } from './common/filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api/v1');
  app.useGlobalFilters(new DatabaseExceptionFilter());
  app.useGlobalFilters(new OpenAIExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  await app.listen(4000);
}

bootstrap();
