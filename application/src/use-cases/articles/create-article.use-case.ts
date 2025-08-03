import { Article, BaseError, NoPermissionError } from '@ca/core';

import { ArticlesRepository, UsersRepository } from '../../repositories';
import { PermissionService } from '../../services';

import { CreateArticleError } from './articles.errors';

export type CreateArticleRequestDTO = {
  title: string;
  body: string;
};

export type CreateArticleResponseDTO = Article;

export class CreateArticleUseCase {
  private usersRepository: UsersRepository;
  private articlesRepository: ArticlesRepository;
  private permissionService: PermissionService;

  constructor(options: {
    usersRepository: UsersRepository;
    articlesRepository: ArticlesRepository;
    permissionService: PermissionService;
  }) {
    this.usersRepository = options.usersRepository;
    this.articlesRepository = options.articlesRepository;
    this.permissionService = options.permissionService;
  }

  async execute(
    request: CreateArticleRequestDTO,
    executer: string,
  ): Promise<CreateArticleResponseDTO> {
    try {
      const can = await this.permissionService.can(
        executer,
        'create',
        'articles',
      );
      if (!can) {
        throw new NoPermissionError();
      }

      const author = await this.usersRepository.findById(executer);
      if (!author) {
        throw new Error('Author not found');
      }

      const newArticle = new Article({
        ...request,
        authorId: author.getId(),
        authorName: author.getName(),
      });
      await this.articlesRepository.create(newArticle);
      return newArticle;
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new CreateArticleError(error instanceof Error ? error : undefined);
    }
  }
}
