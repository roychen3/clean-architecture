import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { User } from '@ca/core';

import { CreateUserUseCase } from '../users';

import { SignInUserUseCase, SignInUserResponseDTO } from './sign-in.use-case';
import { RegisterAndSignInUserUseCaseError } from './auth.errors';
import {
  RegisterAndSignInUserUseCase,
  RegisterAndSignInUserRequestDTO,
} from './register-and-sign-in-user.use-case';

describe('RegisterAndSignInUserUseCase', () => {
  let createUserUseCase: Mocked<CreateUserUseCase>;
  let signInUserUseCase: Mocked<SignInUserUseCase>;
  let useCase: RegisterAndSignInUserUseCase;
  let request: RegisterAndSignInUserRequestDTO;
  let createdUser: User;
  let signInResponse: SignInUserResponseDTO;

  beforeEach(() => {
    createUserUseCase = {
      execute: vi.fn(),
    } as unknown as Mocked<CreateUserUseCase>;

    signInUserUseCase = {
      execute: vi.fn(),
    } as unknown as Mocked<SignInUserUseCase>;

    useCase = new RegisterAndSignInUserUseCase({
      registerUserUseCase: createUserUseCase,
      signInUserUseCase,
    });

    request = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    };

    createdUser = new User({
      id: 'user-id',
      email: 'test@example.com',
      name: 'Test User',
      password: 'hashed-password',
    });

    signInResponse = {
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: createdUser,
    };
  });

  it('should successfully register and sign in a user', async () => {
    createUserUseCase.execute.mockResolvedValue(createdUser);
    signInUserUseCase.execute.mockResolvedValue(signInResponse);

    const result = await useCase.execute(request);
    expect(createUserUseCase.execute).toHaveBeenCalledWith(request);
    expect(signInUserUseCase.execute).toHaveBeenCalledWith({
      email: request.email,
      password: request.password,
    });
    expect(result).toEqual(signInResponse);
  });

  it('should throw RegisterAndSignInUserUseCaseError on unexpected error', async () => {
    createUserUseCase.execute.mockRejectedValueOnce(
      new Error('Unexpected error'),
    );
    await expect(useCase.execute(request)).rejects.toBeInstanceOf(
      RegisterAndSignInUserUseCaseError,
    );
  });
});
