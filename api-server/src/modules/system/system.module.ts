import { Module } from '@nestjs/common';

import { SystemInitializationService } from './system-initialization.service';
import { systemUseCaseProviders } from './system.use-cases.provider';

@Module({
  providers: [...systemUseCaseProviders, SystemInitializationService],
  exports: [SystemInitializationService],
})
export class SystemModule {}
