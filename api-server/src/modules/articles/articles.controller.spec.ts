import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from '../../database/prisma.service';

import { ArticlesController } from './articles.controller';
import { articlesUseCaseProviders } from './articles.use-cases.provider';

describe('ArticlesController', () => {
  let controller: ArticlesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesController],
      providers: [PrismaService, ...articlesUseCaseProviders],
    }).compile();

    controller = module.get<ArticlesController>(ArticlesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
