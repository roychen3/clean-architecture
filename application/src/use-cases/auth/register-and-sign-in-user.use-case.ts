import { BaseError } from '@ca/core';

import {
  CreateUserUseCase,
  CreateUserRequestDTO,
} from '../users/create-user.use-case';

import { SignInUserUseCase, SignInUserResponseDTO } from './sign-in.use-case';

import { RegisterAndSignInUserUseCaseError } from './auth.errors';

export type RegisterAndSignInUserRequestDTO = CreateUserRequestDTO;

export type RegisterAndSignInUserResponseDTO = SignInUserResponseDTO;

export class RegisterAndSignInUserUseCase {
  private createUserUseCase: CreateUserUseCase;
  private signInUserUseCase: SignInUserUseCase;

  constructor(options: {
    registerUserUseCase: CreateUserUseCase;
    signInUserUseCase: SignInUserUseCase;
  }) {
    this.createUserUseCase = options.registerUserUseCase;
    this.signInUserUseCase = options.signInUserUseCase;
  }

  async execute(
    request: RegisterAndSignInUserRequestDTO,
  ): Promise<RegisterAndSignInUserResponseDTO> {
    try {
      const user = await this.createUserUseCase.execute(request);
      const signInResult = await this.signInUserUseCase.execute({
        email: request.email,
        password: request.password,
      });
      return {
        accessToken: signInResult.accessToken,
        refreshToken: signInResult.refreshToken,
        user,
      };
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new RegisterAndSignInUserUseCaseError(
        error instanceof Error ? error : undefined,
      );
    }
  }
}
