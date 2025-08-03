import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { User, NoPermissionError } from '@ca/core';

import { UsersRepository } from '../../repositories';
import { PermissionService } from '../../services';

import { MeUserNotFoundError, GetMeProfileUseCaseError } from './me.errors';
import {
  GetMeProfileUseCase,
  GetMeProfileRequestDTO,
} from './get-me-profile.use-case';

describe('GetMeProfileUseCase', () => {
  let usersRepository: Mocked<UsersRepository>;
  let permissionService: Mocked<PermissionService>;
  let useCase: GetMeProfileUseCase;
  let request: GetMeProfileRequestDTO;
  let user: User;

  beforeEach(() => {
    usersRepository = {
      findById: vi.fn(),
    } as unknown as Mocked<UsersRepository>;

    permissionService = {
      can: vi.fn(),
    } as unknown as Mocked<PermissionService>;

    useCase = new GetMeProfileUseCase({
      usersRepository,
      permissionService,
    });

    request = { id: 'user-1' };

    user = new User({
      id: 'user-1',
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashed-password',
    });
  });

  it('should successfully retrieve user profile', async () => {
    permissionService.can.mockResolvedValue(true);
    usersRepository.findById.mockResolvedValue(user);

    const result = await useCase.execute(request, user.getId());
    expect(result).toBe(user);
    expect(permissionService.can).toHaveBeenCalledWith(
      user.getId(),
      'update',
      'me',
      { target: { userId: user.getId(), own: true } },
    );
    expect(usersRepository.findById).toHaveBeenCalledWith(user.getId());
  });

  it('should throw NoPermissionError for unauthorized access', async () => {
    permissionService.can.mockResolvedValue(false);

    await expect(useCase.execute(request, user.getId())).rejects.toBeInstanceOf(
      NoPermissionError,
    );
    expect(permissionService.can).toHaveBeenCalledWith(
      user.getId(),
      'update',
      'me',
      { target: { userId: user.getId(), own: true } },
    );
    expect(usersRepository.findById).not.toHaveBeenCalled();
  });

  it('should throw MeUserNotFoundError for non-existent user', async () => {
    permissionService.can.mockResolvedValue(true);
    usersRepository.findById.mockResolvedValue(null);

    await expect(
      useCase.execute(request, 'non-existent-id'),
    ).rejects.toBeInstanceOf(MeUserNotFoundError);
  });

  it('should throw GetMeProfileUseCaseError on unexpected error', async () => {
    permissionService.can.mockRejectedValue(new Error('Unexpected error'));

    await expect(useCase.execute(request, user.getId())).rejects.toBeInstanceOf(
      GetMeProfileUseCaseError,
    );
  });
});
