import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { NoPermissionError, Role, RolePermissions } from '@ca/core';

import {
  RolePermissionsRepository,
  UserSessionsRepository,
} from '../../../repositories';
import { PermissionService } from '../../../services';

import { SetUserRolesUseCaseError } from './role-permissions.errors';
import {
  SetUserRolesUseCase,
  SetUserRolesRequestDTO,
} from './set-user-roles.use-case';

describe('SetUserRolesUseCase', () => {
  let rolePermissionsRepository: Mocked<RolePermissionsRepository>;
  let userSessionsRepository: Mocked<UserSessionsRepository>;
  let permissionService: Mocked<PermissionService>;
  let useCase: SetUserRolesUseCase;
  let request: SetUserRolesRequestDTO;
  let executer: string;

  beforeEach(() => {
    rolePermissionsRepository = {
      setUserRoles: vi.fn(),
    } as unknown as Mocked<RolePermissionsRepository>;

    userSessionsRepository = {
      deleteByUser: vi.fn(),
    } as unknown as Mocked<UserSessionsRepository>;

    permissionService = {
      can: vi.fn(),
    } as unknown as Mocked<PermissionService>;

    useCase = new SetUserRolesUseCase({
      rolePermissionsRepository,
      userSessionsRepository,
      permissionService,
    });

    request = { userId: 'user-1', roleIds: ['role-1', 'role-2'] };

    executer = 'user-2';
  });

  it('should successfully set user roles', async () => {
    permissionService.can.mockResolvedValue(true);
    rolePermissionsRepository.setUserRoles.mockResolvedValue(undefined);
    userSessionsRepository.deleteByUser.mockResolvedValue(undefined);

    await expect(useCase.execute(request, executer)).resolves.toBeUndefined();
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'update',
      'permissions',
      expect.any(Object),
    );
    expect(rolePermissionsRepository.setUserRoles).toHaveBeenCalledWith(
      request.userId,
      request.roleIds,
    );
    expect(userSessionsRepository.deleteByUser).toHaveBeenCalledWith(
      request.userId,
    );
  });

  it('should throw NoPermissionError if permission denied', async () => {
    permissionService.can.mockResolvedValue(false);

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      NoPermissionError,
    );
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'update',
      'permissions',
      expect.any(Object),
    );
    expect(rolePermissionsRepository.setUserRoles).not.toHaveBeenCalled();
    expect(userSessionsRepository.deleteByUser).not.toHaveBeenCalled();
  });

  it('should throw NoPermissionError if target is super admin and not self', async () => {
    permissionService.can.mockImplementation(
      async (_executer, _action, _resource, options) => {
        if (options?.validator) {
          const result = await options.validator([], [
            {
              getIsSuperAdminRole: vi.fn(() => true),
            },
          ] as unknown as Role[]);
          return result;
        }

        throw new Error('Should provider validator');
      },
    );

    const request: SetUserRolesRequestDTO = {
      userId: executer,
      roleIds: ['not-super-admin-role'],
    };
    await expect(
      useCase.execute(request, 'other-user-id'),
    ).rejects.toMatchObject({
      message: 'Target user is Super Admin. You cannot change their roles.',
      name: 'NoPermissionError',
      errorCode: 'NO_PERMISSION',
    });
    expect(permissionService.can).toHaveBeenCalled();
  });

  it('should throw NoPermissionError if target is self and request is not super admin role', async () => {
    permissionService.can.mockImplementation(
      async (_executer, _action, _resource, options) => {
        if (options?.validator) {
          const result = await options.validator(
            [
              {
                role: {
                  getId: vi.fn(() => 'super-admin-role'),
                  getIsSuperAdminRole: vi.fn(() => true),
                },
                permissions: [],
              },
            ] as unknown as Mocked<RolePermissions[]>,
            null,
          );
          return result;
        }

        throw new Error('Should provider validator');
      },
    );

    await expect(
      useCase.execute(request, request.userId),
    ).rejects.toMatchObject({
      message: 'Super Admin must retain `super-admin` role.',
      name: 'NoPermissionError',
      errorCode: 'NO_PERMISSION',
    });
    expect(permissionService.can).toHaveBeenCalled();
  });

  it('should pass permission check for target user not have any roles', async () => {
    permissionService.can.mockImplementation(
      async (_executer, _action, _resource, options) => {
        if (options?.validator) {
          const result = await options.validator([], []);
          return result;
        }

        throw new Error('Should provider validator');
      },
    );
    rolePermissionsRepository.setUserRoles.mockRejectedValue(
      new Error('Skipped after processing'),
    );

    await expect(useCase.execute(request, executer)).rejects.toMatchObject({
      cause: {
        message: 'Skipped after processing',
      },
    });
    expect(permissionService.can).toHaveBeenCalled();
  });

  it('should throw SetUserRolesUseCaseError on unexpected error', async () => {
    permissionService.can.mockRejectedValue(new Error('Unexpected error'));

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      SetUserRolesUseCaseError,
    );
  });
});
