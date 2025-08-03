import { Role, BaseError, NoPermissionError } from '@ca/core';

import { RolesRepository } from '../../../repositories';
import { PermissionService } from '../../../services';

import { GetAllRolesUseCaseError } from './role.errors';

export type GetAllRolesRequestDTO = void;

export type GetAllRolesResponseDTO = Role[];

export class GetAllRolesUseCase {
  private rolesRepository: RolesRepository;
  private permissionService: PermissionService;

  constructor(options: {
    rolesRepository: RolesRepository;
    permissionService: PermissionService;
  }) {
    this.rolesRepository = options.rolesRepository;
    this.permissionService = options.permissionService;
  }

  async execute(executer: string): Promise<GetAllRolesResponseDTO> {
    try {
      const can = await this.permissionService.can(executer, 'read', 'roles');
      if (!can) {
        throw new NoPermissionError();
      }

      const roles = await this.rolesRepository.findAll();
      return roles;
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new GetAllRolesUseCaseError(
        error instanceof Error ? error : undefined,
      );
    }
  }
}
