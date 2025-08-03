import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { User, NoPermissionError } from '@ca/core';

import { PermissionService } from '../../services';
import { UsersRepository } from '../../repositories';

import { UpdateUserUseCaseError, UserNotFoundError } from './users.errors';
import {
  UpdateUserUseCase,
  UpdateUserRequestDTO,
} from './update-user.use-case';

describe('UpdateUserUseCase', () => {
  let usersRepository: Mocked<UsersRepository>;
  let permissionService: Mocked<PermissionService>;
  let useCase: UpdateUserUseCase;
  let request: UpdateUserRequestDTO;
  let executer: string;
  let user: Mocked<User>;

  beforeEach(() => {
    usersRepository = {
      findById: vi.fn(),
      update: vi.fn(),
    } as unknown as Mocked<UsersRepository>;

    permissionService = {
      can: vi.fn(),
    } as unknown as Mocked<PermissionService>;

    useCase = new UpdateUserUseCase({
      usersRepository,
      permissionService,
    });

    request = { id: 'user-id', name: 'new-name' };

    executer = 'executer-id';

    user = {
      id: 'user-id',
      setName: vi.fn(),
    } as unknown as Mocked<User>;
  });

  it('should update user successfully', async () => {
    permissionService.can.mockResolvedValue(true);
    usersRepository.findById.mockResolvedValue(user);
    usersRepository.update.mockResolvedValue(undefined);

    await expect(useCase.execute(request, executer)).resolves.toBeUndefined();
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'update',
      'users',
    );
    expect(usersRepository.findById).toHaveBeenCalledWith(request.id);
    expect(user.setName).toHaveBeenCalledWith(request.name);
    expect(usersRepository.update).toHaveBeenCalledWith(user);
  });

  it('should not call setName if name is not provided', async () => {
    permissionService.can.mockResolvedValue(true);
    usersRepository.findById.mockResolvedValue(user);
    usersRepository.update.mockResolvedValue(undefined);

    const request = { id: 'user-id' };
    await expect(useCase.execute(request, executer)).resolves.toBeUndefined();
    expect(user.setName).not.toHaveBeenCalled();
    expect(usersRepository.update).toHaveBeenCalledWith(user);
  });

  it('should throw NoPermissionError if permission denied', async () => {
    permissionService.can.mockResolvedValue(false);

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      NoPermissionError,
    );
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'update',
      'users',
    );
    expect(usersRepository.findById).not.toHaveBeenCalled();
    expect(user.setName).not.toHaveBeenCalled();
    expect(usersRepository.update).not.toHaveBeenCalled();
  });

  it('should throw UserNotFoundError if user does not exist', async () => {
    permissionService.can.mockResolvedValue(true);
    usersRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      UserNotFoundError,
    );
    expect(usersRepository.findById).toHaveBeenCalledWith(request.id);
    expect(user.setName).not.toHaveBeenCalled();
    expect(usersRepository.update).not.toHaveBeenCalled();
  });

  it('should throw UpdateUserUseCaseError on unexpected error', async () => {
    permissionService.can.mockRejectedValue(new Error('Unexpected error'));

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      UpdateUserUseCaseError,
    );
  });
});
