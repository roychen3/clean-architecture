import {
  PermissionActionName,
  PermissionResourceName,
  Role,
  RolePermissions,
} from '@ca/core';

export type Target = {
  userId: string;
  own?: boolean;
  priority?: '$eq' | '$gt' | '$gte' | '$lt' | '$lte';
};

export interface PermissionService {
  can(
    subjectId: string,
    action: PermissionActionName,
    resource: PermissionResourceName,
    conditions?: {
      target?: Target;
      validator?: (
        subjectRolePermissions: RolePermissions[],
        targetRoles: Role[] | null,
      ) => Promise<boolean>;
    },
  ): Promise<boolean>;
}
