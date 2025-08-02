import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import {
  UnauthorizedError,
  NoPermissionError,
  NotFoundError,
  BaseError,
  TokenExpiredError,
} from '@ca/core';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  logger = new Logger('ErrorFilter');
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost) {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    this.logger.error(exception);
    if (exception instanceof BaseError) {
      this.logger.error(exception.cause);
    }

    if (
      exception instanceof UnauthorizedError ||
      exception instanceof TokenExpiredError
    ) {
      httpAdapter.reply(
        ctx.getResponse(),
        {
          error: {
            errorCode: exception.errorCode,
            message: exception.message,
          },
        },
        HttpStatus.UNAUTHORIZED,
      );
      return;
    }

    if (exception instanceof NoPermissionError) {
      httpAdapter.reply(
        ctx.getResponse(),
        {
          error: {
            errorCode: exception.errorCode,
            message: exception.message,
          },
        },
        HttpStatus.FORBIDDEN,
      );
      return;
    }

    if (exception instanceof NotFoundError) {
      httpAdapter.reply(
        ctx.getResponse(),
        {
          error: {
            errorCode: exception.errorCode,
            message: exception.message,
          },
        },
        HttpStatus.NOT_FOUND,
      );
      return;
    }

    if (exception instanceof BaseError) {
      httpAdapter.reply(
        ctx.getResponse(),
        {
          error: {
            errorCode: exception.errorCode,
            message: exception.message,
          },
        },
        HttpStatus.BAD_REQUEST,
      );
      return;
    }

    if (exception instanceof HttpException) {
      httpAdapter.reply(
        ctx.getResponse(),
        {
          error: {
            errorCode: 'UNKNOWN_ERROR',
            message: exception.message,
          },
        },
        exception.getStatus(),
      );
      return;
    }

    httpAdapter.reply(
      ctx.getResponse(),
      {
        error: {
          errorCode: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred',
        },
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
