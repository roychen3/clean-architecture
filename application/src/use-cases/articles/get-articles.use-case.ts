import { Article, BaseError } from '@ca/core';

import { ArticlesRepository } from '../../repositories';
import { Pagination } from '../../types';

import { GetArticlesError } from './articles.errors';

export type GetArticlesRequestDTO = Partial<{
  page: Pagination['page'];
  pageSize: Pagination['pageSize'];
  title: string;
  authorId: string;
  sortBy: 'createdAt' | 'updatedAt';
  sortOrder: 'asc' | 'desc';
}>;

export type GetArticlesResponseDTO = {
  data: Article[];
  pagination: Pagination;
};

export class GetArticlesUseCase {
  private articlesRepository: ArticlesRepository;

  constructor(options: { articlesRepository: ArticlesRepository }) {
    this.articlesRepository = options.articlesRepository;
  }

  async execute(
    request?: Partial<GetArticlesRequestDTO>,
  ): Promise<GetArticlesResponseDTO> {
    try {
      const page = request?.page ?? 1;
      const pageSize = request?.pageSize ?? 10;
      const sortBy = request?.sortBy ?? 'createdAt';
      const sortOrder = request?.sortOrder ?? 'desc';
      const { data, total } = await this.articlesRepository.findMany({
        page,
        pageSize,
        title: request?.title,
        authorId: request?.authorId,
        sortBy,
        sortOrder,
      });
      const totalPages = Math.ceil(total / pageSize);
      return {
        data,
        pagination: {
          page,
          pageSize,
          total,
          totalPages,
        },
      };
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new GetArticlesError(error instanceof Error ? error : undefined);
    }
  }
}
