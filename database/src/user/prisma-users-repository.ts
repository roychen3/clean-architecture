import { User } from '@ca/core';
import { UsersRepository } from '@ca/application';

import { PrismaClient } from '../database/prisma';

export class PrismaUsersRepository implements UsersRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: User): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: data.getId(),
        email: data.getEmail(),
        password: data.getPassword(),
        name: data.getName(),
        createdAt: data.getCreatedAt(),
        updatedAt: data.getUpdatedAt(),
      },
    });
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    const result = users.map(
      (user) =>
        new User({
          email: user.email,
          password: user.password,
          name: user.name,
          id: user.id,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }),
    );
    return result;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    const result = new User({
      email: user.email,
      password: user.password,
      name: user.name,
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
    return result;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const result = new User({
      email: user.email,
      password: user.password,
      name: user.name,
      id: user.id,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
    return result;
  }

  async update(data: User): Promise<void> {
    await this.prisma.user.update({
      where: { id: data.getId() },
      data: {
        email: data.getEmail(),
        password: data.getPassword(),
        name: data.getName(),
        updatedAt: data.getUpdatedAt(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
