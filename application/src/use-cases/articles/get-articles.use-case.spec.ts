import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { Article } from '@ca/core';

import { ArticlesRepository } from '../../repositories';

import { GetArticlesError } from './articles.errors';
import {
  GetArticlesUseCase,
  GetArticlesRequestDTO,
} from './get-articles.use-case';

describe('GetArticlesUseCase', () => {
  let articlesRepository: Mocked<ArticlesRepository>;
  let useCase: GetArticlesUseCase;
  let request: GetArticlesRequestDTO;
  let articles: Article[];

  beforeEach(() => {
    articlesRepository = {
      findMany: vi.fn(),
    } as unknown as Mocked<ArticlesRepository>;

    useCase = new GetArticlesUseCase({ articlesRepository });

    request = {};

    articles = [
      new Article({
        id: '1',
        title: 'Alpha',
        body: 'Alpha body',
        authorId: 'author1',
        authorName: 'Author 1',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
      }),
      new Article({
        id: '2',
        title: 'Beta',
        body: 'Beta body',
        authorId: 'author2',
        authorName: 'Author 2',
        createdAt: new Date('2023-01-03'),
        updatedAt: new Date('2023-01-04'),
      }),
      new Article({
        id: '3',
        title: 'Gamma',
        body: 'Gamma body',
        authorId: 'author1',
        authorName: 'Author 1',
        createdAt: new Date('2023-01-05'),
        updatedAt: new Date('2023-01-06'),
      }),
    ];
  });

  it('should return articles with default pagination and sorting', async () => {
    articlesRepository.findMany.mockResolvedValue({
      data: articles,
      total: 3,
    });

    const result = await useCase.execute(request);
    expect(articlesRepository.findMany).toHaveBeenCalledWith({
      page: 1,
      pageSize: 10,
      title: undefined,
      authorId: undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    expect(result.data).toEqual(articles);
    expect(result.pagination).toEqual({
      page: 1,
      pageSize: 10,
      total: 3,
      totalPages: 1,
    });
  });

  it('should filter articles by title', async () => {
    articlesRepository.findMany.mockResolvedValue({
      data: [articles[0]],
      total: 1,
    });

    const result = await useCase.execute({ title: 'Alpha' });
    expect(articlesRepository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Alpha' }),
    );
    expect(result.data).toEqual([articles[0]]);
    expect(result.pagination.total).toBe(1);
  });

  it('should filter articles by authorId', async () => {
    articlesRepository.findMany.mockResolvedValue({
      data: [articles[0], articles[2]],
      total: 2,
    });

    const result = await useCase.execute({ authorId: 'author1' });
    expect(articlesRepository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ authorId: 'author1' }),
    );
    expect(result.data).toEqual([articles[0], articles[2]]);
    expect(result.pagination.total).toBe(2);
  });

  it('should sort articles by updatedAt ascending', async () => {
    articlesRepository.findMany.mockResolvedValue({
      data: [articles[0], articles[1], articles[2]],
      total: 3,
    });

    await useCase.execute({ sortBy: 'updatedAt', sortOrder: 'asc' });
    expect(articlesRepository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ sortBy: 'updatedAt', sortOrder: 'asc' }),
    );
  });

  it('should paginate articles', async () => {
    articlesRepository.findMany.mockResolvedValue({
      data: [articles[1]],
      total: 3,
    });

    const result = await useCase.execute({ page: 2, pageSize: 1 });
    expect(articlesRepository.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ page: 2, pageSize: 1 }),
    );
    expect(result.pagination).toEqual({
      page: 2,
      pageSize: 1,
      total: 3,
      totalPages: 3,
    });
  });

  it('should throw GetArticlesError on unexpected error', async () => {
    articlesRepository.findMany.mockRejectedValue(
      new Error('Unexpected error'),
    );

    await expect(useCase.execute(request)).rejects.toBeInstanceOf(
      GetArticlesError,
    );
  });
});
