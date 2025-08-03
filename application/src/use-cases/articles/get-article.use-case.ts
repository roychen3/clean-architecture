import { Article, BaseError } from '@ca/core';

import { ArticlesRepository } from '../../repositories';

import { ArticleNotFoundError, GetArticleError } from './articles.errors';

export type GetArticleRequestDTO = {
  id: string;
};

export type GetArticleResponseDTO = Article;

export class GetArticleUseCase {
  private articlesRepository: ArticlesRepository;

  constructor(options: { articlesRepository: ArticlesRepository }) {
    this.articlesRepository = options.articlesRepository;
  }

  async execute(request: GetArticleRequestDTO): Promise<GetArticleResponseDTO> {
    try {
      const article = await this.articlesRepository.findById(request.id);
      if (!article) {
        throw new ArticleNotFoundError(request.id);
      }

      return article;
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new GetArticleError(error instanceof Error ? error : undefined);
    }
  }
}
