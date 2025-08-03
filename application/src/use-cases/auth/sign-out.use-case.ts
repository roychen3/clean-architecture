import { AuthenticationError, BaseError } from '@ca/core';

import { UserSessionsRepository } from '../../repositories';
import {
  BaseVerifyPayload,
  AccessTokenPayload,
  TokenGenerator,
} from '../../services';

import {
  SignOutUseCaseError,
  AuthInvalidAccessTokenError,
} from './auth.errors';

export type SignOutRequestDTO = {
  accessToken: string;
};

export type SignOutResponseDTO = void;

export class SignOutUseCase {
  private userSessionsRepository: UserSessionsRepository;
  private accessTokenGenerator: TokenGenerator;

  constructor(options: {
    userSessionsRepository: UserSessionsRepository;
    accessTokenGenerator: TokenGenerator;
  }) {
    this.userSessionsRepository = options.userSessionsRepository;
    this.accessTokenGenerator = options.accessTokenGenerator;
  }

  async execute(request: SignOutRequestDTO): Promise<SignOutResponseDTO> {
    try {
      const accessTokenPayload = this.verifyAccessToken(request.accessToken);
      await this.userSessionsRepository.delete(
        accessTokenPayload.userSessionId,
      );
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new SignOutUseCaseError(error instanceof Error ? error : undefined);
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
