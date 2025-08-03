import { BaseError, NoPermissionError } from '@ca/core';

import { RolesRepository } from '../../../repositories';
import { PermissionService } from '../../../services';

import {
  DeleteRoleUseCaseError,
  RoleNotFoundError,
  CannotDeleteSuperAdminRoleError,
} from './role.errors';

export type DeleteRoleRequestDTO = {
  id: string;
};

export type DeleteRoleResponseDTO = void;

export class DeleteRoleUseCase {
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
    request: DeleteRoleRequestDTO,
    executer: string,
  ): Promise<DeleteRoleResponseDTO> {
    try {
      const can = await this.permissionService.can(executer, 'delete', 'roles');
      if (!can) {
        throw new NoPermissionError();
      }

      const role = await this.rolesRepository.findById(request.id);
      if (!role) {
        throw new RoleNotFoundError(request.id);
      }
      if (role.getIsSuperAdminRole()) {
        throw new CannotDeleteSuperAdminRoleError();
      }

      await this.rolesRepository.delete(request.id);
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DeleteRoleUseCaseError(
        error instanceof Error ? error : undefined,
      );
    }
  }
}
