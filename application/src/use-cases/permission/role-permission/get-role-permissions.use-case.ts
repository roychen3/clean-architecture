import { BaseError, RolePermissions, NoPermissionError } from '@ca/core';

import { RolePermissionsRepository } from '../../../repositories';
import { PermissionService } from '../../../services';

import {
  GetRolePermissionsUseCaseError,
  RolePermissionsNotFoundError,
} from './role-permissions.errors';

export type GetRolePermissionsRequestDTO = {
  roleId: string;
};

export type GetRolePermissionsResponseDTO = RolePermissions;

export class GetRolePermissionsUseCase {
  private rolePermissionsRepository: RolePermissionsRepository;
  private permissionService: PermissionService;

  constructor(options: {
    rolePermissionsRepository: RolePermissionsRepository;
    permissionService: PermissionService;
  }) {
    this.rolePermissionsRepository = options.rolePermissionsRepository;
    this.permissionService = options.permissionService;
  }

  async execute(
    request: GetRolePermissionsRequestDTO,
    executer: string,
  ): Promise<GetRolePermissionsResponseDTO> {
    try {
      const can = await this.permissionService.can(
        executer,
        'read',
        'permissions',
      );
      if (!can) {
        throw new NoPermissionError();
      }

      const permissionResource =
        await this.rolePermissionsRepository.getRolePermissions(request.roleId);
      if (!permissionResource) {
        throw new RolePermissionsNotFoundError(request.roleId);
      }

      return permissionResource;
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new GetRolePermissionsUseCaseError(
        error instanceof Error ? error : undefined,
      );
    }
  }
}
