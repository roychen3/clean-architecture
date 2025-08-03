import { Role, BaseError, NoPermissionError } from '@ca/core';

import { RolesRepository } from '../../../repositories';
import { PermissionService } from '../../../services';

import { CreateRoleUseCaseError } from './role.errors';

export type CreateRoleRequestDTO = {
  name: string;
  priority?: number;
};

export type CreateRoleResponseDTO = Role;

export class CreateRoleUseCase {
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
    request: CreateRoleRequestDTO,
    executer: string,
  ): Promise<CreateRoleResponseDTO> {
    try {
      const can = await this.permissionService.can(executer, 'create', 'roles');
      if (!can) {
        throw new NoPermissionError();
      }

      const result = new Role(request);
      await this.rolesRepository.create(result);
      return result;
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new CreateRoleUseCaseError(
        error instanceof Error ? error : undefined,
      );
    }
  }
}
