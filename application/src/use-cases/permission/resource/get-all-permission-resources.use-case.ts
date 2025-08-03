import { PermissionResource, BaseError, NoPermissionError } from '@ca/core';

import { PermissionResourcesRepository } from '../../../repositories';
import { PermissionService } from '../../../services';

import { GetAllPermissionResourcesUseCaseError } from './resources.errors';

export type GetAllPermissionResourcesRequestDTO = void;

export type GetAllPermissionResourcesResponseDTO = PermissionResource[];

export class GetAllPermissionResourcesUseCase {
  private permissionResourcesRepository: PermissionResourcesRepository;
  private permissionService: PermissionService;

  constructor(options: {
    permissionResourcesRepository: PermissionResourcesRepository;
    permissionService: PermissionService;
  }) {
    this.permissionResourcesRepository = options.permissionResourcesRepository;
    this.permissionService = options.permissionService;
  }

  async execute(
    executer: string,
  ): Promise<GetAllPermissionResourcesResponseDTO> {
    try {
      const can = await this.permissionService.can(
        executer,
        'read',
        'permissions',
      );
      if (!can) {
        throw new NoPermissionError();
      }

      const permissionResources =
        await this.permissionResourcesRepository.findAll();
      return permissionResources;
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new GetAllPermissionResourcesUseCaseError(
        error instanceof Error ? error : undefined,
      );
    }
  }
}
