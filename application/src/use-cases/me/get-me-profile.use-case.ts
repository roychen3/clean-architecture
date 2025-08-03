import { User, BaseError, NoPermissionError } from '@ca/core';

import { UsersRepository } from '../../repositories';
import { PermissionService } from '../../services';

import { MeUserNotFoundError, GetMeProfileUseCaseError } from './me.errors';

export type GetMeProfileRequestDTO = {
  id: string;
};

export type GetMeProfileResponseDTO = User;

export class GetMeProfileUseCase {
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
    request: GetMeProfileRequestDTO,
    executer: string,
  ): Promise<GetMeProfileResponseDTO> {
    try {
      const can = await this.permissionService.can(executer, 'update', 'me', {
        target: {
          userId: executer,
          own: true,
        },
      });
      if (!can) {
        throw new NoPermissionError();
      }

      const user = await this.usersRepository.findById(request.id);
      if (!user) {
        throw new MeUserNotFoundError();
      }

      return user;
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new GetMeProfileUseCaseError(
        error instanceof Error ? error : undefined,
      );
    }
  }
}
