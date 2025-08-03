import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { NoPermissionError, Article, User } from '@ca/core';

import { PermissionService } from '../../services';
import { ArticlesRepository, UsersRepository } from '../../repositories';

import { CreateArticleError } from './articles.errors';
import {
  CreateArticleUseCase,
  CreateArticleRequestDTO,
} from './create-article.use-case';

describe('CreateArticleUseCase', () => {
  let usersRepository: Mocked<UsersRepository>;
  let articlesRepository: Mocked<ArticlesRepository>;
  let permissionService: Mocked<PermissionService>;
  let useCase: CreateArticleUseCase;
  let request: CreateArticleRequestDTO;
  let executer: string;
  let author: User;

  beforeEach(() => {
    usersRepository = {
      findById: vi.fn(),
    } as unknown as Mocked<UsersRepository>;

    articlesRepository = {
      create: vi.fn(),
    } as unknown as Mocked<ArticlesRepository>;

    permissionService = {
      can: vi.fn(),
    } as unknown as Mocked<PermissionService>;

    useCase = new CreateArticleUseCase({
      usersRepository,
      articlesRepository,
      permissionService,
    });

    request = {
      title: 'Test Title',
      body: 'Test Body',
    };

    executer = 'user-1';

    author = new User({
      id: executer,
      email: 'author@example.com',
      name: 'Author Name',
      password: 'password',
    });
  });

  it('should create an article successfully', async () => {
    permissionService.can.mockResolvedValue(true);

    usersRepository.findById.mockResolvedValue(author);
    articlesRepository.create.mockResolvedValue(undefined);

    const result = await useCase.execute(request, executer);
    expect(result).toBeInstanceOf(Article);
    expect(result.getTitle()).toBe(request.title);
    expect(result.getBody()).toBe(request.body);
    expect(result.getAuthorId()).toBe(executer);
    expect(result.getAuthorName()).toBe('Author Name');
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'create',
      'articles',
    );
    expect(articlesRepository.create).toHaveBeenCalledWith(expect.any(Article));
  });

  it('should throw NoPermissionError if permission denied', async () => {
    permissionService.can.mockResolvedValue(false);

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      NoPermissionError,
    );
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'create',
      'articles',
    );
    expect(usersRepository.findById).not.toHaveBeenCalled();
    expect(articlesRepository.create).not.toHaveBeenCalled();
  });

  it('should throw CreateArticleError if author not found', async () => {
    permissionService.can.mockResolvedValue(true);
    usersRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(request, executer)).rejects.toMatchObject({
      message: 'Author not found',
      name: 'CreateArticleError',
      errorCode: 'CREATE_ARTICLE_ERROR',
    });
    expect(articlesRepository.create).not.toHaveBeenCalled();
  });

  it('should throw CreateArticleError on unexpected error', async () => {
    permissionService.can.mockRejectedValue(new Error('Unexpected error'));

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      CreateArticleError,
    );
    expect(articlesRepository.create).not.toHaveBeenCalled();
  });
});
