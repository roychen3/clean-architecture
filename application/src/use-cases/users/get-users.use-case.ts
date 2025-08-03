import { User, BaseError, NoPermissionError } from '@ca/core';

import { UsersRepository } from '../../repositories';
import { PermissionService } from '../../services';

import { GetUsersUseCaseError } from './users.errors';

export type GetUsersRequestDTO = void;
export type GetUsersResponseDTO = User[];

export class GetUsersUseCase {
  private usersRepository: UsersRepository;
  private permissionService: PermissionService;

  constructor(options: {
    usersRepository: UsersRepository;
    permissionService: PermissionService;
  }) {
    this.usersRepository = options.usersRepository;
    this.permissionService = options.permissionService;
  }

  async execute(executer: string): Promise<GetUsersResponseDTO> {
    try {
      const can = await this.permissionService.can(executer, 'read', 'users');
      if (!can) {
        throw new NoPermissionError();
      }

      const result = await this.usersRepository.findAll();
      return result;
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new GetUsersUseCaseError(
        error instanceof Error ? error : undefined,
      );
    }
  }
}
