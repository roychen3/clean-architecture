import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { PermissionAction, NoPermissionError } from '@ca/core';

import { PermissionService } from '../../../services';
import { PermissionActionsRepository } from '../../../repositories';

import { GetAllPermissionActionsUseCaseError } from './actions.errors';
import { GetAllPermissionActionsUseCase } from './get-all-permission-actions.use-case';

describe('GetAllPermissionActionsUseCase', () => {
  let permissionActionsRepository: Mocked<PermissionActionsRepository>;
  let permissionService: Mocked<PermissionService>;
  let useCase: GetAllPermissionActionsUseCase;
  let actions: PermissionAction[];
  let executer: string;

  beforeEach(() => {
    permissionActionsRepository = {
      findAll: vi.fn(),
    } as unknown as Mocked<PermissionActionsRepository>;

    permissionService = {
      can: vi.fn(),
    } as unknown as Mocked<PermissionService>;

    useCase = new GetAllPermissionActionsUseCase({
      permissionActionsRepository,
      permissionService,
    });

    executer = 'user-1';

    actions = [
      new PermissionAction({ id: '1', name: 'create' }),
      new PermissionAction({ id: '2', name: 'read' }),
    ];
  });

  it('should return all permission actions for a user with read permissions', async () => {
    permissionService.can.mockResolvedValue(true);
    permissionActionsRepository.findAll.mockResolvedValue(actions);

    const result = await useCase.execute(executer);
    expect(result).toEqual(actions);
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'read',
      'permissions',
    );
    expect(permissionActionsRepository.findAll).toHaveBeenCalled();
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
    expect(permissionActionsRepository.findAll).not.toHaveBeenCalled();
  });

  it('should throw GetAllPermissionActionsUseCaseError on unexpected error', async () => {
    permissionService.can.mockRejectedValue(new Error('Unexpected error'));

    await expect(useCase.execute(executer)).rejects.toBeInstanceOf(
      GetAllPermissionActionsUseCaseError,
    );
  });
});
