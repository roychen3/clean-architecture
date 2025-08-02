import { Provider } from '@nestjs/common';

import {
  GetMeProfileUseCase,
  UpdateMeProfileUseCase,
  ChangeMePasswordUseCase,
  DeleteMeUseCase,
  AppPermissionService,
  BcryptPasswordHasher,
} from '@ca/application';
import { PrismaUsersRepository } from '@ca/database';

import { PrismaService } from '../../database/prisma.service';

export const meUseCaseProviders: Provider[] = [
  {
    provide: GetMeProfileUseCase,
    inject: [PrismaService, AppPermissionService],
    useFactory: (
      prismaService: PrismaService,
      permissionService: AppPermissionService,
    ) => {
      const usersRepository = new PrismaUsersRepository(prismaService);
      return new GetMeProfileUseCase({ usersRepository, permissionService });
    },
  },
  {
    provide: UpdateMeProfileUseCase,
    inject: [PrismaService, AppPermissionService],
    useFactory: (
      prismaService: PrismaService,
      permissionService: AppPermissionService,
    ) => {
      const usersRepository = new PrismaUsersRepository(prismaService);
      return new UpdateMeProfileUseCase({
        usersRepository,
        permissionService,
      });
    },
  },
  {
    provide: ChangeMePasswordUseCase,
    inject: [PrismaService, BcryptPasswordHasher, AppPermissionService],
    useFactory: (
      prismaService: PrismaService,
      passwordHasher: BcryptPasswordHasher,
      permissionService: AppPermissionService,
    ) => {
      const usersRepository = new PrismaUsersRepository(prismaService);
      return new ChangeMePasswordUseCase({
        usersRepository,
        passwordHasher,
        permissionService,
      });
    },
  },
  {
    provide: DeleteMeUseCase,
    inject: [PrismaService, BcryptPasswordHasher, AppPermissionService],
    useFactory: (
      prismaService: PrismaService,
      passwordHasher: BcryptPasswordHasher,
      permissionService: AppPermissionService,
    ) => {
      const usersRepository = new PrismaUsersRepository(prismaService);
      return new DeleteMeUseCase({
        usersRepository,
        passwordHasher,
        permissionService,
      });
    },
  },
];
