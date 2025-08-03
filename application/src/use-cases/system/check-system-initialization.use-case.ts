import {
  UsersRepository,
  RolesRepository,
  RolePermissionsRepository,
} from '../../repositories';

export type CheckSystemInitializationRequestDTO = void;

export type CheckSystemInitializationResponseDTO = {
  checkPass: boolean;
  missingMessages: string[];
};

export class CheckSystemInitializationUseCase {
  private usersRepository: UsersRepository;
  private rolesRepository: RolesRepository;
  private rolePermissionsRepository: RolePermissionsRepository;

  constructor(options: {
    usersRepository: UsersRepository;
    rolesRepository: RolesRepository;
    rolePermissionsRepository: RolePermissionsRepository;
  }) {
    this.usersRepository = options.usersRepository;
    this.rolesRepository = options.rolesRepository;
    this.rolePermissionsRepository = options.rolePermissionsRepository;
  }

  async execute(): Promise<CheckSystemInitializationResponseDTO> {
    const missingMessages: string[] = [];

    const superAdminRole = await this.rolesRepository.findByName('super-admin');
    if (!superAdminRole) {
      missingMessages.push(
        `No 'super-admin' role found. Please create a 'super-admin' role.`,
      );
    }

    const userRole = await this.rolesRepository.findByName('user');
    if (!userRole) {
      missingMessages.push(
        `No 'user' role found. Please create a 'user' role.`,
      );
    }

    let hasSuperAdmin = false;

    if (superAdminRole) {
      const users = await this.usersRepository.findAll();

      for (const user of users) {
        const userRoles = await this.rolePermissionsRepository.getUserRoles(
          user.getId(),
        );
        if (userRoles.some((role) => role.getId() === superAdminRole.getId())) {
          hasSuperAdmin = true;
          break;
        }
      }
    }

    if (!hasSuperAdmin) {
      missingMessages.push(
        `No user with 'super-admin' role found. Please create a super admin user.`,
      );
    }

    const result = {
      checkPass: missingMessages.length === 0,
      missingMessages,
    };
    return result;
  }
}
