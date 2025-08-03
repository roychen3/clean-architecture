import { Role, BaseError, NoPermissionError } from '@ca/core';

import { RolesRepository } from '../../../repositories';
import { PermissionService } from '../../../services';

import { GetRoleUseCaseError, RoleNotFoundError } from './role.errors';

export type GetRoleRequestDTO = { id: string };

export type GetRoleResponseDTO = Role;

export class GetRoleUseCase {
  private rolesRepository: RolesRepository;
  private permissionService: PermissionService;

  constructor(options: {
    rolesRepository: RolesRepository;
    permissionService: PermissionService;
  }) {
    this.rolesRepository = options.rolesRepository;
    this.permissionService = options.permissionService;
  }

  async execute(
    request: GetRoleRequestDTO,
    executer: string,
  ): Promise<GetRoleResponseDTO> {
    try {
      const can = await this.permissionService.can(executer, 'read', 'roles');
      if (!can) {
        throw new NoPermissionError();
      }

      const role = await this.rolesRepository.findById(request.id);
      if (!role) {
        throw new RoleNotFoundError(request.id);
      }

      return role;
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new GetRoleUseCaseError(error instanceof Error ? error : undefined);
    }
  }
}
