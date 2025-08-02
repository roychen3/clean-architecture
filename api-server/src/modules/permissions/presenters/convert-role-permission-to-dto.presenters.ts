import { RolePermissions } from '@ca/core';

import { RolePermissionDTO } from '../permissions.dto';

export function convertRolePermissionToDTO(
  data: RolePermissions,
): RolePermissionDTO {
  const result = {
    role: {
      id: data.role.getId(),
      name: data.role.getName(),
      priority: data.role.getPriority(),
    },
    permissions: data.permissions.map((permission) => ({
      resource: {
        id: permission.resource.getId(),
        name: permission.resource.getName(),
      },
      actions: permission.actions.map((action) => ({
        id: action.getId(),
        name: action.getName(),
      })),
    })),
  };
  return result;
}
