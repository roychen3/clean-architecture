import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { NoPermissionError, RolePermissions, User } from '@ca/core';

import {
  RolePermissionsRepository,
  UserSessionsRepository,
} from '../../../repositories';
import { PermissionService } from '../../../services';

import { SetRolePermissionsUseCaseError } from './role-permissions.errors';
import {
  SetRolePermissionUseCase,
  SetRolePermissionRequestDTO,
} from './set-role-permissions.use-case';

describe('SetRolePermissionUseCase', () => {
  let rolePermissionsRepository: Mocked<RolePermissionsRepository>;
  let userSessionsRepository: Mocked<UserSessionsRepository>;
  let permissionService: Mocked<PermissionService>;
  let useCase: SetRolePermissionUseCase;
  let request: SetRolePermissionRequestDTO;
  let executer: string;
  let users: User[];

  beforeEach(() => {
    rolePermissionsRepository = {
      setRolePermissions: vi.fn(),
      getUsersByRole: vi.fn(),
    } as unknown as Mocked<RolePermissionsRepository>;

    userSessionsRepository = {
      deleteByUser: vi.fn(),
    } as unknown as Mocked<UserSessionsRepository>;

    permissionService = {
      can: vi.fn(),
    } as unknown as Mocked<PermissionService>;

    useCase = new SetRolePermissionUseCase({
      rolePermissionsRepository,
      userSessionsRepository,
      permissionService,
    });

    request = {
      roleId: 'role-1',
      permissions: [{ resourceId: 'resource-1', actionIds: ['read', 'write'] }],
    };

    executer = 'executer-id';

    users = [
      new User({
        id: 'user-1',
        name: 'User One',
        email: 'user1@example.com',
        password: 'password1',
      }),
      new User({
        id: 'user-2',
        name: 'User Two',
        email: 'user2@example.com',
        password: 'password2',
      }),
    ];
  });

  it('should successfully set role permissions', async () => {
    permissionService.can.mockResolvedValue(true);
    rolePermissionsRepository.setRolePermissions.mockResolvedValue(undefined);
    rolePermissionsRepository.getUsersByRole.mockResolvedValue(users);
    userSessionsRepository.deleteByUser.mockResolvedValue(undefined);

    await expect(useCase.execute(request, executer)).resolves.toBeUndefined();
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'update',
      'permissions',
      expect.any(Object),
    );
    expect(rolePermissionsRepository.setRolePermissions).toHaveBeenCalledWith(
      request,
    );
    expect(rolePermissionsRepository.getUsersByRole).toHaveBeenCalledWith(
      request.roleId,
    );
    expect(userSessionsRepository.deleteByUser).toHaveBeenCalledTimes(2);
    expect(userSessionsRepository.deleteByUser).toHaveBeenCalledWith('user-1');
    expect(userSessionsRepository.deleteByUser).toHaveBeenCalledWith('user-2');
  });

  it('should throw NoPermissionError for unauthorized access', async () => {
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
    expect(rolePermissionsRepository.setRolePermissions).not.toHaveBeenCalled();
    expect(rolePermissionsRepository.getUsersByRole).not.toHaveBeenCalled();
    expect(userSessionsRepository.deleteByUser).not.toHaveBeenCalled();
  });

  it('should throw NoPermissionError with message for super admin restriction', async () => {
    permissionService.can.mockImplementation(
      async (_executer, _action, _resource, options) => {
        if (options?.validator) {
          const result = options.validator(
            [
              {
                role: {
                  getId: vi.fn().mockReturnValue(request.roleId),
                  getIsSuperAdminRole: vi.fn().mockReturnValue(true),
                },
                permissions: [],
              },
            ] as unknown as RolePermissions[],
            null,
          );
          return result;
        }
        throw new Error('Should provide a validator');
      },
    );

    await expect(useCase.execute(request, executer)).rejects.toMatchObject({
      name: 'NoPermissionError',
      message: 'Super Admin must retain all permissions.',
    });
  });

  it('should throw SetRolePermissionsUseCaseError on unexpected error', async () => {
    permissionService.can.mockRejectedValue(new Error('Unexpected error'));

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      SetRolePermissionsUseCaseError,
    );
  });
});
