import { BaseError } from '@ca/core';

export class CreateUserUseCaseError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'CreateUserUseCaseError',
      errorCode: 'CREATE_USER_USE_CASE_ERROR',
      message: 'Failed to execute the create user use case.',
      cause,
    });
  }
}

export class GetUsersUseCaseError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'GetUsersUseCaseError',
      errorCode: 'GET_USERS_USE_CASE_ERROR',
      message: 'Failed to execute the get users use case.',
      cause,
    });
  }
}

export class GetUserUseCaseError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'GetUserUseCaseError',
      errorCode: 'GET_USER_USE_CASE_ERROR',
      message: 'Failed to execute the get user use case.',
      cause,
    });
  }
}

export class UpdateUserUseCaseError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'UpdateUserUseCaseError',
      errorCode: 'UPDATE_USER_USE_CASE_ERROR',
      message: 'Failed to execute the update user use case.',
      cause,
    });
  }
}

export class DeleteUserUseCaseError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'DeleteUserUseCaseError',
      errorCode: 'DELETE_USER_USE_CASE_ERROR',
      message: 'Failed to execute the delete user use case.',
      cause,
    });
  }
}

export class UserAlreadyExistsError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'UserAlreadyExistsError',
      errorCode: 'USER_ALREADY_EXISTS_ERROR',
      message: 'User already exists',
      cause,
    });
  }
}

export class UserNotFoundError extends BaseError {
  readonly userId?: string;

  constructor(userId?: string, cause?: Error) {
    super({
      name: 'UserNotFoundError',
      errorCode: 'USER_NOT_FOUND_ERROR',
      message: userId ? `User not found: ${userId}` : 'User not found',
      cause,
    });
    this.userId = userId;
  }
}

export class InvalidUserDataError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'InvalidUserDataError',
      errorCode: 'INVALID_USER_DATA_ERROR',
      message: 'Invalid user data',
      cause,
    });
  }
}

export class GetUsersFailedError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'GetUsersFailedError',
      errorCode: 'GET_USERS_FAILED_ERROR',
      message: 'Failed to get users',
      cause,
    });
  }
}
