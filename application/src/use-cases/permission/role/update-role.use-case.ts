import { Role, BaseError, NoPermissionError } from '@ca/core';

import { RolesRepository } from '../../../repositories';
import { PermissionService } from '../../../services';

import {
  UpdateRoleUseCaseError,
  RoleNotFoundError,
  InvalidSuperAdminPriorityError,
} from './role.errors';

export type UpdateRoleRequestDTO = {
  id: string;
  name?: string;
  priority?: number;
};

export type UpdateRoleResponseDTO = Role;

export class UpdateRoleUseCase {
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
    request: UpdateRoleRequestDTO,
    executer: string,
  ): Promise<UpdateRoleResponseDTO> {
    try {
      const can = await this.permissionService.can(executer, 'update', 'roles');
      if (!can) {
        throw new NoPermissionError();
      }

      const role = await this.rolesRepository.findById(request.id);
      if (!role) {
        throw new RoleNotFoundError(request.id);
      }

      if (request.name) {
        role.setName(request.name);
      }
      if (request.priority !== undefined) {
        if (role.getIsSuperAdminRole() && request.priority !== 1) {
          throw new InvalidSuperAdminPriorityError();
        }
        role.setPriority(request.priority);
      }
      await this.rolesRepository.update(role);
      return role;
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new UpdateRoleUseCaseError(
        error instanceof Error ? error : undefined,
      );
    }
  }
}
