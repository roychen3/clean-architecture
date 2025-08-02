import { Test, TestingModule } from '@nestjs/testing';

import { BcryptPasswordHasher } from '@ca/application';

import { PrismaService } from '../../database/prisma.service';

import { UsersController } from './users.controller';
import { usersUseCaseProviders } from './users.use-cases.provider';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        PrismaService,
        BcryptPasswordHasher,
        ...usersUseCaseProviders,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
