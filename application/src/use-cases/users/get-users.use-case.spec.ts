import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { User, NoPermissionError } from '@ca/core';

import { PermissionService } from '../../services';
import { UsersRepository } from '../../repositories';

import { GetUsersUseCaseError } from './users.errors';
import { GetUsersUseCase } from './get-users.use-case';

describe('GetUsersUseCase', () => {
  let usersRepository: Mocked<UsersRepository>;
  let permissionService: Mocked<PermissionService>;
  let useCase: GetUsersUseCase;
  let executer: string;
  let users: User[];

  beforeEach(() => {
    usersRepository = {
      findAll: vi.fn(),
    } as unknown as Mocked<UsersRepository>;

    permissionService = {
      can: vi.fn(),
    } as unknown as Mocked<PermissionService>;

    useCase = new GetUsersUseCase({
      usersRepository,
      permissionService,
    });

    executer = 'executer-id';

    users = [
      new User({
        id: '1',
        name: 'Alice',
        email: 'alice@example.com',
        password: 'password1',
      }),
      new User({
        id: '2',
        name: 'Bob',
        email: 'bob@example.com',
        password: 'password2',
      }),
    ];
  });

  it('should return users list when permission granted', async () => {
    permissionService.can.mockResolvedValue(true);
    usersRepository.findAll.mockResolvedValue(users);

    const result = await useCase.execute(executer);
    expect(result).toEqual(users);
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'read',
      'users',
    );
    expect(usersRepository.findAll).toHaveBeenCalled();
  });

  it('should throw NoPermissionError when permission denied', async () => {
    permissionService.can.mockResolvedValue(false);

    await expect(useCase.execute(executer)).rejects.toBeInstanceOf(
      NoPermissionError,
    );
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'read',
      'users',
    );
    expect(usersRepository.findAll).not.toHaveBeenCalled();
  });

  it('should throw GetUsersUseCaseError on unexpected error', async () => {
    permissionService.can.mockRejectedValue(new Error('Unexpected error'));

    await expect(useCase.execute(executer)).rejects.toBeInstanceOf(
      GetUsersUseCaseError,
    );
  });
});
