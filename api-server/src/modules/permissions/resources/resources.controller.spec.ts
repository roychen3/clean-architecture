import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../../../database/prisma.service';

import { ResourcesController } from './resources.controller';
import { resourcesUseCaseProviders } from './resources.use-cases.provider';

describe('RolesController', () => {
  let controller: ResourcesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ResourcesController],
      providers: [PrismaService, ...resourcesUseCaseProviders],
    }).compile();

    controller = module.get<ResourcesController>(ResourcesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
