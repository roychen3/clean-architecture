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
} from './dto';

export interface ArticlesAPI {
  create(req: CreateArticleRequestDTO): Promise<CreateArticleResponseDTO>;
  getMany(req?: GetArticlesRequestDTO): Promise<GetArticlesResponseDTO>;
  getOne(req: GetArticleRequestDTO): Promise<GetArticleResponseDTO>;
  update(req: UpdateArticleRequestDTO): Promise<UpdateArticleResponseDTO>;
  delete(req: DeleteArticleRequestDTO): Promise<DeleteArticleResponseDTO>;
}
