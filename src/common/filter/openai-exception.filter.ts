import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { APIError } from 'openai/error';

@Catch(APIError)
export class OpenAIExceptionFilter implements ExceptionFilter {
  public catch(exception: APIError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<FastifyReply>();

    console.error({ exception });

    response.code(exception.status || 500).send({
      message: exception.message || 'Internal Server Error',
      error: exception.code || 'Internal Server Error',
      statusCode: exception.status || 500,
    });
  }
}
