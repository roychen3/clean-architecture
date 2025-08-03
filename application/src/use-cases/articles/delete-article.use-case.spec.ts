import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { Article, NoPermissionError } from '@ca/core';

import { PermissionService } from '../../services';
import { ArticlesRepository } from '../../repositories';

import { ArticleNotFoundError, DeleteArticleError } from './articles.errors';
import {
  DeleteArticleUseCase,
  DeleteArticleRequestDTO,
} from './delete-article.use-case';

describe('DeleteArticleUseCase', () => {
  let articlesRepository: Mocked<ArticlesRepository>;
  let permissionService: Mocked<PermissionService>;
  let useCase: DeleteArticleUseCase;
  let request: DeleteArticleRequestDTO;
  let executer: string;
  let article: Mocked<Article>;

  beforeEach(() => {
    articlesRepository = {
      findById: vi.fn(),
      delete: vi.fn(),
    } as unknown as Mocked<ArticlesRepository>;

    permissionService = {
      can: vi.fn(),
    } as unknown as Mocked<PermissionService>;

    useCase = new DeleteArticleUseCase({
      articlesRepository,
      permissionService,
    });

    request = { id: 'article-1' };

    executer = 'executer-1';

    article = {
      getAuthorId: vi.fn(() => 'author-1'),
    } as unknown as Mocked<Article>;
  });

  it('should delete the article successfully', async () => {
    articlesRepository.findById.mockResolvedValue(article);
    permissionService.can.mockResolvedValue(true);
    articlesRepository.delete.mockResolvedValue(undefined);

    await expect(useCase.execute(request, executer)).resolves.toBeUndefined();
    expect(articlesRepository.findById).toHaveBeenCalledWith(request.id);
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'delete',
      'articles',
      {
        target: {
          userId: 'author-1',
          priority: '$gt',
        },
      },
    );
    expect(articlesRepository.delete).toHaveBeenCalledWith(request.id);
  });

  it('should throw ArticleNotFoundError if article does not exist', async () => {
    articlesRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      ArticleNotFoundError,
    );
    expect(articlesRepository.findById).toHaveBeenCalledWith(request.id);
    expect(permissionService.can).not.toHaveBeenCalled();
    expect(articlesRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw NoPermissionError if permission is denied', async () => {
    articlesRepository.findById.mockResolvedValue(article);
    permissionService.can.mockResolvedValue(false);
    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      NoPermissionError,
    );
    expect(articlesRepository.findById).toHaveBeenCalledWith(request.id);
    expect(permissionService.can).toHaveBeenCalledWith(
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
    expect(articlesRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw DeleteArticleError on unexpected error', async () => {
    articlesRepository.findById.mockRejectedValue(
      new Error('Unexpected error'),
    );

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      DeleteArticleError,
    );
  });
});
