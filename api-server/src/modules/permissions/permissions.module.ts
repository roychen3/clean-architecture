import { Module } from '@nestjs/common';

import { RolesModule } from './roles/roles.module';
import { ResourcesModule } from './resources/resources.module';
import { ActionsModule } from './actions/actions.module';
import { PermissionsController } from './permissions.controller';
import { rolePermissionsUseCaseProviders } from './permissions.use-cases.provider';

@Module({
  imports: [RolesModule, ResourcesModule, ActionsModule],
  controllers: [PermissionsController],
  providers: [...rolePermissionsUseCaseProviders],
})
export class PermissionsModule {}
