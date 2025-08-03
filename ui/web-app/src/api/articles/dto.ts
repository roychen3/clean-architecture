import type { BaseRequestDTO, BaseResponseDTO, Pagination } from '../types';

export type Article = {
  id: string;
  title: string;
  body: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateArticleRequestDTO = BaseRequestDTO<
  undefined,
  undefined,
  { title: string; body: string }
>;
export type CreateArticleResponseDTO = BaseResponseDTO<Article>;

export type GetArticleRequestDTO = BaseRequestDTO<{ id: string }>;
export type GetArticleResponseDTO = BaseResponseDTO<Article>;

export type GetArticlesRequestDTO = BaseRequestDTO<
  undefined,
  {
    page: Pagination['page'];
    pageSize: Pagination['pageSize'];
    title?: string;
    authorId?: string;
    sortBy?: 'createdAt' | 'updatedAt';
    sortOrder?: 'asc' | 'desc';
  }
>;
export type GetArticlesResponseDTO = BaseResponseDTO<Article[], true>;

export type UpdateArticleRequestDTO = BaseRequestDTO<
  { id: string },
  undefined,
  { title?: string; body?: string }
>;
export type UpdateArticleResponseDTO = void;

export type DeleteArticleRequestDTO = BaseRequestDTO<{ id: string }>;
export type DeleteArticleResponseDTO = void;
