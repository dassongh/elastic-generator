import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { APIError } from 'openai/error';

@Catch(APIError)
export class OpenAIExceptionFilter implements ExceptionFilter {
  public catch(exception: APIError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    console.error({ exception });

    response.status(exception.status || 500).json({
      message: exception.message || 'Internal Server Error',
      error: exception.code || 'Internal Server Error',
      statusCode: exception.status || 500,
    });
  }
}
