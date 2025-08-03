import { BaseError, NoPermissionError } from '@ca/core';

import { UsersRepository } from '../../repositories';
import { PermissionService } from '../../services';

import { MeUserNotFoundError, UpdateMeProfileUseCaseError } from './me.errors';

export type UpdateMeProfileRequestDTO = {
  id: string;
  name?: string;
};

export type UpdateMeProfileResponseDTO = void;

export class UpdateMeProfileUseCase {
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
    request: UpdateMeProfileRequestDTO,
    executer: string,
  ): Promise<UpdateMeProfileResponseDTO> {
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

      if (request.name) {
        user.setName(request.name);
      }
      await this.usersRepository.update(user);
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new UpdateMeProfileUseCaseError(
        error instanceof Error ? error : undefined,
      );
    }
  }
}
