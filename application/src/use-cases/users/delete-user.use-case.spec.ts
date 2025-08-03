import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { NoPermissionError, Role, User } from '@ca/core';

import { PermissionService } from '../../services';
import { UsersRepository } from '../../repositories';

import { DeleteUserUseCaseError, UserNotFoundError } from './users.errors';
import {
  DeleteUserUseCase,
  DeleteUserRequestDTO,
} from './delete-user.use-case';

describe('DeleteUserUseCase', () => {
  let usersRepository: Mocked<UsersRepository>;
  let permissionService: Mocked<PermissionService>;
  let useCase: DeleteUserUseCase;
  let request: DeleteUserRequestDTO;
  let executerId: string;
  let superAdminId: string;
  let user: User;
  let superAdminRole: Role;

  beforeEach(() => {
    usersRepository = {
      findById: vi.fn(),
      delete: vi.fn(),
    } as unknown as Mocked<UsersRepository>;

    permissionService = {
      can: vi.fn(),
    } as unknown as Mocked<PermissionService>;

    useCase = new DeleteUserUseCase({
      usersRepository,
      permissionService,
    });

    request = { id: 'user-1' };

    executerId = 'executer-1';

    superAdminId = 'super-admin-1';

    user = new User({
      id: request.id,
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    superAdminRole = new Role({
      id: 'super-admin-role',
      name: 'Super Admin',
      isSuperAdmin: true,
    });
  });

  it('should delete user successfully', async () => {
    permissionService.can.mockResolvedValue(true);
    usersRepository.findById.mockResolvedValue(user);
    usersRepository.delete.mockResolvedValue(undefined);

    await expect(useCase.execute(request, executerId)).resolves.toBeUndefined();
    expect(permissionService.can).toHaveBeenCalledWith(
      executerId,
      'delete',
      'users',
      {
        target: {
          userId: request.id,
        },
        validator: expect.any(Function),
      },
    );
    expect(usersRepository.findById).toHaveBeenCalledWith(request.id);
    expect(usersRepository.delete).toHaveBeenCalledWith(request.id);
  });

  it('should fail when trying to delete self', async () => {
    await expect(
      useCase.execute({ id: executerId }, executerId),
    ).rejects.toMatchObject({
      name: 'NoPermissionError',
      errorCode: 'NO_PERMISSION',
      message: 'You cannot delete yourself',
    });
    expect(permissionService.can).not.toHaveBeenCalled();
    expect(usersRepository.findById).not.toHaveBeenCalled();
    expect(usersRepository.delete).not.toHaveBeenCalled();
  });

  it('should fail when no permission', async () => {
    permissionService.can.mockResolvedValue(false);

    await expect(useCase.execute(request, executerId)).rejects.toThrow(
      NoPermissionError,
    );
    expect(permissionService.can).toHaveBeenCalledWith(
      executerId,
      'delete',
      'users',
      {
        target: {
          userId: request.id,
        },
        validator: expect.any(Function),
      },
    );
    expect(usersRepository.findById).not.toHaveBeenCalled();
    expect(usersRepository.delete).not.toHaveBeenCalled();
  });

  it('should fail when trying to delete super admin', async () => {
    permissionService.can = vi.fn((_executer, _action, _resource, options) => {
      if (options?.validator) {
        return options.validator([], [superAdminRole]);
      }
      throw new Error('Should provide validator');
    });

    await expect(
      useCase.execute({ id: superAdminId }, executerId),
    ).rejects.toMatchObject({
      name: 'NoPermissionError',
      errorCode: 'NO_PERMISSION',
      message: 'Super Admin cannot be deleted',
    });
    expect(usersRepository.findById).not.toHaveBeenCalled();
    expect(usersRepository.delete).not.toHaveBeenCalled();
  });

  it('should fail when user does not exist', async () => {
    permissionService.can.mockResolvedValue(true);
    usersRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(request, executerId)).rejects.toThrow(
      UserNotFoundError,
    );
    expect(usersRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw DeleteUserUseCaseError on unexpected error', async () => {
    permissionService.can.mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    await expect(useCase.execute(request, executerId)).rejects.toThrow(
      DeleteUserUseCaseError,
    );
  });
});
