import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { EntityNotFoundError, QueryFailedError, TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  private static DUPLICATE_UNIQUE_KEY_ERROR = 23505;
  private static FOREIGN_KEY_CONSTRAINT_ERROR = 23503;
  private static RELATION_KEY_NOT_EXIST = 23502;

  public catch(exception: QueryFailedError | EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof EntityNotFoundError) {
      return response.status(404).json(this.getResponse('Entity not found', 'Not Found', 404));
    }

    const code = exception.driverError.code;
    const exceptionEntityOptions = {
      [DatabaseExceptionFilter.DUPLICATE_UNIQUE_KEY_ERROR]: this.getResponse('Duplicate unique key', 'Conflict', 409),
      [DatabaseExceptionFilter.FOREIGN_KEY_CONSTRAINT_ERROR]: this.getResponse(
        'Foreign key constraint',
        'Unprocessable Entity',
        422
      ),
      [DatabaseExceptionFilter.RELATION_KEY_NOT_EXIST]: this.getResponse(
        'Relation key not exist',
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
