import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { NoPermissionError, User } from '@ca/core';

import { UsersRepository } from '../../repositories';
import { PermissionService } from '../../services';

import { MeUserNotFoundError, UpdateMeProfileUseCaseError } from './me.errors';
import {
  UpdateMeProfileUseCase,
  UpdateMeProfileRequestDTO,
} from './update-me-profile.use-case';

describe('UpdateMeProfileUseCase', () => {
  let usersRepository: Mocked<UsersRepository>;
  let permissionService: Mocked<PermissionService>;
  let useCase: UpdateMeProfileUseCase;
  let request: UpdateMeProfileRequestDTO;
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

    useCase = new UpdateMeProfileUseCase({
      usersRepository,
      permissionService,
    });

    request = { id: 'user-1', name: 'New Name' };

    executer = 'user-1';

    user = {
      setName: vi.fn(),
    } as unknown as Mocked<User>;
  });

  it('should successfully update user profile', async () => {
    permissionService.can.mockResolvedValue(true);
    usersRepository.findById.mockResolvedValue(user);
    usersRepository.update.mockResolvedValue(undefined);

    await expect(useCase.execute(request, executer)).resolves.toBeUndefined();
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'update',
      'me',
      {
        target: { userId: executer, own: true },
      },
    );
    expect(usersRepository.findById).toHaveBeenCalledWith(request.id);
    expect(user.setName).toHaveBeenCalledWith(request.name);
    expect(usersRepository.update).toHaveBeenCalledWith(user);
  });

  it('should throw NoPermissionError for unauthorized access', async () => {
    permissionService.can.mockResolvedValue(false);

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      NoPermissionError,
    );
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'update',
      'me',
      {
        target: { userId: executer, own: true },
      },
    );
    expect(usersRepository.findById).not.toHaveBeenCalled();
    expect(usersRepository.update).not.toHaveBeenCalled();
  });

  it('should throw MeUserNotFoundError for non-existent user', async () => {
    permissionService.can.mockResolvedValue(true);
    usersRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      MeUserNotFoundError,
    );
    expect(usersRepository.findById).toHaveBeenCalledWith(request.id);
    expect(usersRepository.update).not.toHaveBeenCalled();
  });

  it('should throw UpdateMeProfileUseCaseError on unexpected error', async () => {
    permissionService.can.mockRejectedValue(new Error('Unexpected error'));

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      UpdateMeProfileUseCaseError,
    );
  });

  it('should not call setName if name is not provided', async () => {
    permissionService.can.mockResolvedValue(true);
    usersRepository.findById.mockResolvedValue(user);
    usersRepository.update.mockResolvedValue(undefined);

    const request: UpdateMeProfileRequestDTO = { id: 'user-1' };
    await expect(useCase.execute(request, executer)).resolves.toBeUndefined();
    expect(user.setName).not.toHaveBeenCalled();
    expect(usersRepository.update).toHaveBeenCalledWith(user);
  });
});
