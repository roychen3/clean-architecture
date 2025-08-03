import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { User, NoPermissionError } from '@ca/core';

import { PermissionService } from '../../services';

import { CreateUserUseCaseError } from './users.errors';
import { CreateUserUseCase } from './create-user.use-case';
import {
  CreateUserWithPermissionUseCase,
  CreateUserWithPermissionRequestDTO,
} from './create-user-with-permission.use-case';

describe('CreateUserWithPermissionUseCase', () => {
  let permissionService: Mocked<PermissionService>;
  let createUserUseCase: Mocked<CreateUserUseCase>;
  let useCase: CreateUserWithPermissionUseCase;
  let request: CreateUserWithPermissionRequestDTO;
  let executer: string;
  let user: User;

  beforeEach(() => {
    permissionService = {
      can: vi.fn(),
    } as unknown as Mocked<PermissionService>;

    createUserUseCase = {
      execute: vi.fn(),
    } as unknown as Mocked<CreateUserUseCase>;

    useCase = new CreateUserWithPermissionUseCase({
      createUserUseCase,
      permissionService,
    });

    request = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    executer = 'executer-id';

    user = new User({
      id: '1',
      email: request.email,
      name: request.name,
      password: request.password,
    });
  });

  it('should create a user successfully', async () => {
    permissionService.can.mockResolvedValue(true);
    createUserUseCase.execute.mockResolvedValue(user);

    const result = await useCase.execute(request, executer);
    expect(result).toEqual(user);
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'create',
      'users',
    );
    expect(createUserUseCase.execute).toHaveBeenCalledWith(request);
  });

  it('should throw NoPermissionError if user lacks permission', async () => {
    permissionService.can.mockResolvedValue(false);

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      NoPermissionError,
    );
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'create',
      'users',
    );
    expect(createUserUseCase.execute).not.toHaveBeenCalled();
  });

  it('should throw CreateUserUseCaseError on unexpected error', async () => {
    permissionService.can.mockRejectedValue(new Error('Unexpected error'));

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      CreateUserUseCaseError,
    );
  });
});
