import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { Article } from '@ca/core';

import { ArticlesRepository } from '../../repositories';

import { ArticleNotFoundError, GetArticleError } from './articles.errors';
import {
  GetArticleUseCase,
  GetArticleRequestDTO,
} from './get-article.use-case';

describe('GetArticleUseCase', () => {
  let articlesRepository: Mocked<ArticlesRepository>;
  let getArticleUseCase: GetArticleUseCase;
  let request: GetArticleRequestDTO;
  let article: Article;

  beforeEach(() => {
    articlesRepository = {
      findById: vi.fn(),
    } as unknown as Mocked<ArticlesRepository>;

    getArticleUseCase = new GetArticleUseCase({
      articlesRepository,
    });

    request = { id: 'article-1' };

    article = new Article({
      id: 'article-1',
      title: 'Test Article',
      body: 'This is a test article content',
      authorId: 'author-1',
      authorName: 'Author 1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    });
  });

  describe('execute', () => {
    it('should retrieve an article by ID successfully', async () => {
      articlesRepository.findById.mockResolvedValue(article);

      const result = await getArticleUseCase.execute(request);
      expect(result).toEqual(article);
      expect(articlesRepository.findById).toHaveBeenCalledWith(request.id);
    });

    it('should throw ArticleNotFoundError if the article does not exist', async () => {
      articlesRepository.findById.mockResolvedValue(null);

      await expect(getArticleUseCase.execute(request)).rejects.toThrow(
        ArticleNotFoundError,
      );
      expect(articlesRepository.findById).toHaveBeenCalledWith(request.id);
    });

    it('should throw GetArticleError on unexpected error', async () => {
      articlesRepository.findById.mockRejectedValue(
        new Error('Unexpected error'),
      );

      await expect(getArticleUseCase.execute(request)).rejects.toThrow(
        GetArticleError,
      );
    });
  });
});
