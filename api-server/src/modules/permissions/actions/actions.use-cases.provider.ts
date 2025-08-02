import { Provider } from '@nestjs/common';

import {
  GetAllPermissionActionsUseCase,
  AppPermissionService,
} from '@ca/application';
import { PrismaPermissionActionsRepository } from '@ca/database';

import { PrismaService } from '../../../database/prisma.service';

export const actionsUseCaseProviders: Provider[] = [
  {
    provide: GetAllPermissionActionsUseCase,
    inject: [PrismaService, AppPermissionService],
    useFactory: (
      prismaService: PrismaService,
      permissionService: AppPermissionService,
    ) => {
      const permissionActionsRepository = new PrismaPermissionActionsRepository(
        prismaService,
      );
      return new GetAllPermissionActionsUseCase({
        permissionActionsRepository,
        permissionService,
      });
    },
  },
];
