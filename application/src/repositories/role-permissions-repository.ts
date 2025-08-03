import { Role, RolePermissions, User } from '@ca/core';

export interface RolePermissionsRepository {
  setRolePermissions(data: {
    roleId: string;
    permissions: {
      resourceId: string;
      actionIds: string[];
    }[];
  }): Promise<void>;
  getRolePermissions(roleId: string): Promise<RolePermissions | null>;
  getAllRolePermissions(): Promise<RolePermissions[]>;

  assignRoleToUser(userId: string, roleId: string): Promise<void>;
  removeRoleFromUser(userId: string, roleId: string): Promise<void>;
  setUserRoles(userId: string, roleIds: string[]): Promise<void>;

  getUserRoles(userId: string): Promise<Role[]>;
  getUserPermissions(userId: string): Promise<RolePermissions[]>;

  getUsersByRole(roleId: string): Promise<User[]>;

  checkUserPermission(
    userId: string,
    resourceName: string,
    actionName: string,
  ): Promise<boolean>;
}
