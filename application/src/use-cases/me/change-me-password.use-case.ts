import { BaseError, NoPermissionError } from '@ca/core';

import { UsersRepository } from '../../repositories';
import { PasswordHasher, PermissionService } from '../../services';

import {
  MeUserNotFoundError,
  MeUserPasswordInvalidError,
  ChangeMePasswordUseCaseError,
} from './me.errors';

export type ChangeMePasswordRequestDTO = {
  id: string;
  oldPassword: string;
  newPassword: string;
};

export type ChangeMePasswordResponseDTO = void;

export class ChangeMePasswordUseCase {
  private usersRepository: UsersRepository;
  private passwordHasher: PasswordHasher;
  private permissionService: PermissionService;

  constructor(options: {
    usersRepository: UsersRepository;
    passwordHasher: PasswordHasher;
    permissionService: PermissionService;
  }) {
    this.usersRepository = options.usersRepository;
    this.passwordHasher = options.passwordHasher;
    this.permissionService = options.permissionService;
  }

  async execute(
    request: ChangeMePasswordRequestDTO,
    executer: string,
  ): Promise<ChangeMePasswordResponseDTO> {
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

      const isPasswordValidated = await this.passwordHasher.compare(
        request.oldPassword,
        user.getPassword(),
      );
      if (!isPasswordValidated) {
        throw new MeUserPasswordInvalidError();
      }

      user.setPassword(request.newPassword);
      const validateResponse = user.validate();
      if (validateResponse.error) {
        throw new MeUserPasswordInvalidError(validateResponse.error);
      }

      const hashedNewPassword = await this.passwordHasher.hash(
        request.newPassword,
      );
      user.setPassword(hashedNewPassword);
      await this.usersRepository.update(user);
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new ChangeMePasswordUseCaseError(
        error instanceof Error ? error : undefined,
      );
    }
  }
}
