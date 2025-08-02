import { Provider } from '@nestjs/common';

import {
  SignInUserUseCase,
  CheckAccessTokenUseCase,
  RefreshTokenUseCase,
  CreateUserUseCase,
  RegisterAndSignInUserUseCase,
  SignOutUseCase,
} from '@ca/application';
import {
  PrismaUsersRepository,
  PrismaUserSessionsRepository,
  PrismaRolesRepository,
  PrismaRolePermissionsRepository,
} from '@ca/database';
import { BcryptPasswordHasher, NestJwtTokenGenerator } from '@ca/application';

import { PrismaService } from '../../database/prisma.service';

import { jwtConstants } from './auth.constants';

export const authUseCasesProviders: Provider[] = [
  {
    provide: SignInUserUseCase,
    inject: [PrismaService],
    useFactory: (prismaService: PrismaService) => {
      const usersRepository = new PrismaUsersRepository(prismaService);
      const userSessionsRepository = new PrismaUserSessionsRepository(
        prismaService,
      );
      const rolePermissionsRepository = new PrismaRolePermissionsRepository(
        prismaService,
      );
      const passwordHasher = new BcryptPasswordHasher();
      const accessJwtTokenGenerator = new NestJwtTokenGenerator({
        secret: jwtConstants.accessSecret,
        expiresIn: jwtConstants.accessExpiresIn,
      });
      const refreshJwtTokenGenerator = new NestJwtTokenGenerator({
        secret: jwtConstants.refreshSecret,
        expiresIn: jwtConstants.refreshExpiresIn,
      });
      return new SignInUserUseCase({
        usersRepository,
        userSessionsRepository,
        rolePermissionsRepository,
        passwordHasher,
        accessTokenGenerator: accessJwtTokenGenerator,
        refreshTokenGenerator: refreshJwtTokenGenerator,
      });
    },
  },
  {
    provide: CheckAccessTokenUseCase,
    inject: [PrismaService],
    useFactory: (prismaService: PrismaService) => {
      const userSessionsRepository = new PrismaUserSessionsRepository(
        prismaService,
      );
      const accessJwtTokenGenerator = new NestJwtTokenGenerator({
        secret: jwtConstants.accessSecret,
        expiresIn: jwtConstants.accessExpiresIn,
      });
      return new CheckAccessTokenUseCase({
        userSessionsRepository,
        accessTokenGenerator: accessJwtTokenGenerator,
      });
    },
  },
  {
    provide: RefreshTokenUseCase,
    inject: [PrismaService],
    useFactory: (prismaService: PrismaService) => {
      const userSessionsRepository = new PrismaUserSessionsRepository(
        prismaService,
      );
      const accessJwtTokenGenerator = new NestJwtTokenGenerator({
        secret: jwtConstants.accessSecret,
        expiresIn: jwtConstants.accessExpiresIn,
      });
      return new RefreshTokenUseCase({
        userSessionsRepository,
        accessTokenGenerator: accessJwtTokenGenerator,
      });
    },
  },
  {
    provide: RegisterAndSignInUserUseCase,
    inject: [PrismaService, SignInUserUseCase],
    useFactory: (
      prismaService: PrismaService,
      signInUserUseCase: SignInUserUseCase,
    ) => {
      const usersRepository = new PrismaUsersRepository(prismaService);
      const rolesRepository = new PrismaRolesRepository(prismaService);
      const rolePermissionsRepository = new PrismaRolePermissionsRepository(
        prismaService,
      );
      const passwordHasher = new BcryptPasswordHasher();
      const registerUserUseCase = new CreateUserUseCase({
        usersRepository,
        rolesRepository,
        rolePermissionsRepository,
        passwordHasher,
      });
      return new RegisterAndSignInUserUseCase({
        registerUserUseCase,
        signInUserUseCase,
      });
    },
  },
  {
    provide: SignOutUseCase,
    inject: [PrismaService],
    useFactory: (prismaService: PrismaService) => {
      const userSessionsRepository = new PrismaUserSessionsRepository(
        prismaService,
      );
      const accessJwtTokenGenerator = new NestJwtTokenGenerator({
        secret: jwtConstants.accessSecret,
        expiresIn: jwtConstants.accessExpiresIn,
      });
      return new SignOutUseCase({
        userSessionsRepository,
        accessTokenGenerator: accessJwtTokenGenerator,
      });
    },
  },
];
