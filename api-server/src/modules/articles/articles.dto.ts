import { BaseRequestDTO, BaseResponseDTO, Pagination } from '../../types';

export type ArticleDTO = {
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
export type CreateArticleResponseDTO = BaseResponseDTO<ArticleDTO>;

export type GetArticleRequestDTO = BaseRequestDTO<{ id: string }>;
export type GetArticleResponseDTO = BaseResponseDTO<ArticleDTO>;

export type GetArticlesRequestDTO = BaseRequestDTO<
  undefined,
  {
    page: Pagination['page'];
    'page-size': Pagination['pageSize'];
    title?: string;
    'author-id'?: string;
    'sort-by'?: 'createdAt' | 'updatedAt';
    'sort-order'?: 'asc' | 'desc';
  }
>;
export type GetArticlesResponseDTO = BaseResponseDTO<ArticleDTO[], true>;

export type UpdateArticleRequestDTO = BaseRequestDTO<
  { id: string },
  undefined,
  { title?: string; body?: string }
>;
export type UpdateArticleResponseDTO = void;

export type DeleteArticleRequestDTO = BaseRequestDTO<{ id: string }>;
export type DeleteArticleResponseDTO = void;
