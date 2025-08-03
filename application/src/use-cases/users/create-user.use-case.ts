import { User, BaseError } from '@ca/core';

import {
  UsersRepository,
  RolesRepository,
  RolePermissionsRepository,
} from '../../repositories';
import { PasswordHasher } from '../../services';

import {
  CreateUserUseCaseError,
  UserAlreadyExistsError,
  InvalidUserDataError,
} from './users.errors';

export type CreateUserRequestDTO = {
  email: string;
  password: string;
  name: string;
};

export type CreateUserResponseDTO = User;

export class CreateUserUseCase {
  private usersRepository: UsersRepository;
  private rolesRepository: RolesRepository;
  private rolePermissionsRepository: RolePermissionsRepository;
  private passwordHasher: PasswordHasher;

  constructor(options: {
    usersRepository: UsersRepository;
    rolesRepository: RolesRepository;
    rolePermissionsRepository: RolePermissionsRepository;
    passwordHasher: PasswordHasher;
  }) {
    this.usersRepository = options.usersRepository;
    this.rolesRepository = options.rolesRepository;
    this.rolePermissionsRepository = options.rolePermissionsRepository;
    this.passwordHasher = options.passwordHasher;
  }

  async execute(request: CreateUserRequestDTO): Promise<CreateUserResponseDTO> {
    try {
      const { email, password, name } = request;
      const userRole = await this.rolesRepository.findByName('user');
      if (!userRole) {
        throw new CreateUserUseCaseError(new Error('User role not found'));
      }

      const existingUser = await this.usersRepository.findByEmail(email);
      if (existingUser) {
        throw new UserAlreadyExistsError();
      }

      const newUser = new User({ email, password, name });
      const validateResponse = newUser.validate();
      if (validateResponse.error) {
        throw new InvalidUserDataError(validateResponse.error);
      }

      const hashedPassword = await this.passwordHasher.hash(password);
      newUser.setPassword(hashedPassword);
      await this.usersRepository.create(newUser);
      await this.rolePermissionsRepository.assignRoleToUser(
        newUser.getId(),
        userRole.getId(),
      );
      return newUser;
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
