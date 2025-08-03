import { User } from '@ca/core';

import { PrismaUsersRepository } from '../user';

import { prisma } from '../database/prisma';

// Example usage
async function example() {
  try {
    const userRepository = new PrismaUsersRepository(prisma);

    const now = new Date().getTime();
    const newUser = new User({
      email: `example_${now}@example.com`,
      password: 'examplePassword123',
      name: `Example User ${now}`,
    });
    await userRepository.create(newUser);

    const user = await userRepository.findByEmail(newUser.getEmail());
    if (!user) {
      throw new Error('User not found');
    }
    console.log('Find User:', user);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the example
example().catch(console.error);
