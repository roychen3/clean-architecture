import { Role, PermissionResource, PermissionAction } from './entities';

export type RolePermissions = {
  role: Role;
  permissions: {
    resource: PermissionResource;
    actions: PermissionAction[];
  }[];
};
