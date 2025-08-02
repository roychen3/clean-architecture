import { Provider } from '@nestjs/common';

import { CheckSystemInitializationUseCase } from '@ca/application';
import {
  PrismaUsersRepository,
  PrismaRolesRepository,
  PrismaRolePermissionsRepository,
} from '@ca/database';

import { PrismaService } from '../../database/prisma.service';

export const systemUseCaseProviders: Provider[] = [
  {
    provide: CheckSystemInitializationUseCase,
    inject: [PrismaService],
    useFactory: (prismaService: PrismaService) => {
      const usersRepository = new PrismaUsersRepository(prismaService);
      const rolesRepository = new PrismaRolesRepository(prismaService);
      const rolePermissionsRepository = new PrismaRolePermissionsRepository(
        prismaService,
      );
      return new CheckSystemInitializationUseCase({
        usersRepository,
        rolesRepository,
        rolePermissionsRepository,
      });
    },
  },
];
