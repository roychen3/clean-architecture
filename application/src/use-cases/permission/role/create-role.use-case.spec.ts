import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { Role, NoPermissionError } from '@ca/core';

import { PermissionService } from '../../../services';
import { RolesRepository } from '../../../repositories';

import { CreateRoleUseCaseError } from './role.errors';
import {
  CreateRoleUseCase,
  CreateRoleRequestDTO,
} from './create-role.use-case';

describe('CreateRoleUseCase', () => {
  let rolesRepository: Mocked<RolesRepository>;
  let permissionService: Mocked<PermissionService>;
  let useCase: CreateRoleUseCase;
  let request: CreateRoleRequestDTO;
  let executer: string;

  beforeEach(() => {
    rolesRepository = {
      create: vi.fn(),
    } as unknown as Mocked<RolesRepository>;

    permissionService = {
      can: vi.fn(),
    } as unknown as Mocked<PermissionService>;

    useCase = new CreateRoleUseCase({
      rolesRepository,
      permissionService,
    });

    request = { name: 'Admin', priority: 1 };

    executer = 'user-1';
  });

  it('should create a role with valid name and priority', async () => {
    permissionService.can.mockResolvedValue(true);
    rolesRepository.create.mockResolvedValue(undefined);

    const result = await useCase.execute(request, executer);
    expect(result).toBeInstanceOf(Role);
    expect(result.getName()).toBe(request.name);
    expect(result.getPriority()).toBe(request.priority);
    expect(rolesRepository.create).toHaveBeenCalledWith(result);
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'create',
      'roles',
    );
  });

  it('should create a role with only required fields', async () => {
    permissionService.can.mockResolvedValue(true);

    const minimalRequest = { name: 'User' };
    const result = await useCase.execute(minimalRequest, executer);
    expect(result).toBeInstanceOf(Role);
    expect(result.getName()).toBe(minimalRequest.name);
    expect(result.getPriority()).toBe(0);
    expect(rolesRepository.create).toHaveBeenCalledWith(result);
  });

  it('should throw NoPermissionError if user lacks create permissions', async () => {
    permissionService.can.mockResolvedValue(false);

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      NoPermissionError,
    );
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'create',
      'roles',
    );
    expect(rolesRepository.create).not.toHaveBeenCalled();
  });

  it('should throw CreateRoleUseCaseError on unexpected error', async () => {
    permissionService.can.mockRejectedValue(new Error('Unexpected error'));
    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      CreateRoleUseCaseError,
    );
  });
});
