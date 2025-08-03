import { User, UserSession, BaseError } from '@ca/core';

import {
  UsersRepository,
  UserSessionsRepository,
  RolePermissionsRepository,
} from '../../repositories';
import { PasswordHasher, TokenGenerator } from '../../services';

import { SignInUseCaseError, AuthInvalidCredentialsError } from './auth.errors';

export type SignInUserRequestDTO = {
  email: string;
  password: string;
};

export type SignInUserResponseDTO = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export class SignInUserUseCase {
  private usersRepository: UsersRepository;
  private userSessionsRepository: UserSessionsRepository;
  private rolePermissionsRepository: RolePermissionsRepository;
  private passwordHasher: PasswordHasher;
  private accessTokenGenerator: TokenGenerator;
  private refreshTokenGenerator: TokenGenerator;

  constructor(options: {
    usersRepository: UsersRepository;
    userSessionsRepository: UserSessionsRepository;
    rolePermissionsRepository: RolePermissionsRepository;
    passwordHasher: PasswordHasher;
    accessTokenGenerator: TokenGenerator;
    refreshTokenGenerator: TokenGenerator;
  }) {
    this.usersRepository = options.usersRepository;
    this.userSessionsRepository = options.userSessionsRepository;
    this.rolePermissionsRepository = options.rolePermissionsRepository;
    this.passwordHasher = options.passwordHasher;
    this.accessTokenGenerator = options.accessTokenGenerator;
    this.refreshTokenGenerator = options.refreshTokenGenerator;
  }

  async execute(request: SignInUserRequestDTO): Promise<SignInUserResponseDTO> {
    try {
      const { email, password } = request;

      const user = await this.usersRepository.findByEmail(email);
      if (!user) {
        throw new AuthInvalidCredentialsError();
      }

      const isPasswordValidated = await this.passwordHasher.compare(
        password,
        user.getPassword(),
      );
      if (!isPasswordValidated) {
        throw new AuthInvalidCredentialsError();
      }

      const refreshToken = this.refreshTokenGenerator.generateToken({
        type: 'refresh',
        userId: user.getId(),
      });
      const userSession = new UserSession({
        userId: user.getId(),
        refreshToken,
      });
      const userPermissions =
        await this.rolePermissionsRepository.getUserPermissions(user.getId());
      const accessToken = this.accessTokenGenerator.generateToken({
        type: 'access',
        userId: user.getId(),
        userSessionId: userSession.getId(),
        userPermissions: userPermissions,
        version: userSession.getAccessTokenVersion(),
      });
      this.userSessionsRepository.create(userSession);

      return {
        accessToken,
        refreshToken,
        user,
      };
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new SignInUseCaseError(error instanceof Error ? error : undefined);
    }
  }
}
