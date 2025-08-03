import { describe, it, expect } from 'vitest';

import { Article } from './article';

describe('Article Entity', () => {
  const validData = {
    title: 'Test Article',
    body: 'This is the body of the article.',
    authorId: 'b3b8c7e2-8f3a-4e2a-9c1a-1f2e3d4c5b6a',
    authorName: 'John Doe',
  };

  it('should create an Article with valid data', () => {
    const article = new Article(validData);
    expect(article.getTitle()).toBe(validData.title);
    expect(article.getBody()).toBe(validData.body);
    expect(article.getAuthorId()).toBe(validData.authorId);
    expect(article.getAuthorName()).toBe(validData.authorName);
    expect(article.getId()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(article.getCreatedAt()).toBeInstanceOf(Date);
    expect(article.getUpdatedAt()).toBeInstanceOf(Date);
  });

  it('should update title and updatedAt', () => {
    const article = new Article(validData);
    const prevUpdatedAt = article.getUpdatedAt();
    article.setTitle('New Title');
    expect(article.getTitle()).toBe('New Title');
    expect(article.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(
      prevUpdatedAt.getTime(),
    );
  });

  it('should update body and updatedAt', () => {
    const article = new Article(validData);
    const prevUpdatedAt = article.getUpdatedAt();
    article.setBody('Updated body');
    expect(article.getBody()).toBe('Updated body');
    expect(article.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(
      prevUpdatedAt.getTime(),
    );
  });

  it('should update authorId and updatedAt', () => {
    const article = new Article(validData);
    const prevUpdatedAt = article.getUpdatedAt();
    const newAuthorId = 'd4e5f6a7-b8c9-4d0e-8f1a-2b3c4d5e6f7a';
    article.setAuthorId(newAuthorId);
    expect(article.getAuthorId()).toBe(newAuthorId);
    expect(article.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(
      prevUpdatedAt.getTime(),
    );
  });

  it('should update authorName and updatedAt', () => {
    const article = new Article(validData);
    const prevUpdatedAt = article.getUpdatedAt();
    article.setAuthorName('Jane Smith');
    expect(article.getAuthorName()).toBe('Jane Smith');
    expect(article.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(
      prevUpdatedAt.getTime(),
    );
  });

  it('should validate successfully with valid data', () => {
    const article = new Article(validData);
    const result = article.validate();
    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should fail validation if title is too long', () => {
    const article = new Article({
      ...validData,
      title: 'a'.repeat(41),
    });
    const result = article.validate();
    expect(result.success).toBe(false);
    expect(result.error).not.toBeNull();
  });

  it('should fail validation if authorId is not a uuid', () => {
    const article = new Article({
      ...validData,
      authorId: 'not-a-uuid',
    });
    const result = article.validate();
    expect(result.success).toBe(false);
    expect(result.error).not.toBeNull();
  });

  it('should use provided id, createdAt, and updatedAt if given', () => {
    const now = new Date();
    const article = new Article({
      ...validData,
      id: 'b3b8c7e2-8f3a-4e2a-9c1a-1f2e3d4c5b6a',
      createdAt: now,
      updatedAt: now,
    });
    expect(article.getId()).toBe('b3b8c7e2-8f3a-4e2a-9c1a-1f2e3d4c5b6a');
    expect(article.getCreatedAt()).toBe(now);
    expect(article.getUpdatedAt()).toBe(now);
  });
});
