import { Provider } from '@nestjs/common';

import {
  CreateUserUseCase,
  CreateUserWithPermissionUseCase,
  GetUserUseCase,
  GetUsersUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  AppPermissionService,
  BcryptPasswordHasher,
} from '@ca/application';
import {
  PrismaUsersRepository,
  PrismaRolesRepository,
  PrismaRolePermissionsRepository,
} from '@ca/database';

import { PrismaService } from '../../database/prisma.service';

export const usersUseCaseProviders: Provider[] = [
  {
    provide: CreateUserWithPermissionUseCase,
    inject: [PrismaService, AppPermissionService, BcryptPasswordHasher],
    useFactory: (
      prismaService: PrismaService,
      permissionService: AppPermissionService,
      passwordHasher: BcryptPasswordHasher,
    ) => {
      const usersRepository = new PrismaUsersRepository(prismaService);
      const rolesRepository = new PrismaRolesRepository(prismaService);
      const rolePermissionsRepository = new PrismaRolePermissionsRepository(
        prismaService,
      );
      const createUserUseCase = new CreateUserUseCase({
        usersRepository,
        rolesRepository,
        rolePermissionsRepository,
        passwordHasher,
      });
      return new CreateUserWithPermissionUseCase({
        permissionService,
        createUserUseCase,
      });
    },
  },
  {
    provide: GetUserUseCase,
    inject: [PrismaService, AppPermissionService],
    useFactory: (
      prismaService: PrismaService,
      permissionService: AppPermissionService,
    ) => {
      const usersRepository = new PrismaUsersRepository(prismaService);
      return new GetUserUseCase({ usersRepository, permissionService });
    },
  },
  {
    provide: GetUsersUseCase,
    inject: [PrismaService, AppPermissionService],
    useFactory: (
      prismaService: PrismaService,
      permissionService: AppPermissionService,
    ) => {
      const usersRepository = new PrismaUsersRepository(prismaService);
      return new GetUsersUseCase({ usersRepository, permissionService });
    },
  },
  {
    provide: UpdateUserUseCase,
    inject: [PrismaService, AppPermissionService],
    useFactory: (
      prismaService: PrismaService,
      permissionService: AppPermissionService,
    ) => {
      const usersRepository = new PrismaUsersRepository(prismaService);
      return new UpdateUserUseCase({ usersRepository, permissionService });
    },
  },
  {
    provide: DeleteUserUseCase,
    inject: [PrismaService, AppPermissionService],
    useFactory: (
      prismaService: PrismaService,
      permissionService: AppPermissionService,
    ) => {
      const usersRepository = new PrismaUsersRepository(prismaService);
      return new DeleteUserUseCase({ usersRepository, permissionService });
    },
  },
];
