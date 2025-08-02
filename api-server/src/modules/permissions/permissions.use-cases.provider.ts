import { Provider } from '@nestjs/common';

import {
  SetRolePermissionUseCase,
  GetRolePermissionsUseCase,
  SetUserRolesUseCase,
  GetUserRolesUseCase,
  AppPermissionService,
} from '@ca/application';
import {
  PrismaRolePermissionsRepository,
  PrismaUserSessionsRepository,
} from '@ca/database';

import { PrismaService } from '../../database/prisma.service';

export const rolePermissionsUseCaseProviders: Provider[] = [
  {
    provide: SetRolePermissionUseCase,
    inject: [PrismaService, AppPermissionService],
    useFactory: (
      prismaService: PrismaService,
      permissionService: AppPermissionService,
    ) => {
      const rolePermissionsRepository = new PrismaRolePermissionsRepository(
        prismaService,
      );
      const userSessionsRepository = new PrismaUserSessionsRepository(
        prismaService,
      );
      return new SetRolePermissionUseCase({
        rolePermissionsRepository,
        userSessionsRepository,
        permissionService,
      });
    },
  },
  {
    provide: GetRolePermissionsUseCase,
    inject: [PrismaService, AppPermissionService],
    useFactory: (
      prismaService: PrismaService,
      permissionService: AppPermissionService,
    ) => {
      const rolePermissionsRepository = new PrismaRolePermissionsRepository(
        prismaService,
      );
      return new GetRolePermissionsUseCase({
        rolePermissionsRepository,
        permissionService,
      });
    },
  },
  {
    provide: SetUserRolesUseCase,
    inject: [PrismaService, AppPermissionService],
    useFactory: (
      prismaService: PrismaService,
      permissionService: AppPermissionService,
    ) => {
      const rolePermissionsRepository = new PrismaRolePermissionsRepository(
        prismaService,
      );
      const userSessionsRepository = new PrismaUserSessionsRepository(
        prismaService,
      );
      return new SetUserRolesUseCase({
        rolePermissionsRepository,
        userSessionsRepository,
        permissionService,
      });
    },
  },
  {
    provide: GetUserRolesUseCase,
    inject: [PrismaService, AppPermissionService],
    useFactory: (
      prismaService: PrismaService,
      permissionService: AppPermissionService,
    ) => {
      const rolePermissionsRepository = new PrismaRolePermissionsRepository(
        prismaService,
      );
      return new GetUserRolesUseCase({
        rolePermissionsRepository,
        permissionService,
      });
    },
  },
];
