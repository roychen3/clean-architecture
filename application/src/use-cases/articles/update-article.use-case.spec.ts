import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { Article, NoPermissionError } from '@ca/core';

import { PermissionService } from '../../services';
import { ArticlesRepository } from '../../repositories';

import { ArticleNotFoundError, UpdateArticleError } from './articles.errors';
import {
  UpdateArticleUseCase,
  UpdateArticleRequestDTO,
} from './update-article.use-case';

describe('UpdateArticleUseCase', () => {
  let articlesRepository: Mocked<ArticlesRepository>;
  let permissionService: Mocked<PermissionService>;
  let useCase: UpdateArticleUseCase;
  let request: UpdateArticleRequestDTO;
  let executer: string;
  let article: Mocked<Article>;

  beforeEach(() => {
    articlesRepository = {
      findById: vi.fn(),
      update: vi.fn(),
    } as unknown as Mocked<ArticlesRepository>;

    permissionService = {
      can: vi.fn(),
    } as unknown as Mocked<PermissionService>;

    useCase = new UpdateArticleUseCase({
      articlesRepository,
      permissionService,
    });

    request = { id: 'article-1', title: 'Updated Title', body: 'Updated Body' };

    executer = 'user-1';

    article = {
      getAuthorId: vi.fn(() => 'user-1'),
      setTitle: vi.fn(),
      setBody: vi.fn(),
      validate: vi.fn(),
    } as unknown as Mocked<Article>;
  });

  it('should update article title and body if provided', async () => {
    articlesRepository.findById.mockResolvedValue(article);
    permissionService.can.mockResolvedValue(true);
    articlesRepository.update.mockResolvedValue(undefined);

    const result = await useCase.execute(request, executer);
    expect(result).toBe(article);
    expect(article.setTitle).toHaveBeenCalledWith(request.title);
    expect(article.setBody).toHaveBeenCalledWith(request.body);
    expect(article.validate).toHaveBeenCalled();
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'update',
      'articles',
      {
        target: {
          userId: executer,
          own: true,
        },
      },
    );
    expect(articlesRepository.update).toHaveBeenCalledWith(article);
  });

  it('should update only title if body is not provided', async () => {
    articlesRepository.findById.mockResolvedValue(article);
    permissionService.can.mockResolvedValue(true);
    articlesRepository.update.mockResolvedValue(undefined);

    const request = { id: 'article-1', title: 'Title Only' };
    const result = await useCase.execute(request, executer);
    expect(result).toBe(article);
    expect(article.setTitle).toHaveBeenCalledWith(request.title);
    expect(article.setBody).not.toHaveBeenCalled();
    expect(article.validate).toHaveBeenCalled();
    expect(articlesRepository.update).toHaveBeenCalledWith(article);
  });

  it('should update only body if title is not provided', async () => {
    articlesRepository.findById.mockResolvedValue(article);
    permissionService.can.mockResolvedValue(true);
    articlesRepository.update.mockResolvedValue(undefined);

    const request = { id: 'article-1', body: 'Body Only' };
    const result = await useCase.execute(request, executer);
    expect(result).toBe(article);
    expect(article.setTitle).not.toHaveBeenCalled();
    expect(article.setBody).toHaveBeenCalledWith(request.body);
    expect(article.validate).toHaveBeenCalled();
    expect(articlesRepository.update).toHaveBeenCalledWith(article);
  });

  it('should throw ArticleNotFoundError if article does not exist', async () => {
    articlesRepository.findById.mockResolvedValue(null);

    const request = { id: 'article-1', title: 'Title' };
    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      ArticleNotFoundError,
    );
  });

  it('should throw NoPermissionError if user lacks update permissions', async () => {
    articlesRepository.findById.mockResolvedValue(article);
    permissionService.can.mockResolvedValue(false);

    const request = { id: 'article-1', title: 'Title' };
    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      NoPermissionError,
    );
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'update',
      'articles',
      {
        target: {
          userId: executer,
          own: true,
        },
      },
    );
    expect(articlesRepository.update).not.toHaveBeenCalled();
  });

  it('should throw UpdateArticleError on unexpected error', async () => {
    articlesRepository.findById.mockRejectedValue(
      new Error('Unexpected error'),
    );

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      UpdateArticleError,
    );
  });
});
