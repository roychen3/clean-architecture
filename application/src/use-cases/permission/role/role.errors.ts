import { NotFoundError, BaseError } from '@ca/core';

export class CreateRoleUseCaseError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'CreateRoleUseCaseError',
      errorCode: 'CREATE_ROLE_USE_CASE_ERROR',
      message: 'Failed to execute the create role use case.',
      cause,
    });
  }
}

export class GetRoleUseCaseError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'GetRoleUseCaseError',
      errorCode: 'GET_ROLE_USE_CASE_ERROR',
      message: 'Failed to execute the get role use case.',
      cause,
    });
  }
}

export class GetAllRolesUseCaseError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'GetAllRolesUseCaseError',
      errorCode: 'GET_ALL_ROLES_USE_CASE_ERROR',
      message: 'Failed to execute the get all roles use case.',
      cause,
    });
  }
}

export class UpdateRoleUseCaseError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'UpdateRoleUseCaseError',
      errorCode: 'UPDATE_ROLE_USE_CASE_ERROR',
      message: 'Failed to execute the update role use case.',
      cause,
    });
  }
}

export class DeleteRoleUseCaseError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'DeleteRoleUseCaseError',
      errorCode: 'DELETE_ROLE_USE_CASE_ERROR',
      message: 'Failed to execute the delete role use case.',
      cause,
    });
  }
}

export class RoleNotFoundError extends NotFoundError {
  constructor(roleId: string, cause?: Error) {
    super({
      message: `Role with ID ${roleId} not found`,
      cause,
    });
  }
}

export class CannotDeleteSuperAdminRoleError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'CannotDeleteSuperAdminRoleError',
      errorCode: 'CANNOT_DELETE_SUPER_ADMIN_ROLE_ERROR',
      message: 'Cannot delete Super Admin role',
      cause,
    });
  }
}

export class InvalidSuperAdminPriorityError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'InvalidSuperAdminPriorityError',
      errorCode: 'INVALID_SUPER_ADMIN_PRIORITY_ERROR',
      message:
        'Super Admin role must have the highest privilege with priority 1',
      cause,
    });
  }
}
