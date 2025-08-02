import { Provider } from '@nestjs/common';

import {
  CreateArticleUseCase,
  GetArticlesUseCase,
  GetArticleUseCase,
  UpdateArticleUseCase,
  DeleteArticleUseCase,
  AppPermissionService,
} from '@ca/application';
import { PrismaUsersRepository, PrismaArticleRepository } from '@ca/database';

import { PrismaService } from '../../database/prisma.service';

export const articlesUseCaseProviders: Provider[] = [
  {
    provide: CreateArticleUseCase,
    inject: [PrismaService, AppPermissionService],
    useFactory: (
      prismaService: PrismaService,
      permissionService: AppPermissionService,
    ) => {
      const usersRepository = new PrismaUsersRepository(prismaService);
      const articlesRepository = new PrismaArticleRepository(prismaService);
      return new CreateArticleUseCase({
        usersRepository,
        articlesRepository,
        permissionService,
      });
    },
  },
  {
    provide: GetArticlesUseCase,
    inject: [PrismaService],
    useFactory: (prismaService: PrismaService) => {
      const articlesRepository = new PrismaArticleRepository(prismaService);
      return new GetArticlesUseCase({ articlesRepository });
    },
  },
  {
    provide: GetArticleUseCase,
    inject: [PrismaService],
    useFactory: (prismaService: PrismaService) => {
      const articlesRepository = new PrismaArticleRepository(prismaService);
      return new GetArticleUseCase({ articlesRepository });
    },
  },
  {
    provide: UpdateArticleUseCase,
    inject: [PrismaService, AppPermissionService],
    useFactory: (
      prismaService: PrismaService,
      permissionService: AppPermissionService,
    ) => {
      const articlesRepository = new PrismaArticleRepository(prismaService);
      return new UpdateArticleUseCase({
        articlesRepository,
        permissionService,
      });
    },
  },
  {
    provide: DeleteArticleUseCase,
    inject: [PrismaService, AppPermissionService],
    useFactory: (
      prismaService: PrismaService,
      permissionService: AppPermissionService,
    ) => {
      const articlesRepository = new PrismaArticleRepository(prismaService);
      return new DeleteArticleUseCase({
        articlesRepository,
        permissionService,
      });
    },
  },
];
