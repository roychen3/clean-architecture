import { Module } from '@nestjs/common';

import { RolesController } from './roles.controller';
import { rolesUseCaseProviders } from './roles.use-cases.provider';

@Module({
  controllers: [RolesController],
  providers: [...rolesUseCaseProviders],
})
export class RolesModule {}
