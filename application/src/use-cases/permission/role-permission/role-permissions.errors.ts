import { BaseError, NotFoundError } from '@ca/core';

export class GetRolePermissionsUseCaseError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'GetRolePermissionsUseCaseError',
      errorCode: 'GET_ROLE_PERMISSIONS_USE_CASE_ERROR',
      message: 'Failed to execute the get role permissions use case.',
      cause,
    });
  }
}

export class SetRolePermissionsUseCaseError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'SetRolePermissionUseCaseError',
      errorCode: 'SET_ROLE_PERMISSION_USE_CASE_ERROR',
      message: 'Failed to execute the set role permissions use case.',
      cause,
    });
  }
}

export class SetUserRolesUseCaseError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'SetUserRolesUseCaseError',
      errorCode: 'SET_USER_ROLES_USE_CASE_ERROR',
      message: 'Failed to execute the set user roles use case.',
      cause,
    });
  }
}

export class GetUserRolesUseCaseError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'GetUserRolesUseCaseError',
      errorCode: 'GET_USER_ROLES_USE_CASE_ERROR',
      message: 'Failed to execute the get user roles use case.',
      cause,
    });
  }
}
export class RolePermissionsNotFoundError extends NotFoundError {
  constructor(roleId: string) {
    super({
      message: `Role permission with ID ${roleId} not found.`,
    });
  }
}
