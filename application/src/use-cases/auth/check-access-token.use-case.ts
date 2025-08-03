import { BaseError } from '@ca/core';

import { UserSessionsRepository } from '../../repositories';
import {
  BaseVerifyPayload,
  AccessTokenPayload,
  TokenGenerator,
} from '../../services';

import {
  CheckAccessTokenUseCaseError,
  AuthUserSessionNotFoundError,
  AuthAccessTokenVersionMismatchError,
} from './auth.errors';

export type CheckAccessTokenRequestDTO = {
  accessToken: string;
};

export type CheckAccessTokenResponseDTO = BaseVerifyPayload &
  AccessTokenPayload;

export class CheckAccessTokenUseCase {
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
    request: CheckAccessTokenRequestDTO,
  ): Promise<CheckAccessTokenResponseDTO> {
    try {
      const accessTokenPayload = this.accessTokenGenerator.verifyToken(
        request.accessToken,
      );
      if (accessTokenPayload.type !== 'access') {
        throw new CheckAccessTokenUseCaseError();
      }

      const userSession = await this.userSessionsRepository.findById(
        accessTokenPayload.userSessionId,
      );
      if (!userSession) {
        throw new AuthUserSessionNotFoundError();
      }
      if (userSession.getAccessTokenVersion() !== accessTokenPayload.version) {
        throw new AuthAccessTokenVersionMismatchError();
      }
      return accessTokenPayload;
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new CheckAccessTokenUseCaseError(
        error instanceof Error ? error : undefined,
      );
    }
  }
}
