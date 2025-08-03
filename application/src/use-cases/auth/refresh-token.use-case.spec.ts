import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { AuthenticationError, UserSession } from '@ca/core';

import { UserSessionsRepository } from '../../repositories';
import {
  AccessTokenPayload,
  BaseVerifyPayload,
  TokenGenerator,
} from '../../services';

import {
  AuthInvalidAccessTokenError,
  AuthUserSessionNotFoundError,
  RefreshTokenUseCaseError,
} from './auth.errors';
import {
  RefreshTokenUseCase,
  RefreshTokenRequestDTO,
} from './refresh-token.use-case';

describe('RefreshTokenUseCase', () => {
  let userSessionsRepository: Mocked<UserSessionsRepository>;
  let accessTokenGenerator: Mocked<TokenGenerator>;
  let useCase: RefreshTokenUseCase;
  let request: RefreshTokenRequestDTO;
  let accessTokenPayload: BaseVerifyPayload & AccessTokenPayload;
  let userSession: Mocked<UserSession>;

  beforeEach(() => {
    userSessionsRepository = {
      findById: vi.fn(),
      update: vi.fn(),
    } as unknown as Mocked<UserSessionsRepository>;

    accessTokenGenerator = {
      verifyToken: vi.fn(),
      decodeToken: vi.fn(),
      generateToken: vi.fn(),
    } as unknown as Mocked<TokenGenerator>;

    useCase = new RefreshTokenUseCase({
      userSessionsRepository,
      accessTokenGenerator,
    });

    request = {
      accessToken: 'mock-access-token',
    };

    accessTokenPayload = {
      sub: 'user-1',
      iat: Date.now(),
      exp: Date.now() + 1000 * 60 * 60,
      type: 'access',
      userId: 'user-1',
      userSessionId: 'session-1',
      userPermissions: [],
      version: 2,
    };

    userSession = {
      getId: vi.fn(() => 'session-1'),
      getAccessTokenVersion: vi.fn(() => accessTokenPayload.version),
      incrementAccessTokenVersion: vi.fn(),
    } as unknown as Mocked<UserSession>;
  });

  it('should verify access token and return new access token', async () => {
    userSession.getAccessTokenVersion.mockReturnValueOnce(
      accessTokenPayload.version,
    );
    userSession.getAccessTokenVersion.mockReturnValueOnce(
      accessTokenPayload.version + 1,
    );
    accessTokenGenerator.verifyToken.mockReturnValue(accessTokenPayload);
    userSessionsRepository.findById.mockResolvedValue(userSession);
    accessTokenGenerator.generateToken.mockReturnValue('new-access-token');

    const result = await useCase.execute(request);
    expect(result).toEqual({ accessToken: 'new-access-token' });
    expect(accessTokenGenerator.verifyToken).toHaveBeenCalledWith(
      request.accessToken,
    );
    expect(userSessionsRepository.findById).toHaveBeenCalledWith('session-1');
    expect(userSession.incrementAccessTokenVersion).toHaveBeenCalled();
    expect(userSessionsRepository.update).toHaveBeenCalledWith(userSession);
    expect(accessTokenGenerator.generateToken).toHaveBeenCalledWith({
      type: accessTokenPayload.type,
      userId: accessTokenPayload.userId,
      userSessionId: accessTokenPayload.userSessionId,
      userPermissions: accessTokenPayload.userPermissions,
      version: accessTokenPayload.version + 1,
    });
  });

  it('should throw AuthInvalidAccessTokenError if access token is invalid', async () => {
    accessTokenGenerator.verifyToken.mockImplementation(() => {
      throw new AuthenticationError();
    });
    await expect(useCase.execute(request)).rejects.toBeInstanceOf(
      AuthInvalidAccessTokenError,
    );
    expect(userSessionsRepository.findById).not.toHaveBeenCalled();
    expect(userSession.incrementAccessTokenVersion).not.toHaveBeenCalled();
    expect(userSessionsRepository.update).not.toHaveBeenCalled();
    expect(accessTokenGenerator.generateToken).not.toHaveBeenCalled();
  });

  it('should throw AuthUserSessionNotFoundError if user session does not exist', async () => {
    accessTokenGenerator.verifyToken.mockReturnValue(accessTokenPayload);
    userSessionsRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(request)).rejects.toBeInstanceOf(
      AuthUserSessionNotFoundError,
    );
    expect(userSessionsRepository.findById).toHaveBeenCalled();
    expect(userSession.incrementAccessTokenVersion).not.toHaveBeenCalled();
    expect(userSessionsRepository.update).not.toHaveBeenCalled();
    expect(accessTokenGenerator.generateToken).not.toHaveBeenCalled();
  });

  it('should throw AuthInvalidAccessTokenError if access token version does not match user session version', async () => {
    accessTokenGenerator.verifyToken.mockReturnValue(accessTokenPayload);
    userSessionsRepository.findById.mockResolvedValue(userSession);
    userSession.getAccessTokenVersion.mockReturnValue(99);

    await expect(useCase.execute(request)).rejects.toBeInstanceOf(
      AuthInvalidAccessTokenError,
    );
    expect(userSessionsRepository.findById).toHaveBeenCalled();
    expect(userSession.incrementAccessTokenVersion).not.toHaveBeenCalled();
    expect(userSessionsRepository.update).not.toHaveBeenCalled();
    expect(accessTokenGenerator.generateToken).not.toHaveBeenCalled();
  });

  it('should throw RefreshTokenUseCaseError on unexpected error', async () => {
    accessTokenGenerator.verifyToken.mockImplementation(() => {
      throw new Error('Unexpected error');
    });

    await expect(useCase.execute(request)).rejects.toBeInstanceOf(
      RefreshTokenUseCaseError,
    );
  });

  it('should return access token payload when access token is not valid but can be decoded', async () => {
    accessTokenGenerator.verifyToken.mockImplementation(() => {
      throw { code: 'TOKEN_EXPIRED_ERROR' };
    });
    accessTokenGenerator.decodeToken.mockReturnValue(accessTokenPayload);

    userSessionsRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute(request)).rejects.toBeInstanceOf(
      AuthUserSessionNotFoundError,
    );
    // The real purpose of this test is to verify the invocation of decodeToken
    expect(accessTokenGenerator.decodeToken).toHaveBeenCalledWith(
      request.accessToken,
    );
  });
});
