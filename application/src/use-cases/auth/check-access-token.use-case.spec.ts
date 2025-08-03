import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { UserSession } from '@ca/core';

import { UserSessionsRepository } from '../../repositories';
import {
  TokenGenerator,
  BaseVerifyPayload,
  AccessTokenPayload,
} from '../../services';

import {
  CheckAccessTokenUseCaseError,
  AuthUserSessionNotFoundError,
  AuthAccessTokenVersionMismatchError,
} from './auth.errors';
import {
  CheckAccessTokenUseCase,
  CheckAccessTokenRequestDTO,
} from './check-access-token.use-case';

describe('CheckAccessTokenUseCase', () => {
  let userSessionsRepository: Mocked<UserSessionsRepository>;
  let accessTokenGenerator: Mocked<TokenGenerator>;
  let useCase: CheckAccessTokenUseCase;
  let request: CheckAccessTokenRequestDTO;
  let validPayload: BaseVerifyPayload & AccessTokenPayload;
  let userSession: Mocked<UserSession>;

  beforeEach(() => {
    userSessionsRepository = {
      findById: vi.fn(),
    } as unknown as Mocked<UserSessionsRepository>;

    accessTokenGenerator = {
      verifyToken: vi.fn(),
    } as unknown as Mocked<TokenGenerator>;

    useCase = new CheckAccessTokenUseCase({
      userSessionsRepository,
      accessTokenGenerator,
    });

    request = {
      accessToken: 'mock-access-token',
    };

    validPayload = {
      sub: 'user-1',
      type: 'access',
      userSessionId: 'session-123',
      userPermissions: [],
      version: 2,
      userId: 'user-1',
      iat: 123456,
      exp: 123999,
    };

    userSession = {
      getAccessTokenVersion: vi.fn().mockReturnValue(validPayload.version),
    } as unknown as Mocked<UserSession>;
  });

  it('should verify access token and return payload', async () => {
    accessTokenGenerator.verifyToken.mockReturnValue(validPayload);
    userSessionsRepository.findById.mockResolvedValue(userSession);

    const result = await useCase.execute(request);
    expect(result).toEqual(validPayload);
    expect(accessTokenGenerator.verifyToken).toHaveBeenCalledWith(
      request.accessToken,
    );
    expect(userSessionsRepository.findById).toHaveBeenCalledWith(
      validPayload.userSessionId,
    );
  });

  it('should throw CheckAccessTokenUseCaseError if access token type is not "access"', async () => {
    accessTokenGenerator.verifyToken.mockReturnValue({
      ...validPayload,
      type: 'refresh',
    });

    await expect(useCase.execute(request)).rejects.toBeInstanceOf(
      CheckAccessTokenUseCaseError,
    );
    expect(userSessionsRepository.findById).not.toHaveBeenCalled();
  });

  it('should throw AuthUserSessionNotFoundError if user session does not exist', async () => {
    accessTokenGenerator.verifyToken.mockReturnValue(validPayload);
    userSessionsRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(request)).rejects.toBeInstanceOf(
      AuthUserSessionNotFoundError,
    );
  });

  it('should throw AuthAccessTokenVersionMismatchError if access token version does not match user session version', async () => {
    accessTokenGenerator.verifyToken.mockReturnValue(validPayload);
    userSessionsRepository.findById.mockResolvedValue({
      getAccessTokenVersion: vi.fn().mockReturnValue(validPayload.version + 1),
    } as unknown as Mocked<UserSession>);

    await expect(useCase.execute(request)).rejects.toBeInstanceOf(
      AuthAccessTokenVersionMismatchError,
    );
  });

  it('should throw CheckAccessTokenUseCaseError on unexpected error', async () => {
    accessTokenGenerator.verifyToken.mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    await expect(useCase.execute(request)).rejects.toBeInstanceOf(
      CheckAccessTokenUseCaseError,
    );
  });
});
