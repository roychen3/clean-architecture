import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Request,
  Query,
} from '@nestjs/common';

import {
  CreateArticleUseCase,
  GetArticlesUseCase,
  GetArticleUseCase,
  UpdateArticleUseCase,
  DeleteArticleUseCase,
} from '@ca/application';

import { Public } from '../../decorators/public';

import {
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
} from './articles.dto';

@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly createArticleUseCase: CreateArticleUseCase,
    private readonly getArticlesUseCase: GetArticlesUseCase,
    private readonly getArticleDetailUseCase: GetArticleUseCase,
    private readonly updateArticleUseCase: UpdateArticleUseCase,
    private readonly deleteArticleUseCase: DeleteArticleUseCase,
  ) {}

  @Post()
  async create(
    @Request() request: Request,
    @Body() body: CreateArticleRequestDTO['body'],
  ): Promise<CreateArticleResponseDTO> {
    const user = request['user'];
    const article = await this.createArticleUseCase.execute(body, user.id);
    const result = {
      data: {
        id: article.getId(),
        title: article.getTitle(),
        body: article.getBody(),
        authorId: article.getAuthorId(),
        authorName: article.getAuthorName(),
        createdAt: article.getCreatedAt().toISOString(),
        updatedAt: article.getUpdatedAt().toISOString(),
      },
    };
    return result;
  }

  @Public()
  @Get()
  async getArticles(
    @Query()
    query: GetArticlesRequestDTO['query'],
  ): Promise<GetArticlesResponseDTO> {
    const response = await this.getArticlesUseCase.execute({
      page: query.page,
      pageSize: query['page-size'],
      title: query.title,
      authorId: query['author-id'],
      sortBy: query['sort-by'],
      sortOrder: query['sort-order'],
    });
    const data = response.data.map((article) => ({
      id: article.getId(),
      title: article.getTitle(),
      body: article.getBody(),
      authorId: article.getAuthorId(),
      authorName: article.getAuthorName(),
      createdAt: article.getCreatedAt().toISOString(),
      updatedAt: article.getUpdatedAt().toISOString(),
    }));
    const result = {
      data,
      pagination: response.pagination,
    };
    return result;
  }

  @Get(':id')
  async getOne(
    @Param() params: GetArticleRequestDTO['path'],
  ): Promise<GetArticleResponseDTO> {
    const article = await this.getArticleDetailUseCase.execute(params);
    const result = {
      data: {
        id: article.getId(),
        title: article.getTitle(),
        body: article.getBody(),
        authorId: article.getAuthorId(),
        authorName: article.getAuthorName(),
        createdAt: article.getCreatedAt().toISOString(),
        updatedAt: article.getUpdatedAt().toISOString(),
      },
    };
    return result;
  }

  @Patch(':id')
  @HttpCode(204)
  async update(
    @Request() request: Request,
    @Param() params: UpdateArticleRequestDTO['path'],
    @Body() body: UpdateArticleRequestDTO['body'],
  ): Promise<UpdateArticleResponseDTO> {
    const user = request['user'];
    await this.updateArticleUseCase.execute(
      {
        id: params.id,
        title: body.title,
        body: body.body,
      },
      user.id,
    );
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Request() request: Request,
    @Param() params: DeleteArticleRequestDTO['path'],
  ): Promise<DeleteArticleResponseDTO> {
    const user = request['user'];
    await this.deleteArticleUseCase.execute(params, user.id);
  }
}
