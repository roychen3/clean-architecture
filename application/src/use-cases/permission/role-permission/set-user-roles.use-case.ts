import { BaseError, NoPermissionError } from '@ca/core';

import {
  RolePermissionsRepository,
  UserSessionsRepository,
} from '../../../repositories';
import { PermissionService } from '../../../services';

import { SetUserRolesUseCaseError } from './role-permissions.errors';

export type SetUserRolesRequestDTO = {
  userId: string;
  roleIds: string[];
};

export type SetUserRolesResponseDTO = void;

export class SetUserRolesUseCase {
  private rolePermissionsRepository: RolePermissionsRepository;
  private userSessionsRepository: UserSessionsRepository;
  private permissionService: PermissionService;

  constructor(options: {
    rolePermissionsRepository: RolePermissionsRepository;
    userSessionsRepository: UserSessionsRepository;
    permissionService: PermissionService;
  }) {
    this.rolePermissionsRepository = options.rolePermissionsRepository;
    this.userSessionsRepository = options.userSessionsRepository;
    this.permissionService = options.permissionService;
  }

  async execute(
    request: SetUserRolesRequestDTO,
    executer: string,
  ): Promise<SetUserRolesResponseDTO> {
    try {
      const isOwn = request.userId === executer;
      let isTargetSuperAdmin = false;
      let isExecuterSuperAdmin = false;
      const can = await this.permissionService.can(
        executer,
        'update',
        'permissions',
        {
          target: {
            userId: request.userId,
          },
          validator: async (executerRolePermissions, targetRoles) => {
            if (targetRoles?.length === 0) {
              return true;
            }

            const targetIsSuperAdmin = targetRoles?.some((rolePermission) =>
              rolePermission.getIsSuperAdminRole(),
            );
            if (targetIsSuperAdmin && !isOwn) {
              isTargetSuperAdmin = true;
              return false;
            }

            const executerSuperAdminRolePermission =
              executerRolePermissions.find((rolePermission) =>
                rolePermission.role.getIsSuperAdminRole(),
              );
            if (
              isOwn &&
              !!executerSuperAdminRolePermission &&
              !request.roleIds.includes(
                executerSuperAdminRolePermission.role.getId(),
              )
            ) {
              isExecuterSuperAdmin = true;
              return false;
            }

            return true;
          },
        },
      );
      if (!can) {
        let message: string | undefined;
        if (isTargetSuperAdmin) {
          message =
            'Target user is Super Admin. You cannot change their roles.';
        }
        if (isExecuterSuperAdmin) {
          message = 'Super Admin must retain `super-admin` role.';
        }
        throw new NoPermissionError({ message });
      }

      await this.rolePermissionsRepository.setUserRoles(
        request.userId,
        request.roleIds,
      );
      await this.userSessionsRepository.deleteByUser(request.userId);
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new SetUserRolesUseCaseError(
        error instanceof Error ? error : undefined,
      );
    }
  }
}
