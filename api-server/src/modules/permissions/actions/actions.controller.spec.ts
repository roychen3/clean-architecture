import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../../../database/prisma.service';

import { ActionsController } from './actions.controller';
import { actionsUseCaseProviders } from './actions.use-cases.provider';

describe('RolesController', () => {
  let controller: ActionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActionsController],
      providers: [PrismaService, ...actionsUseCaseProviders],
    }).compile();

    controller = module.get<ActionsController>(ActionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
