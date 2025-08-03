import { httpFetcher } from '@/lib/http-fetcher';

import type { ArticlesAPI } from '../interfaces';
import type {
  CreateArticleRequestDTO,
  CreateArticleResponseDTO,
  GetArticlesRequestDTO,
  GetArticlesResponseDTO,
  GetArticleRequestDTO,
  GetArticleResponseDTO,
  UpdateArticleRequestDTO,
  UpdateArticleResponseDTO,
  DeleteArticleRequestDTO,
  DeleteArticleResponseDTO,
} from '../dto';

export class HttpArticlesAPI implements ArticlesAPI {
  async create(
    req: CreateArticleRequestDTO,
  ): Promise<CreateArticleResponseDTO> {
    const response = await httpFetcher.post('/api/articles', req.body);
    return response.data;
  }

  async getMany(req?: GetArticlesRequestDTO): Promise<GetArticlesResponseDTO> {
    const { query } = req || {};
    const params = new URLSearchParams();
    if (query?.page !== undefined) params.append('page', String(query.page));
    if (query?.pageSize !== undefined)
      params.append('page-size', String(query.pageSize));
    if (query?.title) params.append('title', query.title);
    if (query?.authorId) params.append('author-id', query.authorId);
    if (query?.sortBy) params.append('sort-by', query.sortBy);
    if (query?.sortOrder) params.append('sort-order', query.sortOrder);
    const response = await httpFetcher.get(
      `/api/articles?${params.toString()}`,
    );
    return response.data;
  }

  async getOne(req: GetArticleRequestDTO): Promise<GetArticleResponseDTO> {
    const response = await httpFetcher.get(`/api/articles/${req.path.id}`);
    return response.data;
  }

  async update(
    req: UpdateArticleRequestDTO,
  ): Promise<UpdateArticleResponseDTO> {
    await httpFetcher.patch(`/api/articles/${req.path.id}`, req.body);
  }

  async delete(
    req: DeleteArticleRequestDTO,
  ): Promise<DeleteArticleResponseDTO> {
    await httpFetcher.delete(`/api/articles/${req.path.id}`);
  }
}
