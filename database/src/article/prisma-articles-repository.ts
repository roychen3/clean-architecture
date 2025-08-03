import { Article } from '@ca/core';
import { ArticlesRepository } from '@ca/application';

import { PrismaClient, Prisma } from '../database/prisma';

export class PrismaArticleRepository implements ArticlesRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(article: Article): Promise<void> {
    await this.prisma.article.create({
      data: {
        id: article.getId(),
        title: article.getTitle(),
        body: article.getBody(),
        authorId: article.getAuthorId(),
        createdAt: article.getCreatedAt(),
        updatedAt: article.getUpdatedAt(),
      },
    });
  }

  async findMany(query: {
    page: number;
    pageSize: number;
    title?: string;
    authorId?: string;
    sortBy?: 'createdAt' | 'updatedAt';
    sortOrder?: 'asc' | 'desc';
  }): Promise<{ data: Article[]; total: number }> {
    const where: Prisma.ArticleWhereInput = {};
    if (query.title) {
      where.title = { contains: query.title };
    }
    if (query.authorId) {
      where.authorId = query.authorId;
    }
    const total = await this.prisma.article.count({ where });
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const articles = await this.prisma.article.findMany({
      where,
      orderBy: { [query.sortBy || 'createdAt']: query.sortOrder || 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        author: true,
      },
    });

    const result = {
      data: articles.map(
        (article) =>
          new Article({
            id: article.id,
            title: article.title,
            body: article.body,
            authorId: article.authorId,
            authorName: article.author.name,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
          }),
      ),
      total,
    };
    return result;
  }

  async findById(id: string): Promise<Article | null> {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });

    if (!article) {
      return null;
    }

    return new Article({
      id: article.id,
      title: article.title,
      body: article.body,
      authorId: article.authorId,
      authorName: article.author.name,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    });
  }

  async update(data: Article): Promise<void> {
    await this.prisma.article.update({
      where: { id: data.getId() },
      data: {
        title: data.getTitle(),
        body: data.getBody(),
        updatedAt: data.getUpdatedAt(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.article.delete({
      where: { id },
    });
  }
}
