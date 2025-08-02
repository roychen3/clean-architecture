import { Module } from '@nestjs/common';

import { ResourcesController } from './resources.controller';
import { resourcesUseCaseProviders } from './resources.use-cases.provider';

@Module({
  controllers: [ResourcesController],
  providers: [...resourcesUseCaseProviders],
})
export class ResourcesModule {}
