import { PermissionActionName, PermissionAction } from '@ca/core';
import { PermissionActionsRepository } from '@ca/application';

import { PrismaClient } from '../database/prisma';

export class PrismaPermissionActionsRepository
  implements PermissionActionsRepository
{
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: PermissionAction): Promise<void> {
    await this.prisma.permissionAction.create({
      data: {
        id: data.getId(),
        name: data.getName(),
      },
    });
  }

  async findById(id: string): Promise<PermissionAction | null> {
    const action = await this.prisma.permissionAction.findUnique({
      where: { id },
    });

    if (!action) {
      return null;
    }

    const result = new PermissionAction({
      id: action.id,
      name: action.name as PermissionActionName,
    });
    return result;
  }

  async findAll(): Promise<PermissionAction[]> {
    const actions = await this.prisma.permissionAction.findMany();
    const result = actions.map((action) => {
      return new PermissionAction({
        id: action.id,
        name: action.name as PermissionActionName,
      });
    });
    return result;
  }

  async update(data: PermissionAction): Promise<void> {
    await this.prisma.permissionAction.update({
      where: { id: data.getId() },
      data: { name: data.getName() },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.permissionAction.delete({
      where: { id },
    });
  }
}
