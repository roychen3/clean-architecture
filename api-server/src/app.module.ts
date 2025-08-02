import { Global, Module } from '@nestjs/common';

import { AppPermissionService } from '@ca/application';
import { PrismaRolePermissionsRepository } from '@ca/database';

import { PrismaService } from './database/prisma.service';

import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { MeModule } from './modules/me/me.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { ArticlesModule } from './modules/articles/articles.module';
import { SystemModule } from './modules/system/system.module';

@Global()
@Module({
  imports: [
    AuthModule,
    UsersModule,
    MeModule,
    PermissionsModule,
    ArticlesModule,
    SystemModule,
  ],
  providers: [
    PrismaService,
    {
      provide: AppPermissionService,
      inject: [PrismaService],
      useFactory: (prismaService: PrismaService) => {
        const rolePermissionsRepository = new PrismaRolePermissionsRepository(
          prismaService,
        );
        return new AppPermissionService(rolePermissionsRepository);
      },
    },
  ],
  exports: [PrismaService, AppPermissionService],
})
export class AppModule {}
