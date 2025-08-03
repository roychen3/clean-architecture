import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { Role, NoPermissionError } from '@ca/core';

import { PermissionService } from '../../../services';
import { RolesRepository } from '../../../repositories';

import { GetRoleUseCaseError, RoleNotFoundError } from './role.errors';
import { GetRoleUseCase, GetRoleRequestDTO } from './get-role.use-case';

describe('GetRoleUseCase', () => {
  let rolesRepository: Mocked<RolesRepository>;
  let permissionService: Mocked<PermissionService>;
  let useCase: GetRoleUseCase;
  let request: GetRoleRequestDTO;
  let executer: string;
  let role: Role;

  beforeEach(() => {
    rolesRepository = {
      findById: vi.fn(),
    } as unknown as Mocked<RolesRepository>;

    permissionService = {
      can: vi.fn(),
    } as unknown as Mocked<PermissionService>;

    useCase = new GetRoleUseCase({
      rolesRepository,
      permissionService,
    });

    request = { id: 'role-1' };

    executer = 'user-1';

    role = new Role({
      id: 'role-1',
      name: 'Admin',
    });
  });

  it('should return role when user has read permissions', async () => {
    permissionService.can.mockResolvedValue(true);
    rolesRepository.findById.mockResolvedValue(role);

    const result = await useCase.execute(request, executer);
    expect(result).toBe(role);
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'read',
      'roles',
    );
    expect(rolesRepository.findById).toHaveBeenCalledWith('role-1');
  });

  it('should throw NoPermissionError if user lacks read permissions', async () => {
    permissionService.can.mockResolvedValue(false);

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      NoPermissionError,
    );
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'read',
      'roles',
    );
    expect(rolesRepository.findById).not.toHaveBeenCalled();
  });

  it('should throw RoleNotFoundError if role does not exist', async () => {
    permissionService.can.mockResolvedValue(true);
    rolesRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      RoleNotFoundError,
    );
  });

  it('should throw GetRoleUseCaseError on unexpected error', async () => {
    permissionService.can.mockRejectedValue(new Error('Unexpected error'));

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      GetRoleUseCaseError,
    );
  });
});
