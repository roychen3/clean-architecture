import { Module } from '@nestjs/common';

import { BcryptPasswordHasher } from '@ca/application';

import { UsersController } from './users.controller';
import { usersUseCaseProviders } from './users.use-cases.provider';

@Module({
  controllers: [UsersController],
  providers: [BcryptPasswordHasher, ...usersUseCaseProviders],
})
export class UsersModule {}
