import { BaseError, NoPermissionError } from '@ca/core';

import { UsersRepository } from '../../repositories';
import { PermissionService } from '../../services';

import { UpdateUserUseCaseError, UserNotFoundError } from './users.errors';

export type UpdateUserRequestDTO = {
  id: string;
  name?: string;
};

export type UpdateUserResponseDTO = void;

export class UpdateUserUseCase {
  private usersRepository: UsersRepository;
  private permissionService: PermissionService;

  constructor(options: {
    usersRepository: UsersRepository;
    permissionService: PermissionService;
  }) {
    this.usersRepository = options.usersRepository;
    this.permissionService = options.permissionService;
  }

  async execute(
    request: UpdateUserRequestDTO,
    executer: string,
  ): Promise<UpdateUserResponseDTO> {
    try {
      const can = await this.permissionService.can(executer, 'update', 'users');
      if (!can) {
        throw new NoPermissionError();
      }

      const user = await this.usersRepository.findById(request.id);
      if (!user) {
        throw new UserNotFoundError(request.id);
      }
      if (request.name) {
        user.setName(request.name);
      }

      await this.usersRepository.update(user);
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new UpdateUserUseCaseError(
        error instanceof Error ? error : undefined,
      );
    }
  }
}
