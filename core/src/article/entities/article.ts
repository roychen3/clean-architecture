import { v4 as uuidv4 } from 'uuid';
import z from 'zod';

import { ValidateResponse } from '../../validators';

const articleSchema = z.object({
  id: z.string().uuid(),
  title: z.string().max(40, 'Title must be at most 40 characters long'),
  body: z.string(),
  authorId: z.string().uuid(),
  authorName: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export class Article {
  private id: string;
  private title: string;
  private body: string;
  private authorId: string;
  private authorName: string;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(data: {
    id?: string;
    title: string;
    body: string;
    authorId: string;
    authorName: string;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = data.id || uuidv4();
    this.title = data.title;
    this.body = data.body;
    this.authorId = data.authorId;
    this.authorName = data.authorName;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }
  setTitle(value: string): void {
    this.title = value;
    this.updatedAt = new Date();
  }

  getBody(): string {
    return this.body;
  }
  setBody(value: string): void {
    this.body = value;
    this.updatedAt = new Date();
  }

  getAuthorId(): string {
    return this.authorId;
  }
  setAuthorId(value: string): void {
    this.authorId = value;
    this.updatedAt = new Date();
  }

  getAuthorName(): string {
    return this.authorName;
  }
  setAuthorName(value: string): void {
    this.authorName = value;
    this.updatedAt = new Date();
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  validate(): ValidateResponse {
    const result = articleSchema.safeParse({
      id: this.id,
      title: this.title,
      body: this.body,
      authorId: this.authorId,
      authorName: this.authorName,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
    return {
      success: result.success,
      error: result.success ? null : result.error,
    };
  }
}
