import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { User, NoPermissionError } from '@ca/core';

import { PermissionService } from '../../services';
import { UsersRepository } from '../../repositories';

import { UserNotFoundError, GetUserUseCaseError } from './users.errors';
import { GetUserUseCase, GetUserRequestDTO } from './get-user.use-case';

describe('GetUserUseCase', () => {
  let usersRepository: Mocked<UsersRepository>;
  let permissionService: Mocked<PermissionService>;
  let useCase: GetUserUseCase;
  let request: GetUserRequestDTO;
  let executer: string;
  let user: User;

  beforeEach(() => {
    usersRepository = {
      findById: vi.fn(),
    } as unknown as Mocked<UsersRepository>;

    permissionService = {
      can: vi.fn(),
    } as unknown as Mocked<PermissionService>;

    useCase = new GetUserUseCase({
      usersRepository,
      permissionService,
    });

    request = { id: 'user-1' };

    executer = 'executer-1';

    user = new User({
      id: 'user-1',
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    });
  });

  it('should return user when permission granted and user exists', async () => {
    permissionService.can.mockResolvedValue(true);
    usersRepository.findById.mockResolvedValue(user);

    const result = await useCase.execute(request, executer);
    expect(result).toEqual(user);
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'read',
      'users',
    );
    expect(usersRepository.findById).toHaveBeenCalledWith(request.id);
  });

  it('should throw NoPermissionError when permission denied', async () => {
    permissionService.can.mockResolvedValue(false);

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      NoPermissionError,
    );
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'read',
      'users',
    );
    expect(usersRepository.findById).not.toHaveBeenCalled();
  });

  it('should throw UserNotFoundError when user does not exist', async () => {
    permissionService.can.mockResolvedValue(true);
    usersRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      UserNotFoundError,
    );
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'read',
      'users',
    );
    expect(usersRepository.findById).toHaveBeenCalledWith(request.id);
  });

  it('should throw GetUserUseCaseError on unexpected error', async () => {
    permissionService.can.mockRejectedValue(new Error('Unexpected error'));

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      GetUserUseCaseError,
    );
  });
});
