import { BaseError, NoPermissionError } from '@ca/core';

import { UsersRepository } from '../../repositories';
import { PasswordHasher, PermissionService } from '../../services';

import {
  MeUserNotFoundError,
  MeUserPasswordInvalidError,
  DeleteMeUseCaseError,
} from './me.errors';

export type DeleteMeRequestDTO = {
  id: string;
  password: string;
};

export type DeleteMeResponseDTO = void;

export class DeleteMeUseCase {
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
    request: DeleteMeRequestDTO,
    executer: string,
  ): Promise<DeleteMeResponseDTO> {
    try {
      let isSuperAdmin = false;
      const can = await this.permissionService.can(executer, 'delete', 'me', {
        target: {
          userId: executer,
          own: true,
        },
        validator: async (executerRolePermissions) => {
          const superAdminRolePermissions = executerRolePermissions.find(
            (rolePermission) => rolePermission.role.getIsSuperAdminRole(),
          );
          if (superAdminRolePermissions) {
            isSuperAdmin = true;
            return false;
          }
          return true;
        },
      });
      if (!can) {
        let message: string | undefined = undefined;
        if (isSuperAdmin) {
          message = 'Super Admin cannot be deleted';
        }
        throw new NoPermissionError({ message });
      }

      const user = await this.usersRepository.findById(request.id);
      if (!user) {
        throw new MeUserNotFoundError();
      }

      const isPasswordValidated = await this.passwordHasher.compare(
        request.password,
        user.getPassword(),
      );
      if (!isPasswordValidated) {
        throw new MeUserPasswordInvalidError();
      }

      await this.usersRepository.delete(request.id);
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DeleteMeUseCaseError(
        error instanceof Error ? error : undefined,
      );
    }
  }
}
