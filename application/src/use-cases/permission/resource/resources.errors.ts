import { BaseError } from '@ca/core';

export class GetAllPermissionResourcesUseCaseError extends BaseError {
  constructor(error?: Error) {
    super({
      name: 'GetAllPermissionResourcesUseCaseError',
      errorCode: 'GET_ALL_PERMISSION_RESOURCES_USE_CASE_ERROR',
      message: 'Failed to execute the get all permission resources use case.',
      cause: error,
    });
  }
}
