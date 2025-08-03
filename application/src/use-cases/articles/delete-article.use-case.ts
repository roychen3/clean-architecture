import { BaseError, NoPermissionError } from '@ca/core';

import { PermissionService } from '../../services';
import { ArticlesRepository } from '../../repositories';

import { ArticleNotFoundError, DeleteArticleError } from './articles.errors';

export type DeleteArticleRequestDTO = {
  id: string;
};

export type DeleteArticleResponseDTO = void;

export class DeleteArticleUseCase {
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
    request: DeleteArticleRequestDTO,
    executer: string,
  ): Promise<DeleteArticleResponseDTO> {
    try {
      const article = await this.articlesRepository.findById(request.id);
      if (!article) {
        throw new ArticleNotFoundError(request.id);
      }

      const can = await this.permissionService.can(
        executer,
        'delete',
        'articles',
        {
          target: {
            userId: article.getAuthorId(),
            priority: '$gt',
          },
        },
      );
      if (!can) {
        throw new NoPermissionError();
      }

      await this.articlesRepository.delete(request.id);
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DeleteArticleError(error instanceof Error ? error : undefined);
    }
  }
}
