import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { PermissionResource, NoPermissionError } from '@ca/core';

import { PermissionService } from '../../../services';
import { PermissionResourcesRepository } from '../../../repositories';

import { GetAllPermissionResourcesUseCaseError } from './resources.errors';
import { GetAllPermissionResourcesUseCase } from './get-all-permission-resources.use-case';

describe('GetAllPermissionResourcesUseCase', () => {
  let permissionResourcesRepository: Mocked<PermissionResourcesRepository>;
  let permissionService: Mocked<PermissionService>;
  let useCase: GetAllPermissionResourcesUseCase;
  let executer: string;
  let resources: PermissionResource[];

  beforeEach(() => {
    permissionResourcesRepository = {
      findAll: vi.fn(),
    } as unknown as Mocked<PermissionResourcesRepository>;

    permissionService = {
      can: vi.fn(),
    } as unknown as Mocked<PermissionService>;

    useCase = new GetAllPermissionResourcesUseCase({
      permissionResourcesRepository,
      permissionService,
    });

    executer = 'user-1';

    resources = [
      new PermissionResource({ id: '1', name: 'me' }),
      new PermissionResource({ id: '2', name: 'articles' }),
    ];
  });

  it('should return all permission resources for a user with read permissions', async () => {
    permissionService.can.mockResolvedValue(true);
    permissionResourcesRepository.findAll.mockResolvedValue(resources);

    const result = await useCase.execute(executer);
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'read',
      'permissions',
    );
    expect(permissionResourcesRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(resources);
  });

  it('should throw NoPermissionError if user lacks read permissions', async () => {
    permissionService.can.mockResolvedValue(false);

    await expect(useCase.execute(executer)).rejects.toBeInstanceOf(
      NoPermissionError,
    );
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'read',
      'permissions',
    );
    expect(permissionResourcesRepository.findAll).not.toHaveBeenCalled();
  });

  it('should throw GetAllPermissionResourcesUseCaseError on unexpected error', async () => {
    permissionService.can.mockRejectedValue(new Error('Unexpected error'));

    await expect(useCase.execute(executer)).rejects.toBeInstanceOf(
      GetAllPermissionResourcesUseCaseError,
    );
  });
});
