import { Module } from '@nestjs/common';

import { BcryptPasswordHasher } from '@ca/application';

import { MeController } from './me.controller';
import { meUseCaseProviders } from './me.use-cases.provider';

@Module({
  controllers: [MeController],
  providers: [BcryptPasswordHasher, ...meUseCaseProviders],
})
export class MeModule {}
