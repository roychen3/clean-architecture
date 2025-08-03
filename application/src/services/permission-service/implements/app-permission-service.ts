import {
  PermissionActionName,
  PermissionResourceName,
  Role,
  RolePermissions,
} from '@ca/core';

import { RolePermissionsRepository } from '../../../repositories';

import { PermissionService, Target } from '../interface';

export class AppPermissionService implements PermissionService {
  private rolePermissionsRepository: RolePermissionsRepository;

  constructor(rolePermissionsRepository: RolePermissionsRepository) {
    this.rolePermissionsRepository = rolePermissionsRepository;
  }

  async can(
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
  ): Promise<boolean> {
    const subjectRolePermissions =
      await this.rolePermissionsRepository.getUserPermissions(subjectId);
    if (subjectRolePermissions.length === 0) {
      return false;
    }

    const subjectRolePriorities = subjectRolePermissions.map((rolePermission) =>
      rolePermission.role.getPriority(),
    );
    const maxSubjectPriority = Math.max(
      Role.NO_PERMISSIONS,
      ...subjectRolePriorities,
    );
    if (maxSubjectPriority === Role.NO_PERMISSIONS) {
      return false;
    }
    if (!this.hasPermission(subjectRolePermissions, resource, action)) {
      return false;
    }

    let targetRoles: Role[] | null = null;
    if (conditions?.target) {
      const { userId, own, priority } = conditions.target;

      targetRoles = await this.rolePermissionsRepository.getUserRoles(userId);

      const skipTargetChecks = subjectId === userId;
      if (!skipTargetChecks) {
        if (own && userId !== subjectId) {
          return false;
        }
        if (priority) {
          const targetRolePriorities = targetRoles.map((role) =>
            role.getPriority(),
          );
          const maxTargetPriority = Math.max(
            Role.NO_PERMISSIONS,
            ...targetRolePriorities,
          );
          if (
            !this.comparePriority(
              maxSubjectPriority,
              maxTargetPriority,
              priority,
            )
          ) {
            return false;
          }
        }
      }
    }

    if (conditions?.validator) {
      try {
        const isValid = await conditions.validator(
          subjectRolePermissions,
          targetRoles,
        );
        if (!isValid) return false;
      } catch {
        return false;
      }
    }

    return true;
  }

  private comparePriority(
    subjectPriority: number,
    targetPriority: number,
    operator: '$eq' | '$gt' | '$gte' | '$lt' | '$lte',
  ): boolean {
    switch (operator) {
      case '$eq':
        return subjectPriority === targetPriority;
      case '$gt':
        return subjectPriority > targetPriority;
      case '$gte':
        return subjectPriority >= targetPriority;
      case '$lt':
        return subjectPriority < targetPriority;
      case '$lte':
        return subjectPriority <= targetPriority;
      default:
        return false;
    }
  }

  private hasPermission(
    rolePermissions: RolePermissions[],
    resource: PermissionResourceName,
    action: PermissionActionName,
  ): boolean {
    return rolePermissions.some((rolePermission) =>
      rolePermission.permissions.some(
        (permission) =>
          permission.resource.getName() === resource &&
          permission.actions.some(
            (permittedAction) => permittedAction.getName() === action,
          ),
      ),
    );
  }
}
