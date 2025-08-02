import { Provider } from '@nestjs/common';

import {
  GetAllPermissionResourcesUseCase,
  AppPermissionService,
} from '@ca/application';
import { PrismaPermissionResourcesRepository } from '@ca/database';

import { PrismaService } from '../../../database/prisma.service';

export const resourcesUseCaseProviders: Provider[] = [
  {
    provide: GetAllPermissionResourcesUseCase,
    inject: [PrismaService, AppPermissionService],
    useFactory: (
      prismaService: PrismaService,
      permissionService: AppPermissionService,
    ) => {
      const permissionResourcesRepository =
        new PrismaPermissionResourcesRepository(prismaService);
      return new GetAllPermissionResourcesUseCase({
        permissionResourcesRepository,
        permissionService,
      });
    },
  },
];
