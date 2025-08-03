import { BaseError, NoPermissionError } from '@ca/core';

import {
  RolePermissionsRepository,
  UserSessionsRepository,
} from '../../../repositories';
import { PermissionService } from '../../../services';

import { SetRolePermissionsUseCaseError } from './role-permissions.errors';

export type SetRolePermissionRequestDTO = {
  roleId: string;
  permissions: {
    resourceId: string;
    actionIds: string[];
  }[];
};

export type SetRolePermissionResponseDTO = void;

export class SetRolePermissionUseCase {
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
    request: SetRolePermissionRequestDTO,
    executer: string,
  ): Promise<SetRolePermissionResponseDTO> {
    try {
      let isSuperAdmin = false;
      const can = await this.permissionService.can(
        executer,
        'update',
        'permissions',
        {
          validator: async (executerRolePermissions) => {
            const superAdminRolePermissions = executerRolePermissions.find(
              (rolePermission) => rolePermission.role.getIsSuperAdminRole(),
            );
            if (!superAdminRolePermissions) {
              return true;
            }

            isSuperAdmin = true;
            if (superAdminRolePermissions.role.getId() === request.roleId) {
              return false;
            }

            return true;
          },
        },
      );
      if (!can) {
        let message: string | undefined;
        if (isSuperAdmin) {
          message = 'Super Admin must retain all permissions.';
        }
        throw new NoPermissionError({ message });
      }

      await this.rolePermissionsRepository.setRolePermissions(request);
      const users = await this.rolePermissionsRepository.getUsersByRole(
        request.roleId,
      );
      for (const user of users) {
        this.userSessionsRepository.deleteByUser(user.getId());
      }
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new SetRolePermissionsUseCaseError(
        error instanceof Error ? error : undefined,
      );
    }
  }
}
