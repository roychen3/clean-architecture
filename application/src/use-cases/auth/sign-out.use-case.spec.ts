import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { AuthenticationError } from '@ca/core';

import { UserSessionsRepository } from '../../repositories';
import {
  TokenGenerator,
  BaseVerifyPayload,
  AccessTokenPayload,
} from '../../services';

import {
  SignOutUseCaseError,
  AuthInvalidAccessTokenError,
} from './auth.errors';
import { SignOutUseCase, SignOutRequestDTO } from './sign-out.use-case';

describe('SignOutUseCase', () => {
  let userSessionsRepository: Mocked<UserSessionsRepository>;
  let accessTokenGenerator: Mocked<TokenGenerator>;
  let useCase: SignOutUseCase;
  let request: SignOutRequestDTO;
  let accessTokenPayload: BaseVerifyPayload & AccessTokenPayload;

  beforeEach(() => {
    userSessionsRepository = {
      delete: vi.fn(),
    } as unknown as Mocked<UserSessionsRepository>;

    accessTokenGenerator = {
      verifyToken: vi.fn(),
      decodeToken: vi.fn(),
    } as unknown as Mocked<TokenGenerator>;

    useCase = new SignOutUseCase({
      userSessionsRepository,
      accessTokenGenerator,
    });

    request = {
      accessToken: 'mock-access-token',
    };

    accessTokenPayload = {
      sub: 'user-456',
      iat: 123456,
      exp: 123999,
      type: 'access',
      userId: 'user-456',
      userSessionId: 'session-123',
      userPermissions: [],
      version: 1,
    };
  });

  it('should successfully sign out a user', async () => {
    accessTokenGenerator.verifyToken.mockReturnValue(accessTokenPayload);
    userSessionsRepository.delete.mockResolvedValue(undefined);

    await expect(useCase.execute(request)).resolves.toBeUndefined();
    expect(accessTokenGenerator.verifyToken).toHaveBeenCalledWith(
      request.accessToken,
    );
    expect(userSessionsRepository.delete).toHaveBeenCalledWith(
      accessTokenPayload.userSessionId,
    );
  });

  it('should successfully sign out when access token is invalid but can decode', async () => {
    accessTokenGenerator.verifyToken.mockImplementation(() => {
      const error = { code: 'TOKEN_EXPIRED_ERROR' };
      throw error;
    });
    accessTokenGenerator.decodeToken.mockReturnValue(accessTokenPayload);

    await expect(useCase.execute(request)).resolves.toBeUndefined();
    expect(accessTokenGenerator.decodeToken).toHaveBeenCalledWith(
      request.accessToken,
    );
    expect(userSessionsRepository.delete).toHaveBeenCalledWith(
      accessTokenPayload.userSessionId,
    );
  });

  it('should throw AuthInvalidAccessTokenError for invalid access token', async () => {
    accessTokenGenerator.verifyToken.mockImplementation(() => {
      // const error = { code: 'TOKEN_INVALID_ERROR' };
      throw new AuthenticationError();
    });

    await expect(useCase.execute(request)).rejects.toBeInstanceOf(
      AuthInvalidAccessTokenError,
    );
    expect(userSessionsRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw SignOutUseCaseError on unexpected error', async () => {
    accessTokenGenerator.verifyToken.mockImplementation(() => {
      throw new Error('Unexpected error');
    });
    accessTokenGenerator.decodeToken.mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    await expect(useCase.execute(request)).rejects.toBeInstanceOf(
      SignOutUseCaseError,
    );
  });
});
