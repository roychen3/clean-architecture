import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { User, NoPermissionError, RolePermissions, Role } from '@ca/core';

import { UsersRepository } from '../../repositories';
import { PasswordHasher, PermissionService } from '../../services';

import {
  MeUserNotFoundError,
  MeUserPasswordInvalidError,
  DeleteMeUseCaseError,
} from './me.errors';
import { DeleteMeUseCase, DeleteMeRequestDTO } from './delete-me.use-case';

describe('DeleteMeUseCase', () => {
  let usersRepository: Mocked<UsersRepository>;
  let passwordHasher: Mocked<PasswordHasher>;
  let permissionService: Mocked<PermissionService>;
  let useCase: DeleteMeUseCase;
  let request: DeleteMeRequestDTO;
  let executer: string;
  let user: Mocked<User>;

  beforeEach(() => {
    usersRepository = {
      findById: vi.fn(),
      delete: vi.fn(),
    } as unknown as Mocked<UsersRepository>;

    passwordHasher = {
      compare: vi.fn(),
    } as unknown as Mocked<PasswordHasher>;

    permissionService = {
      can: vi.fn(),
    } as unknown as Mocked<PermissionService>;

    useCase = new DeleteMeUseCase({
      usersRepository,
      passwordHasher,
      permissionService,
    });

    request = { id: 'user-1', password: 'password' };

    executer = 'user-1';

    user = {
      getPassword: vi.fn(),
    } as unknown as Mocked<User>;
  });

  it('should successfully delete user account', async () => {
    permissionService.can.mockResolvedValue(true);
    usersRepository.findById.mockResolvedValue(user);
    passwordHasher.compare.mockResolvedValue(true);
    usersRepository.delete.mockResolvedValue(undefined);

    await expect(useCase.execute(request, executer)).resolves.toBeUndefined();
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'delete',
      'me',
      {
        target: { userId: executer, own: true },
        validator: expect.any(Function),
      },
    );
    expect(usersRepository.findById).toHaveBeenCalledWith(request.id);
    expect(passwordHasher.compare).toHaveBeenCalledWith(
      request.password,
      user.getPassword(),
    );
    expect(usersRepository.delete).toHaveBeenCalledWith(executer);
  });

  it('should throw NoPermissionError for unauthorized access', async () => {
    permissionService.can.mockResolvedValue(false);

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      NoPermissionError,
    );
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'delete',
      'me',
      {
        target: { userId: executer, own: true },
        validator: expect.any(Function),
      },
    );
    expect(usersRepository.findById).not.toHaveBeenCalled();
    expect(passwordHasher.compare).not.toHaveBeenCalled();
    expect(usersRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw NoPermissionError with message for super admin', async () => {
    const superAdminRole = {
      getIsSuperAdminRole: vi.fn(() => true),
    } as unknown as Role;
    const executerRolePermissions = [
      { role: superAdminRole },
    ] as unknown as RolePermissions[];
    permissionService.can.mockImplementation(
      async (_executer, _action, _resource, options) => {
        if (options?.validator) {
          const result = await options.validator(executerRolePermissions, []);
          return result;
        }
        throw new Error('Expected provider validator not provided');
      },
    );

    await expect(useCase.execute(request, executer)).rejects.toMatchObject({
      name: 'NoPermissionError',
      message: 'Super Admin cannot be deleted',
    });
    expect(usersRepository.findById).not.toHaveBeenCalled();
    expect(passwordHasher.compare).not.toHaveBeenCalled();
    expect(usersRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw MeUserNotFoundError for non-existent user', async () => {
    permissionService.can.mockResolvedValue(true);
    usersRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      MeUserNotFoundError,
    );
    expect(passwordHasher.compare).not.toHaveBeenCalled();
    expect(usersRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw MeUserPasswordInvalidError for invalid password', async () => {
    permissionService.can.mockResolvedValue(true);
    usersRepository.findById.mockResolvedValue(user);
    passwordHasher.compare.mockResolvedValue(false);

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      MeUserPasswordInvalidError,
    );
    expect(usersRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw DeleteMeUseCaseError on unexpected error', async () => {
    permissionService.can.mockRejectedValue(new Error('Unexpected error'));

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      DeleteMeUseCaseError,
    );
  });
});
