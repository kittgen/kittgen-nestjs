import { NotFoundException } from '@nestjs/common';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';

@Catch()
export class AllExceptionFiler extends BaseExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    super.catch(this.mapException(exception), host);
  }

  private mapException(exception: Error): Error {
    if (exception instanceof EntityNotFoundError) {
      return new NotFoundException(exception.message);
    }
    return exception;
  }
}
