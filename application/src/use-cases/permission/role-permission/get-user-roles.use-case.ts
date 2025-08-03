import { Role, BaseError, NoPermissionError } from '@ca/core';

import { RolePermissionsRepository } from '../../../repositories';
import { PermissionService } from '../../../services';

import { GetUserRolesUseCaseError } from './role-permissions.errors';

export type GetUserRolesRequestDTO = {
  userId: string;
};

export type GetUserRolesResponseDTO = Role[];

export class GetUserRolesUseCase {
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
    request: GetUserRolesRequestDTO,
    executer: string,
  ): Promise<GetUserRolesResponseDTO> {
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
        await this.rolePermissionsRepository.getUserRoles(request.userId);
      return permissionResource;
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new GetUserRolesUseCaseError(
        error instanceof Error ? error : undefined,
      );
    }
  }
}
