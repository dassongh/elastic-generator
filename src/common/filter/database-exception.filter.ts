import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { EntityNotFoundError, QueryFailedError, TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  private static NOT_NULL_VIOLATION = 23502;
  private static FOREIGN_KEY_VIOLATION = 23503;
  private static UNIQUE_VIOLATION = 23505;

  public catch(exception: QueryFailedError | EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof EntityNotFoundError) {
      return response.status(404).json(this.getResponse('Entity not found', 'Not Found', 404));
    }
    console.error(exception);
    const code = exception.driverError.code;
    const exceptionEntityOptions = {
      [DatabaseExceptionFilter.UNIQUE_VIOLATION]: this.getResponse('Duplicate unique key', 'Conflict', 409),
      [DatabaseExceptionFilter.FOREIGN_KEY_VIOLATION]: this.getResponse(
        'Foreign key not exist',
        'Unprocessable Entity',
        422
      ),
      [DatabaseExceptionFilter.NOT_NULL_VIOLATION]: this.getResponse(
        'Column cannot be null',
        'Unprocessable Entity',
        422
      ),
      default: this.getResponse('Internal Server Error', 'Internal Server Error', 500),
    };

    const exceptionEntity = exceptionEntityOptions[code] || exceptionEntityOptions.default;
    if (exceptionEntity.statusCode === 500) console.error(exception.message);

    response.status(exceptionEntity.statusCode).json(exceptionEntity);
  }

  private getResponse(message: string, error: string, statusCode: number) {
    return {
      message,
      error,
      statusCode,
    };
  }
}
