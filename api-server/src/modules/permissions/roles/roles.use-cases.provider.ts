import { Provider } from '@nestjs/common';

import {
  CreateRoleUseCase,
  GetAllRolesUseCase,
  GetRoleUseCase,
  UpdateRoleUseCase,
  DeleteRoleUseCase,
  AppPermissionService,
} from '@ca/application';
import { PrismaRolesRepository } from '@ca/database';

import { PrismaService } from '../../../database/prisma.service';

export const rolesUseCaseProviders: Provider[] = [
  {
    provide: CreateRoleUseCase,
    inject: [PrismaService, AppPermissionService],
    useFactory: (
      prismaService: PrismaService,
      permissionService: AppPermissionService,
    ) => {
      const rolesRepository = new PrismaRolesRepository(prismaService);
      return new CreateRoleUseCase({ rolesRepository, permissionService });
    },
  },
  {
    provide: GetAllRolesUseCase,
    inject: [PrismaService, AppPermissionService],
    useFactory: (
      prismaService: PrismaService,
      permissionService: AppPermissionService,
    ) => {
      const rolesRepository = new PrismaRolesRepository(prismaService);
      return new GetAllRolesUseCase({ rolesRepository, permissionService });
    },
  },
  {
    provide: GetRoleUseCase,
    inject: [PrismaService, AppPermissionService],
    useFactory: (
      prismaService: PrismaService,
      permissionService: AppPermissionService,
    ) => {
      const rolesRepository = new PrismaRolesRepository(prismaService);
      return new GetRoleUseCase({ rolesRepository, permissionService });
    },
  },
  {
    provide: UpdateRoleUseCase,
    inject: [PrismaService, AppPermissionService],
    useFactory: (
      prismaService: PrismaService,
      permissionService: AppPermissionService,
    ) => {
      const rolesRepository = new PrismaRolesRepository(prismaService);
      return new UpdateRoleUseCase({ rolesRepository, permissionService });
    },
  },
  {
    provide: DeleteRoleUseCase,
    inject: [PrismaService, AppPermissionService],
    useFactory: (
      prismaService: PrismaService,
      permissionService: AppPermissionService,
    ) => {
      const rolesRepository = new PrismaRolesRepository(prismaService);
      return new DeleteRoleUseCase({ rolesRepository, permissionService });
    },
  },
];
