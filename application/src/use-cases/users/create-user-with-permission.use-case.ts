import { User, BaseError, NoPermissionError } from '@ca/core';

import { PermissionService } from '../../services';

import { CreateUserUseCaseError } from './users.errors';
import { CreateUserUseCase } from './create-user.use-case';

export type CreateUserWithPermissionRequestDTO = {
  email: string;
  password: string;
  name: string;
};

export type CreateUserWithPermissionResponseDTO = User;

export class CreateUserWithPermissionUseCase {
  private createUserUseCase: CreateUserUseCase;
  private permissionService: PermissionService;

  constructor(options: {
    createUserUseCase: CreateUserUseCase;
    permissionService: PermissionService;
  }) {
    this.createUserUseCase = options.createUserUseCase;
    this.permissionService = options.permissionService;
  }

  async execute(
    request: CreateUserWithPermissionRequestDTO,
    executer: string,
  ): Promise<CreateUserWithPermissionResponseDTO> {
    try {
      const can = await this.permissionService.can(executer, 'create', 'users');
      if (!can) {
        throw new NoPermissionError();
      }

      const result = await this.createUserUseCase.execute(request);
      return result;
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new CreateUserUseCaseError(
        error instanceof Error ? error : undefined,
      );
    }
  }
}
