import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { Role, NoPermissionError } from '@ca/core';

import { PermissionService } from '../../../services';
import { RolesRepository } from '../../../repositories';

import { GetAllRolesUseCase } from './get-all-roles.use-case';
import { GetAllRolesUseCaseError } from './role.errors';

describe('GetAllRolesUseCase', () => {
  let rolesRepository: Mocked<RolesRepository>;
  let permissionService: Mocked<PermissionService>;
  let useCase: GetAllRolesUseCase;
  let executer: string;
  let roles: Role[];

  beforeEach(() => {
    rolesRepository = {
      findAll: vi.fn(),
    } as unknown as Mocked<RolesRepository>;

    permissionService = {
      can: vi.fn(),
    } as unknown as Mocked<PermissionService>;

    useCase = new GetAllRolesUseCase({
      rolesRepository,
      permissionService,
    });

    executer = 'user-1';

    roles = [
      new Role({ id: '1', name: 'admin' }),
      new Role({ id: '2', name: 'user' }),
    ];
  });

  it('should return all roles when user has read permissions', async () => {
    permissionService.can.mockResolvedValue(true);
    rolesRepository.findAll.mockResolvedValue(roles);

    const result = await useCase.execute(executer);
    expect(result).toEqual(roles);
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'read',
      'roles',
    );
    expect(rolesRepository.findAll).toHaveBeenCalled();
  });

  it('should throw NoPermissionError if user lacks read permissions', async () => {
    permissionService.can.mockResolvedValue(false);

    await expect(useCase.execute(executer)).rejects.toBeInstanceOf(
      NoPermissionError,
    );
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'read',
      'roles',
    );
    expect(rolesRepository.findAll).not.toHaveBeenCalled();
  });

  it('should throw GetAllRolesUseCaseError on unexpected error', async () => {
    permissionService.can.mockRejectedValue(new Error('Unexpected error'));

    await expect(useCase.execute(executer)).rejects.toBeInstanceOf(
      GetAllRolesUseCaseError,
    );
  });
});
