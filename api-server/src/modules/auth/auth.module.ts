import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { NestJwtTokenGenerator } from '@ca/application';

import { authUseCasesProviders } from './auth.use-cases.provider';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';

@Module({
  providers: [
    ...authUseCasesProviders,
    NestJwtTokenGenerator,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
