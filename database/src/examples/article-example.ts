import { Article, User } from '@ca/core';

import { prisma, PrismaUsersRepository, PrismaArticleRepository } from '..';

// Example usage
async function example() {
  try {
    const userRepository = new PrismaUsersRepository(prisma);
    const articleRepository = new PrismaArticleRepository(prisma);

    const now = new Date().getTime();
    const newUser = new User({
      email: `example_${now}@example.com`,
      password: 'examplePassword123',
      name: `Example User ${now}`,
    });
    await userRepository.create(newUser);

    const article = new Article({
      title: `Example Article ${now}`,
      body: 'This is the content of the example article.',
      authorId: newUser.getId(),
      authorName: newUser.getName(),
    });

    await articleRepository.create(article);

    const { data: authorArticles } = await articleRepository.findMany({
      authorId: newUser.getId(),
      page: 1,
      pageSize: 10,
    });
    console.log(
      `Found ${authorArticles.length} articles for author:`,
      newUser.getId(),
    );
    console.log('Articles:', authorArticles);

    // Update article
    if (authorArticles.length > 0) {
      const firstArticle = authorArticles[0];
      firstArticle.setTitle(`Updated Example Title ${now}`);
      await articleRepository.update(firstArticle);
      console.log('Updated article title to:', firstArticle.getTitle());

      // Find by ID
      const foundArticle = await articleRepository.findById(
        firstArticle.getId(),
      );
      console.log('Found article by ID:', foundArticle);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the example
example().catch(console.error);
