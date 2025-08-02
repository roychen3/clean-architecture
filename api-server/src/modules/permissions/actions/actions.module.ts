import { Module } from '@nestjs/common';

import { ActionsController } from './actions.controller';
import { actionsUseCaseProviders } from './actions.use-cases.provider';

@Module({
  controllers: [ActionsController],
  providers: [...actionsUseCaseProviders],
})
export class ActionsModule {}
