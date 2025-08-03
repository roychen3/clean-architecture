import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { User, NoPermissionError } from '@ca/core';

import { UsersRepository } from '../../repositories';
import { PasswordHasher, PermissionService } from '../../services';

import {
  MeUserNotFoundError,
  MeUserPasswordInvalidError,
  ChangeMePasswordUseCaseError,
} from './me.errors';
import {
  ChangeMePasswordUseCase,
  ChangeMePasswordRequestDTO,
} from './change-me-password.use-case';

describe('ChangeMePasswordUseCase', () => {
  let usersRepository: Mocked<UsersRepository>;
  let passwordHasher: Mocked<PasswordHasher>;
  let permissionService: Mocked<PermissionService>;
  let useCase: ChangeMePasswordUseCase;
  let request: ChangeMePasswordRequestDTO;
  let executer: string;
  let user: Mocked<User>;

  beforeEach(() => {
    usersRepository = {
      findById: vi.fn(),
      update: vi.fn(),
    } as unknown as Mocked<UsersRepository>;

    passwordHasher = {
      compare: vi.fn(),
      hash: vi.fn(),
    } as unknown as Mocked<PasswordHasher>;

    permissionService = {
      can: vi.fn(),
    } as unknown as Mocked<PermissionService>;

    useCase = new ChangeMePasswordUseCase({
      usersRepository,
      passwordHasher,
      permissionService,
    });

    request = {
      id: executer,
      oldPassword: 'oldPass',
      newPassword: 'newPass',
    };

    executer = 'user-123';

    user = {
      getPassword: vi.fn().mockReturnValue('hashedOldPass'),
      setPassword: vi.fn(),
      validate: vi.fn().mockReturnValue({ success: true, error: null }),
    } as unknown as Mocked<User>;
  });

  it('should successfully change user password', async () => {
    permissionService.can.mockResolvedValue(true);
    usersRepository.findById.mockResolvedValue(user);
    passwordHasher.compare.mockResolvedValue(true);
    passwordHasher.hash.mockResolvedValue('hashedNewPass');

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
    expect(passwordHasher.compare).toHaveBeenCalledWith(
      request.oldPassword,
      'hashedOldPass',
    );
    expect(user.setPassword).toHaveBeenCalledWith(request.newPassword);
    expect(user.validate).toHaveBeenCalled();
    expect(passwordHasher.hash).toHaveBeenCalledWith(request.newPassword);
    expect(user.setPassword).toHaveBeenCalledWith('hashedNewPass');
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
    expect(passwordHasher.compare).not.toHaveBeenCalled();
    expect(passwordHasher.hash).not.toHaveBeenCalled();
    expect(usersRepository.update).not.toHaveBeenCalled();
  });

  it('should throw MeUserNotFoundError for non-existent user', async () => {
    permissionService.can.mockResolvedValue(true);
    usersRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      MeUserNotFoundError,
    );
    expect(usersRepository.findById).toHaveBeenCalled();
    expect(passwordHasher.compare).not.toHaveBeenCalled();
    expect(passwordHasher.hash).not.toHaveBeenCalled();
    expect(usersRepository.update).not.toHaveBeenCalled();
  });

  it('should throw MeUserPasswordInvalidError for incorrect old password', async () => {
    permissionService.can.mockResolvedValue(true);
    usersRepository.findById.mockResolvedValue(user);
    passwordHasher.compare.mockResolvedValue(false);

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      MeUserPasswordInvalidError,
    );
    expect(usersRepository.findById).toHaveBeenCalled();
    expect(passwordHasher.compare).toHaveBeenCalled();
    expect(passwordHasher.hash).not.toHaveBeenCalled();
    expect(usersRepository.update).not.toHaveBeenCalled();
  });

  it('should throw MeUserPasswordInvalidError if user.validate() returns error', async () => {
    permissionService.can.mockResolvedValue(true);
    usersRepository.findById.mockResolvedValue(user);
    passwordHasher.compare.mockResolvedValue(true);
    user.validate.mockReturnValue({
      success: false,
      error: new Error('invalid'),
    });

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      MeUserPasswordInvalidError,
    );
    expect(usersRepository.findById).toHaveBeenCalled();
    expect(passwordHasher.compare).toHaveBeenCalled();
    expect(passwordHasher.hash).not.toHaveBeenCalled();
    expect(usersRepository.update).not.toHaveBeenCalled();
  });

  it('should throw ChangeMePasswordUseCaseError on unexpected error', async () => {
    permissionService.can.mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      ChangeMePasswordUseCaseError,
    );
  });
});
