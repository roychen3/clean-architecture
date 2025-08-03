import { Article } from '@ca/core';

export interface FindArticlesQuery {
  page: number;
  pageSize: number;
  title?: string;
  authorId?: string;
  sortBy?: 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
}

export interface ArticlesRepository {
  create(data: Article): Promise<void>;
  findMany(
    query: FindArticlesQuery,
  ): Promise<{ data: Article[]; total: number }>;
  findById(id: string): Promise<Article | null>;
  update(data: Article): Promise<void>;
  delete(id: string): Promise<void>;
}
