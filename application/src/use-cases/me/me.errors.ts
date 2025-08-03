import { NotFoundError, BaseError } from '@ca/core';

export class GetMeProfileUseCaseError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'GetMeProfileUseCaseError',
      errorCode: 'GET_ME_PROFILE_USE_CASE_ERROR',
      message: 'Failed to execute the get me profile use case.',
      cause,
    });
  }
}

export class UpdateMeProfileUseCaseError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'UpdateMeProfileUseCaseError',
      errorCode: 'UPDATE_ME_PROFILE_USE_CASE_ERROR',
      message: 'Failed to execute the update me profile use case.',
      cause,
    });
  }
}

export class ChangeMePasswordUseCaseError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'ChangeMePasswordUseCaseError',
      errorCode: 'CHANGE_ME_PASSWORD_USE_CASE_ERROR',
      message: 'Failed to execute the change me password use case.',
      cause,
    });
  }
}

export class DeleteMeUseCaseError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'DeleteMeUseCaseError',
      errorCode: 'DELETE_ME_USE_CASE_ERROR',
      message: 'Failed to execute the delete me use case.',
      cause,
    });
  }
}

export class MeUserNotFoundError extends NotFoundError {
  constructor(cause?: Error) {
    super({
      message: 'User not found.',
      cause,
    });
  }
}

export class MeUserPasswordInvalidError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'MeUserPasswordInvalidError',
      errorCode: 'ME_USER_PASSWORD_INVALID_ERROR',
      message: 'User password is invalid.',
      cause,
    });
  }
}
