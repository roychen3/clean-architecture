import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../../database/prisma.service';

import { AuthController } from './auth.controller';
import { authUseCasesProviders } from './auth.use-cases.provider';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [PrismaService, ...authUseCasesProviders],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
