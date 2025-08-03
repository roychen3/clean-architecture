import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { User, UserSession } from '@ca/core';

import {
  UsersRepository,
  UserSessionsRepository,
  RolePermissionsRepository,
} from '../../repositories';
import { PasswordHasher, TokenGenerator } from '../../services';

import { SignInUseCaseError, AuthInvalidCredentialsError } from './auth.errors';
import { SignInUserUseCase, SignInUserRequestDTO } from './sign-in.use-case';

describe('SignInUserUseCase', () => {
  let usersRepository: Mocked<UsersRepository>;
  let userSessionsRepository: Mocked<UserSessionsRepository>;
  let rolePermissionsRepository: Mocked<RolePermissionsRepository>;
  let passwordHasher: Mocked<PasswordHasher>;
  let accessTokenGenerator: Mocked<TokenGenerator>;
  let refreshTokenGenerator: Mocked<TokenGenerator>;
  let useCase: SignInUserUseCase;
  let request: SignInUserRequestDTO;
  let user: Mocked<User>;
  let userSession: Mocked<UserSession>;

  beforeEach(() => {
    usersRepository = {
      findByEmail: vi.fn(),
    } as unknown as Mocked<UsersRepository>;

    userSessionsRepository = {
      create: vi.fn(),
    } as unknown as Mocked<UserSessionsRepository>;

    rolePermissionsRepository = {
      getUserPermissions: vi.fn(),
    } as unknown as Mocked<RolePermissionsRepository>;

    passwordHasher = {
      compare: vi.fn(),
    } as unknown as Mocked<PasswordHasher>;

    accessTokenGenerator = {
      generateToken: vi.fn(),
    } as unknown as Mocked<TokenGenerator>;

    refreshTokenGenerator = {
      generateToken: vi.fn(),
    } as unknown as Mocked<TokenGenerator>;

    useCase = new SignInUserUseCase({
      usersRepository,
      userSessionsRepository,
      rolePermissionsRepository,
      passwordHasher,
      accessTokenGenerator,
      refreshTokenGenerator,
    });

    request = {
      email: 'test@example.com',
      password: 'password123',
    };

    user = {
      getId: vi.fn(() => 'user-id'),
      getPassword: vi.fn(() => 'hashed-password'),
    } as unknown as Mocked<User>;

    userSession = {
      getId: vi.fn(() => 'session-id'),
      getAccessTokenVersion: vi.fn(() => 1),
    } as unknown as Mocked<UserSession>;
  });

  it('should successfully sign in a user', async () => {
    usersRepository.findByEmail.mockResolvedValue(user);
    passwordHasher.compare.mockResolvedValue(true);
    refreshTokenGenerator.generateToken.mockReturnValue('refresh-token');
    rolePermissionsRepository.getUserPermissions.mockResolvedValue([]);
    accessTokenGenerator.generateToken.mockReturnValue('access-token');
    userSessionsRepository.create.mockResolvedValue(userSession);

    const result = await useCase.execute(request);
    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
    expect(result.user).toBe(user);
    expect(usersRepository.findByEmail).toHaveBeenCalledWith(request.email);
    expect(passwordHasher.compare).toHaveBeenCalledWith(
      request.password,
      user.getPassword(),
    );
    expect(refreshTokenGenerator.generateToken).toHaveBeenCalledWith({
      type: 'refresh',
      userId: user.getId(),
    });
    expect(rolePermissionsRepository.getUserPermissions).toHaveBeenCalledWith(
      user.getId(),
    );
    expect(accessTokenGenerator.generateToken).toHaveBeenCalledWith({
      type: 'access',
      userId: user.getId(),
      userSessionId: expect.any(String),
      userPermissions: [],
      version: 1,
    });
    expect(userSessionsRepository.create).toHaveBeenCalled();
  });

  it('should throw AuthInvalidCredentialsError if user not found', async () => {
    usersRepository.findByEmail.mockResolvedValue(null);

    await expect(useCase.execute(request)).rejects.toBeInstanceOf(
      AuthInvalidCredentialsError,
    );
    expect(passwordHasher.compare).not.toHaveBeenCalled();
    expect(refreshTokenGenerator.generateToken).not.toHaveBeenCalled();
    expect(rolePermissionsRepository.getUserPermissions).not.toHaveBeenCalled();
    expect(accessTokenGenerator.generateToken).not.toHaveBeenCalled();
    expect(userSessionsRepository.create).not.toHaveBeenCalled();
  });

  it('should throw AuthInvalidCredentialsError if password is invalid', async () => {
    usersRepository.findByEmail.mockResolvedValue(user);
    passwordHasher.compare.mockResolvedValue(false);

    await expect(useCase.execute(request)).rejects.toBeInstanceOf(
      AuthInvalidCredentialsError,
    );
    expect(passwordHasher.compare).toHaveBeenCalled();
    expect(refreshTokenGenerator.generateToken).not.toHaveBeenCalled();
    expect(rolePermissionsRepository.getUserPermissions).not.toHaveBeenCalled();
    expect(accessTokenGenerator.generateToken).not.toHaveBeenCalled();
    expect(userSessionsRepository.create).not.toHaveBeenCalled();
  });

  it('should throw SignInUseCaseError on unexpected error', async () => {
    usersRepository.findByEmail.mockRejectedValue(
      new Error('Unexpected error'),
    );

    await expect(useCase.execute(request)).rejects.toBeInstanceOf(
      SignInUseCaseError,
    );
  });
});
