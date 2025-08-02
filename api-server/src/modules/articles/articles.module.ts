import { Module } from '@nestjs/common';

import { ArticlesController } from './articles.controller';
import { articlesUseCaseProviders } from './articles.use-cases.provider';

@Module({
  controllers: [ArticlesController],
  providers: [...articlesUseCaseProviders],
})
export class ArticlesModule {}
