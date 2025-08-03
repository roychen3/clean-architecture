import { BaseError } from '@ca/core';

export class GetAllPermissionActionsUseCaseError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'GetAllPermissionActionsUseCaseError',
      errorCode: 'GET_ALL_PERMISSION_ACTIONS_USE_CASE_ERROR',
      message: 'Failed to execute the get all permission actions use case.',
      cause,
    });
  }
}
