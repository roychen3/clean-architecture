export class BaseError extends Error {
  readonly name: string;
  readonly errorCode: string;
  readonly cause: Error | undefined;

  constructor(options: {
    name: string;
    errorCode: string;
    message: string;
    cause?: Error;
  }) {
    super(options.message);
    this.name = options.name;
    this.errorCode = options.errorCode;
    this.cause = options.cause;
  }
}

export class NotFoundError extends BaseError {
  constructor(options: { message?: string; cause?: Error } = {}) {
    super({
      name: 'NotFoundError',
      errorCode: 'NOT_FOUND',
      message: options.message ?? 'Resource not found',
      cause: options.cause,
    });
  }
}

export class NoPermissionError extends BaseError {
  constructor(options: { message?: string; cause?: Error } = {}) {
    super({
      name: 'NoPermissionError',
      errorCode: 'NO_PERMISSION',
      message: options.message ?? 'No permission',
      cause: options.cause,
    });
  }
}

export class ValidationError extends BaseError {
  constructor(options: { message?: string; cause?: Error } = {}) {
    super({
      name: 'ValidationError',
      errorCode: 'VALIDATION_ERROR',
      message: options.message ?? 'Validation failed',
      cause: options.cause,
    });
  }
}

export class ConflictError extends BaseError {
  constructor(options: { message?: string; cause?: Error } = {}) {
    super({
      name: 'ConflictError',
      errorCode: 'CONFLICT',
      message: options.message ?? 'Resource conflict',
      cause: options.cause,
    });
  }
}

export class AuthenticationError extends BaseError {
  constructor(options: { message?: string; cause?: Error } = {}) {
    super({
      name: 'AuthenticationError',
      errorCode: 'AUTHENTICATION_ERROR',
      message: options.message ?? 'Authentication failed',
      cause: options.cause,
    });
  }
}

export class UnauthorizedError extends BaseError {
  constructor(options: { message?: string; cause?: Error } = {}) {
    super({
      name: 'UnauthorizedError',
      errorCode: 'UNAUTHORIZED',
      message: options.message ?? 'Unauthorized',
      cause: options.cause,
    });
  }
}

export class TokenExpiredError extends BaseError {
  constructor(options: { message?: string; cause?: Error } = {}) {
    super({
      name: 'TokenExpiredError',
      errorCode: 'TOKEN_EXPIRED',
      message: options.message ?? 'Token has expired',
      cause: options.cause,
    });
  }
}

export class InternalServerError extends BaseError {
  constructor(options: { message?: string; cause?: Error } = {}) {
    super({
      name: 'InternalServerError',
      errorCode: 'INTERNAL_SERVER_ERROR',
      message: options.message ?? 'Internal server error',
      cause: options.cause,
    });
  }
}

export class BadRequestError extends BaseError {
  constructor(options: { message?: string; cause?: Error } = {}) {
    super({
      name: 'BadRequestError',
      errorCode: 'BAD_REQUEST',
      message: options.message ?? 'Bad request',
      cause: options.cause,
    });
  }
}
