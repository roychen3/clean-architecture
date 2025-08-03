import { AuthenticationError, BaseError } from '@ca/core';

import { UserSessionsRepository } from '../../repositories';
import {
  BaseVerifyPayload,
  AccessTokenPayload,
  TokenGenerator,
} from '../../services';

import {
  RefreshTokenUseCaseError,
  AuthInvalidAccessTokenError,
  AuthUserSessionNotFoundError,
} from './auth.errors';

export type RefreshTokenRequestDTO = {
  accessToken: string;
};

export type RefreshTokenResponseDTO = {
  accessToken: string;
};

export class RefreshTokenUseCase {
  private userSessionsRepository: UserSessionsRepository;
  private accessTokenGenerator: TokenGenerator;

  constructor(options: {
    userSessionsRepository: UserSessionsRepository;
    accessTokenGenerator: TokenGenerator;
  }) {
    this.userSessionsRepository = options.userSessionsRepository;
    this.accessTokenGenerator = options.accessTokenGenerator;
  }

  async execute(
    request: RefreshTokenRequestDTO,
  ): Promise<RefreshTokenResponseDTO> {
    try {
      const accessTokenPayload = this.verifyAccessToken(request.accessToken);

      const userSession = await this.userSessionsRepository.findById(
        accessTokenPayload.userSessionId,
      );
      if (!userSession) {
        throw new AuthUserSessionNotFoundError();
      }

      if (accessTokenPayload.version !== userSession.getAccessTokenVersion()) {
        throw new AuthInvalidAccessTokenError();
      }

      userSession.incrementAccessTokenVersion();
      await this.userSessionsRepository.update(userSession);
      const accessToken = this.accessTokenGenerator.generateToken({
        type: 'access',
        userId: accessTokenPayload.userId,
        userSessionId: userSession.getId(),
        userPermissions: accessTokenPayload.userPermissions,
        version: userSession.getAccessTokenVersion(),
      });

      return {
        accessToken,
      };
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new RefreshTokenUseCaseError(
        error instanceof Error ? error : undefined,
      );
    }
  }

  private verifyAccessToken(
    accessToken: string,
  ): BaseVerifyPayload & AccessTokenPayload {
    try {
      return this.accessTokenGenerator.verifyToken(
        accessToken,
      ) as BaseVerifyPayload & AccessTokenPayload;
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw new AuthInvalidAccessTokenError(error);
      }
      return this.accessTokenGenerator.decodeToken(
        accessToken,
      ) as BaseVerifyPayload & AccessTokenPayload;
    }
  }
}
