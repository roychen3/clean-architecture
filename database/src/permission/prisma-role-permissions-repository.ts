import {
  Role,
  PermissionResource,
  PermissionAction,
  PermissionResourceName,
  PermissionActionName,
  RolePermissions,
  User,
} from '@ca/core';
import { RolePermissionsRepository } from '@ca/application';

import { PrismaClient } from '../database/prisma';

export class PrismaRolePermissionsRepository
  implements RolePermissionsRepository
{
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async setRolePermissions(data: {
    roleId: string;
    permissions: {
      resourceId: string;
      actionIds: string[];
    }[];
  }): Promise<void> {
    const newRolePermissionMap = new Map<
      string,
      {
        roleId: string;
        resourceId: string;
        actionId: string;
      }
    >();

    await this.prisma.$transaction(async (tx) => {
      const roleId = data.roleId;

      for (const resourcePermission of data.permissions) {
        const resourceId = resourcePermission.resourceId;

        for (const actionId of resourcePermission.actionIds) {
          const data = {
            roleId,
            resourceId,
            actionId,
          };
          newRolePermissionMap.set(`${roleId}_${resourceId}_${actionId}`, data);
          await tx.rolePermission.upsert({
            where: {
              roleId_resourceId_actionId: data,
            },
            update: data,
            create: data,
          });
        }
      }

      const existingPermissions = await tx.rolePermission.findMany({
        where: { roleId },
        select: {
          resourceId: true,
          actionId: true,
        },
      });
      for (const existingPermission of existingPermissions) {
        const key = `${roleId}_${existingPermission.resourceId}_${existingPermission.actionId}`;
        if (!newRolePermissionMap.has(key)) {
          await tx.rolePermission.delete({
            where: {
              roleId_resourceId_actionId: {
                roleId,
                resourceId: existingPermission.resourceId,
                actionId: existingPermission.actionId,
              },
            },
          });
        }
      }
    });
  }
  async getRolePermissions(roleId: string): Promise<RolePermissions | null> {
    const permissions = await this.prisma.rolePermission.findMany({
      where: { roleId },
      include: {
        role: true,
        resource: true,
        action: true,
      },
    });

    const formattedRolePermission =
      this.convertToDomainRolePermission(permissions);
    if (formattedRolePermission.length > 1) {
      throw new Error(
        `Expected only one role permission for roleId ${roleId}, but found ${formattedRolePermission.length}`,
      );
    }

    if (formattedRolePermission.length === 0) {
      const role = await this.prisma.role.findUnique({ where: { id: roleId } });
      if (!role) {
        return null;
      }
      return {
        role: new Role(role),
        permissions: [],
      };
    }

    return formattedRolePermission[0];
  }
  async getAllRolePermissions(): Promise<RolePermissions[]> {
    const permissions = await this.prisma.rolePermission.findMany({
      include: {
        role: true,
        resource: true,
        action: true,
      },
    });

    const result = this.convertToDomainRolePermission(permissions);
    return result;
  }

  async assignRoleToUser(userId: string, roleId: string): Promise<void> {
    const existingRole = await this.prisma.userToRole.findFirst({
      where: { userId, roleId },
    });
    if (existingRole) {
      return;
    }

    await this.prisma.userToRole.create({
      data: {
        userId,
        roleId,
      },
    });
  }
  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    const existingRole = await this.prisma.userToRole.findFirst({
      where: { userId, roleId },
    });
    if (!existingRole) {
      return;
    }

    await this.prisma.userToRole.delete({
      where: {
        userId_roleId: {
          userId,
          roleId,
        },
      },
    });
  }
  async setUserRoles(userId: string, roleIds: string[]): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.userToRole.deleteMany({
        where: { userId },
      });

      for (const roleId of roleIds) {
        await tx.userToRole.create({
          data: {
            userId,
            roleId,
          },
        });
      }
    });
  }

  async getUserRoles(userId: string): Promise<Role[]> {
    const userRoles = await this.prisma.userToRole.findMany({
      where: { userId },
      select: { role: true },
    });

    const result = userRoles.map((ur) => new Role(ur.role));
    return result;
  }
  async getUserPermissions(userId: string): Promise<RolePermissions[]> {
    const userRoles = await this.prisma.userToRole.findMany({
      where: { userId },
      select: { roleId: true },
    });

    const roleIds = userRoles.map((ur) => ur.roleId);

    const permissions = await this.prisma.rolePermission.findMany({
      where: {
        roleId: { in: roleIds },
      },
      include: {
        role: true,
        resource: true,
        action: true,
      },
    });

    const result = this.convertToDomainRolePermission(permissions);
    return result;
  }

  async getUsersByRole(roleId: string): Promise<User[]> {
    const userToRoles = await this.prisma.userToRole.findMany({
      where: { roleId },
      include: { user: true },
    });
    return userToRoles.map((utr) => new User(utr.user));
  }

  async checkUserPermission(
    userId: string,
    resourceName: string,
    actionName: string,
  ): Promise<boolean> {
    const resource = await this.prisma.permissionResource.findUnique({
      where: { name: resourceName },
    });

    const action = await this.prisma.permissionAction.findUnique({
      where: { name: actionName },
    });

    if (!resource || !action) {
      return false;
    }

    const userRoles = await this.prisma.userToRole.findMany({
      where: { userId },
      select: { roleId: true },
    });

    const roleIds = userRoles.map((ur) => ur.roleId);

    const permission = await this.prisma.rolePermission.findFirst({
      where: {
        roleId: { in: roleIds },
        resourceId: resource.id,
        actionId: action.id,
      },
    });

    return !!permission;
  }

  private convertToDomainRolePermission(
    permissions: Array<{
      role: { name: string; id: string; priority: number };
      resource: { name: string; id: string };
      action: { name: string; id: string };
    }>,
  ): RolePermissions[] {
    const roleMap = new Map<string, RolePermissions>();

    permissions.forEach((permission) => {
      const { role, resource, action } = permission;

      if (!roleMap.has(role.id)) {
        roleMap.set(role.id, {
          role: new Role(role),
          permissions: [],
        });
      }

      const roleEntry = roleMap.get(role.id)!;

      let resourceEntry = roleEntry.permissions.find(
        (p) => p.resource.getId() === resource.id,
      );

      if (!resourceEntry) {
        resourceEntry = {
          resource: new PermissionResource({
            id: resource.id,
            name: resource.name as PermissionResourceName,
          }),
          actions: [],
        };
        roleEntry.permissions.push(resourceEntry);
      }

      const actionExists = resourceEntry.actions.some(
        (a) => a.getId() === action.id,
      );
      if (!actionExists) {
        resourceEntry.actions.push(
          new PermissionAction({
            id: action.id,
            name: action.name as PermissionActionName,
          }),
        );
      }
    });

    const result = Array.from(roleMap.values());
    return result;
  }
}
