import { BaseError, NoPermissionError } from '@ca/core';

import { UsersRepository } from '../../repositories';
import { PermissionService } from '../../services';

import { DeleteUserUseCaseError, UserNotFoundError } from './users.errors';

export type DeleteUserRequestDTO = {
  id: string;
};

export type DeleteUserResponseDTO = void;

export class DeleteUserUseCase {
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
    request: DeleteUserRequestDTO,
    executer: string,
  ): Promise<DeleteUserResponseDTO> {
    try {
      const isOwn = request.id === executer;
      if (isOwn) {
        const message = 'You cannot delete yourself';
        throw new NoPermissionError({ message });
      }

      let isTargetSuperAdmin = false;
      const can = await this.permissionService.can(
        executer,
        'delete',
        'users',
        {
          target: {
            userId: request.id,
          },
          validator: async (_executerRolePermissions, targetRoles) => {
            const targetIsSuperAdmin = targetRoles?.some((rolePermission) =>
              rolePermission.getIsSuperAdminRole(),
            );
            if (targetIsSuperAdmin) {
              isTargetSuperAdmin = true;
              return false;
            }

            return true;
          },
        },
      );
      if (!can) {
        let message: string | undefined = undefined;
        if (isTargetSuperAdmin) {
          message = 'Super Admin cannot be deleted';
        }
        throw new NoPermissionError({ message });
      }

      const user = await this.usersRepository.findById(request.id);
      if (!user) {
        throw new UserNotFoundError(request.id);
      }

      await this.usersRepository.delete(user.getId());
    } catch (error) {
      if (error instanceof BaseError) {
        throw error;
      }
      throw new DeleteUserUseCaseError(
        error instanceof Error ? error : undefined,
      );
    }
  }
}
