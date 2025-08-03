import { PermissionResourceName, PermissionResource } from '@ca/core';
import { PermissionResourcesRepository } from '@ca/application';

import { PrismaClient } from '../database/prisma';

export class PrismaPermissionResourcesRepository
  implements PermissionResourcesRepository
{
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: PermissionResource): Promise<void> {
    await this.prisma.permissionResource.create({
      data: {
        id: data.getId(),
        name: data.getName(),
      },
    });
  }

  async findById(id: string): Promise<PermissionResource | null> {
    const action = await this.prisma.permissionResource.findUnique({
      where: { id },
    });

    if (!action) {
      return null;
    }

    const result = new PermissionResource({
      id: action.id,
      name: action.name as PermissionResourceName,
    });
    return result;
  }

  async findAll(): Promise<PermissionResource[]> {
    const actions = await this.prisma.permissionResource.findMany();
    const result = actions.map((action) => {
      return new PermissionResource({
        id: action.id,
        name: action.name as PermissionResourceName,
      });
    });
    return result;
  }

  async update(data: PermissionResource): Promise<void> {
    await this.prisma.permissionResource.update({
      where: { id: data.getId() },
      data: { name: data.getName() },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.permissionResource.delete({
      where: { id },
    });
  }
}
