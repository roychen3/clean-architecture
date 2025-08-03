import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { RolePermissions, NoPermissionError } from '@ca/core';

import { RolePermissionsRepository } from '../../../repositories';
import { PermissionService } from '../../../services';

import {
  GetRolePermissionsUseCaseError,
  RolePermissionsNotFoundError,
} from './role-permissions.errors';
import {
  GetRolePermissionsUseCase,
  GetRolePermissionsRequestDTO,
} from './get-role-permissions.use-case';

describe('GetRolePermissionsUseCase', () => {
  let rolePermissionsRepository: Mocked<RolePermissionsRepository>;
  let permissionService: Mocked<PermissionService>;
  let useCase: GetRolePermissionsUseCase;
  let request: GetRolePermissionsRequestDTO;
  let executer: string;
  let rolePermissions: Mocked<RolePermissions>;

  beforeEach(() => {
    rolePermissionsRepository = {
      getRolePermissions: vi.fn(),
    } as unknown as Mocked<RolePermissionsRepository>;

    permissionService = {
      can: vi.fn(),
    } as unknown as Mocked<PermissionService>;

    useCase = new GetRolePermissionsUseCase({
      rolePermissionsRepository,
      permissionService,
    });

    request = { roleId: 'role-1' };

    executer = 'user-1';

    rolePermissions = {
      role: {},
      permissions: [],
    } as unknown as Mocked<RolePermissions>;
  });

  it('should successfully retrieve role permissions', async () => {
    permissionService.can.mockResolvedValue(true);
    rolePermissionsRepository.getRolePermissions.mockResolvedValue(
      rolePermissions,
    );

    const result = await useCase.execute(request, executer);
    expect(result).toEqual(rolePermissions);
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'read',
      'permissions',
    );
    expect(rolePermissionsRepository.getRolePermissions).toHaveBeenCalledWith(
      request.roleId,
    );
  });

  it('should throw NoPermissionError for unauthorized access', async () => {
    permissionService.can.mockResolvedValue(false);

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      NoPermissionError,
    );
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'read',
      'permissions',
    );
    expect(rolePermissionsRepository.getRolePermissions).not.toHaveBeenCalled();
  });

  it('should throw RolePermissionsNotFoundError for non-existent role', async () => {
    permissionService.can.mockResolvedValue(true);
    rolePermissionsRepository.getRolePermissions.mockResolvedValue(null);

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      RolePermissionsNotFoundError,
    );
    expect(rolePermissionsRepository.getRolePermissions).toHaveBeenCalledWith(
      request.roleId,
    );
  });

  it('should throw GetRolePermissionsUseCaseError on unexpected error', async () => {
    permissionService.can.mockRejectedValue(new Error('Unexpected error'));

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      GetRolePermissionsUseCaseError,
    );
  });
});
