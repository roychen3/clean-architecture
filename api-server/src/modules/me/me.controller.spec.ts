import { Test, TestingModule } from '@nestjs/testing';

import { BcryptPasswordHasher } from '@ca/application';

import { PrismaService } from '../../database/prisma.service';

import { MeController } from './me.controller';
import { meUseCaseProviders } from './me.use-cases.provider';

describe('MeController', () => {
  let controller: MeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MeController],
      providers: [PrismaService, BcryptPasswordHasher, ...meUseCaseProviders],
    }).compile();

    controller = module.get<MeController>(MeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
