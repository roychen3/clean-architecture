import { BaseError, PermissionAction, NoPermissionError } from '@ca/core';

import { PermissionActionsRepository } from '../../../repositories';
import { PermissionService } from '../../../services';

import { GetAllPermissionActionsUseCaseError } from './actions.errors';

export type GetAllPermissionActionsRequestDTO = void;

export type GetAllPermissionActionsResponseDTO = PermissionAction[];

export class GetAllPermissionActionsUseCase {
  private permissionActionsRepository: PermissionActionsRepository;
  private permissionService: PermissionService;

  constructor(options: {
    permissionActionsRepository: PermissionActionsRepository;
    permissionService: PermissionService;
  }) {
    this.permissionActionsRepository = options.permissionActionsRepository;
    this.permissionService = options.permissionService;
  }

  async execute(executer: string): Promise<GetAllPermissionActionsResponseDTO> {
    try {
      const can = await this.permissionService.can(
        executer,
        'read',
        'permissions',
      );
      if (!can) {
        throw new NoPermissionError();
      }

      const permissionActions =
        await this.permissionActionsRepository.findAll();
      return permissionActions;
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new GetAllPermissionActionsUseCaseError(
        error instanceof Error ? error : undefined,
      );
    }
  }
}
