import { NotFoundError, BaseError } from '@ca/core';

export class CreateArticleError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'CreateArticleError',
      errorCode: 'CREATE_ARTICLE_ERROR',
      message:
        cause?.message || 'Failed to execute the create article use case.',
      cause,
    });
  }
}

export class GetArticlesError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'GetArticlesError',
      errorCode: 'GET_ARTICLES_ERROR',
      message: 'Failed to execute the get articles use case.',
      cause,
    });
  }
}

export class GetArticleError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'GetArticleError',
      errorCode: 'GET_ARTICLE_ERROR',
      message: 'Failed to execute the get article use case.',
      cause,
    });
  }
}

export class UpdateArticleError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'UpdateArticleError',
      errorCode: 'UPDATE_ARTICLE_ERROR',
      message: 'Failed to execute the update article use case.',
      cause,
    });
  }
}

export class DeleteArticleError extends BaseError {
  constructor(cause?: Error) {
    super({
      name: 'DeleteArticleError',
      errorCode: 'DELETE_ARTICLE_ERROR',
      message: 'Failed to execute the delete article use case.',
      cause,
    });
  }
}

export class ArticleNotFoundError extends NotFoundError {
  readonly articleId: string;

  constructor(articleId: string, cause?: Error) {
    super({
      message: `Article with ID ${articleId} not found`,
      cause,
    });
    this.articleId = articleId;
  }
}
