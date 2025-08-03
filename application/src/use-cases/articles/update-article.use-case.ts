import { Article, BaseError, NoPermissionError } from '@ca/core';

import { ArticlesRepository } from '../../repositories';
import { PermissionService } from '../../services';

import { ArticleNotFoundError, UpdateArticleError } from './articles.errors';

export type UpdateArticleRequestDTO = {
  id: string;
  title?: string;
  body?: string;
};

export type UpdateArticleResponseDTO = Article;

export class UpdateArticleUseCase {
  private articlesRepository: ArticlesRepository;
  private permissionService: PermissionService;

  constructor(options: {
    articlesRepository: ArticlesRepository;
    permissionService: PermissionService;
  }) {
    this.articlesRepository = options.articlesRepository;
    this.permissionService = options.permissionService;
  }

  async execute(
    request: UpdateArticleRequestDTO,
    executer: string,
  ): Promise<UpdateArticleResponseDTO> {
    try {
      const currentArticle = await this.articlesRepository.findById(request.id);
      if (!currentArticle) {
        throw new ArticleNotFoundError(request.id);
      }

      const can = await this.permissionService.can(
        executer,
        'update',
        'articles',
        {
          target: {
            userId: currentArticle.getAuthorId(),
            own: true,
          },
        },
      );
      if (!can) {
        throw new NoPermissionError();
      }

      if (request.title) {
        currentArticle.setTitle(request.title);
      }
      if (request.body) {
        currentArticle.setBody(request.body);
      }

      currentArticle.validate();
      await this.articlesRepository.update(currentArticle);
      return currentArticle;
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new UpdateArticleError(error instanceof Error ? error : undefined);
    }
  }
}
