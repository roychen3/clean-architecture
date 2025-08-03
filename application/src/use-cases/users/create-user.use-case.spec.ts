import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { User, Role } from '@ca/core';

import { PasswordHasher } from '../../services';
import {
  UsersRepository,
  RolesRepository,
  RolePermissionsRepository,
} from '../../repositories';

import {
  CreateUserUseCaseError,
  UserAlreadyExistsError,
  InvalidUserDataError,
} from './users.errors';
import {
  CreateUserRequestDTO,
  CreateUserUseCase,
} from './create-user.use-case';

describe('CreateUserUseCase', () => {
  let usersRepository: Mocked<UsersRepository>;
  let rolesRepository: Mocked<RolesRepository>;
  let rolePermissionsRepository: Mocked<RolePermissionsRepository>;
  let passwordHasher: Mocked<PasswordHasher>;
  let useCase: CreateUserUseCase;
  let request: CreateUserRequestDTO;
  let userRole: Role;
  let newUser: Mocked<User>;

  beforeEach(() => {
    usersRepository = {
      findByEmail: vi.fn(),
      create: vi.fn(),
    } as unknown as Mocked<UsersRepository>;
    rolesRepository = {
      findByName: vi.fn(),
    } as unknown as Mocked<RolesRepository>;
    rolePermissionsRepository = {
      assignRoleToUser: vi.fn(),
    } as unknown as Mocked<RolePermissionsRepository>;
    passwordHasher = {
      hash: vi.fn(),
    } as unknown as Mocked<PasswordHasher>;
    useCase = new CreateUserUseCase({
      usersRepository,
      rolesRepository,
      rolePermissionsRepository,
      passwordHasher,
    });
    request = {
      email: 'test@example.com',
      password: 'Password123!',
      name: 'Test User',
    };
    userRole = new Role({
      id: 'user-role-id',
      name: 'user',
    });
    newUser = {
      getEmail: vi.fn().mockReturnValue('test@example.com'),
      getPassword: vi.fn().mockReturnValue('Password123!'),
      getName: vi.fn().mockReturnValue('Test User'),
    } as unknown as Mocked<User>;
  });

  it('should create a user successfully', async () => {
    rolesRepository.findByName.mockResolvedValue(userRole);
    usersRepository.findByEmail.mockResolvedValue(null);
    passwordHasher.hash.mockResolvedValue('hashed-password');
    usersRepository.create.mockResolvedValue(undefined);
    rolePermissionsRepository.assignRoleToUser.mockResolvedValue(undefined);

    const response = await useCase.execute(request);
    expect(response).toBeInstanceOf(User);
    expect(response.getEmail()).toBe(request.email);
    expect(response.getName()).toBe(request.name);
    expect(rolesRepository.findByName).toHaveBeenCalledWith('user');
    expect(usersRepository.findByEmail).toHaveBeenCalledWith(request.email);
    expect(passwordHasher.hash).toHaveBeenCalledWith(request.password);
    expect(usersRepository.create).toHaveBeenCalledWith({
      id: response.getId(),
      email: response.getEmail(),
      name: response.getName(),
      password: response.getPassword(),
      roles: response.getRoles(),
      createdAt: response.getCreatedAt(),
      updatedAt: response.getUpdatedAt(),
    });
    expect(rolePermissionsRepository.assignRoleToUser).toHaveBeenCalledWith(
      response.getId(),
      userRole.getId(),
    );
  });

  it('should throw CreateUserUseCaseError if user role not found', async () => {
    rolesRepository.findByName.mockResolvedValue(null);

    await expect(
      useCase.execute({
        email: newUser.getEmail(),
        password: newUser.getPassword(),
        name: newUser.getName(),
      }),
    ).rejects.toBeInstanceOf(CreateUserUseCaseError);
    expect(rolesRepository.findByName).toHaveBeenCalledWith('user');
    expect(usersRepository.findByEmail).not.toHaveBeenCalled();
    expect(passwordHasher.hash).not.toHaveBeenCalled();
    expect(usersRepository.create).not.toHaveBeenCalled();
    expect(rolePermissionsRepository.assignRoleToUser).not.toHaveBeenCalled();
  });

  it('should throw UserAlreadyExistsError if user already exists', async () => {
    rolesRepository.findByName.mockResolvedValue(userRole);
    usersRepository.findByEmail.mockResolvedValue(newUser);

    await expect(useCase.execute(request)).rejects.toBeInstanceOf(
      UserAlreadyExistsError,
    );
    expect(rolesRepository.findByName).toHaveBeenCalledWith('user');
    expect(usersRepository.findByEmail).toHaveBeenCalledWith(request.email);
    expect(passwordHasher.hash).not.toHaveBeenCalled();
    expect(usersRepository.create).not.toHaveBeenCalled();
    expect(rolePermissionsRepository.assignRoleToUser).not.toHaveBeenCalled();
  });

  it('should throw InvalidUserDataError if user data is invalid', async () => {
    rolesRepository.findByName.mockResolvedValue(userRole);
    usersRepository.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({
        ...request,
        password: '123', // Invalid password
      }),
    ).rejects.toBeInstanceOf(InvalidUserDataError);
    expect(rolesRepository.findByName).toHaveBeenCalledWith('user');
    expect(usersRepository.findByEmail).toHaveBeenCalledWith(request.email);
    expect(passwordHasher.hash).not.toHaveBeenCalled();
    expect(usersRepository.create).not.toHaveBeenCalled();
    expect(rolePermissionsRepository.assignRoleToUser).not.toHaveBeenCalled();
  });

  it('should throw CreateUserUseCaseError on unexpected error', async () => {
    rolesRepository.findByName.mockRejectedValue(new Error('Unexpected error'));

    await expect(useCase.execute(request)).rejects.toBeInstanceOf(
      CreateUserUseCaseError,
    );
  });
});
