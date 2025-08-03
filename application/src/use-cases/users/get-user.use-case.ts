import { User, BaseError, NoPermissionError } from '@ca/core';

import { UsersRepository } from '../../repositories';
import { PermissionService } from '../../services';

import { UserNotFoundError, GetUserUseCaseError } from './users.errors';

export type GetUserRequestDTO = {
  id: string;
};

export type GetUserResponseDTO = User;

export class GetUserUseCase {
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
    request: GetUserRequestDTO,
    executer: string,
  ): Promise<GetUserResponseDTO> {
    try {
      const can = await this.permissionService.can(executer, 'read', 'users');
      if (!can) {
        throw new NoPermissionError();
      }

      const user = await this.usersRepository.findById(request.id);
      if (!user) {
        throw new UserNotFoundError(request.id);
      }

      return user;
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new GetUserUseCaseError(error instanceof Error ? error : undefined);
    }
  }
}
