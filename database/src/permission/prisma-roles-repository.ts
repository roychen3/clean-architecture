import { Role } from '@ca/core';
import { RolesRepository } from '@ca/application';

import { PrismaClient } from '../database/prisma';

export class PrismaRolesRepository implements RolesRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: Role): Promise<void> {
    await this.prisma.role.create({
      data: {
        id: data.getId(),
        name: data.getName(),
        priority: data.getPriority(),
      },
    });
  }

  async findById(id: string): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });

    if (!role) {
      return null;
    }

    const result = new Role(role);
    return result;
  }

  async findByName(name: string): Promise<Role | null> {
    const role = await this.prisma.role.findUnique({
      where: { name },
    });

    if (!role) {
      return null;
    }

    const result = new Role(role);
    return result;
  }

  async findAll(): Promise<Role[]> {
    const roles = await this.prisma.role.findMany();
    const result = roles.map((role) => {
      return new Role(role);
    });
    return result;
  }

  async update(value: Role): Promise<void> {
    await this.prisma.role.update({
      where: { id: value.getId() },
      data: {
        name: value.getName(),
        priority: value.getPriority(),
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.role.delete({
      where: { id },
    });
  }
}
