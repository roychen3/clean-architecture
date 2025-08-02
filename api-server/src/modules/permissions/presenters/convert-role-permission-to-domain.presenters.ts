import {
  PermissionAction,
  PermissionActionName,
  PermissionResource,
  PermissionResourceName,
  Role,
  RolePermissions,
} from '@ca/core';

import { RolePermissionDTO } from '../permissions.dto';

export function convertRolePermissionToDomain(
  data: RolePermissionDTO,
): RolePermissions {
  const result = {
    role: new Role({
      id: data.role.id,
      name: data.role.name,
      priority: data.role.priority,
    }),
    permissions: data.permissions.map((permission) => ({
      resource: new PermissionResource({
        id: permission.resource.id,
        name: permission.resource.name as PermissionResourceName,
      }),
      actions: permission.actions.map(
        (action) =>
          new PermissionAction({
            id: action.id,
            name: action.name as PermissionActionName,
          }),
      ),
    })),
  };
  return result;
}
