import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { Role, NoPermissionError } from '@ca/core';

import { RolePermissionsRepository } from '../../../repositories';
import { PermissionService } from '../../../services';

import { GetUserRolesUseCaseError } from './role-permissions.errors';
import {
  GetUserRolesUseCase,
  GetUserRolesRequestDTO,
} from './get-user-roles.use-case';

describe('GetUserRolesUseCase', () => {
  let rolePermissionsRepository: Mocked<RolePermissionsRepository>;
  let permissionService: Mocked<PermissionService>;
  let useCase: GetUserRolesUseCase;
  let request: GetUserRolesRequestDTO;
  let executer: string;
  let roles: Role[];

  beforeEach(() => {
    rolePermissionsRepository = {
      getUserRoles: vi.fn(),
    } as unknown as Mocked<RolePermissionsRepository>;

    permissionService = {
      can: vi.fn(),
    } as unknown as Mocked<PermissionService>;

    useCase = new GetUserRolesUseCase({
      rolePermissionsRepository,
      permissionService,
    });

    request = { userId: 'user-1' };

    executer = 'user-1';

    roles = [
      new Role({ id: 'role-1', name: 'Admin' }),
      new Role({ id: 'role-2', name: 'User' }),
    ];
  });

  it('should successfully retrieve user roles', async () => {
    permissionService.can.mockResolvedValue(true);
    rolePermissionsRepository.getUserRoles.mockResolvedValue(roles);

    const result = await useCase.execute(request, executer);
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'read',
      'permissions',
    );
    expect(rolePermissionsRepository.getUserRoles).toHaveBeenCalledWith(
      request.userId,
    );
    expect(result).toEqual(roles);
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
    expect(rolePermissionsRepository.getUserRoles).not.toHaveBeenCalled();
  });

  it('should throw GetUserRolesUseCaseError on unexpected error', async () => {
    permissionService.can.mockRejectedValue(new Error('Unexpected error'));

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      GetUserRolesUseCaseError,
    );
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'read',
      'permissions',
    );
    expect(rolePermissionsRepository.getUserRoles).not.toHaveBeenCalled();
  });
});
