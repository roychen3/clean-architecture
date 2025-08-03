import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { Role, User } from '@ca/core';

import {
  UsersRepository,
  RolesRepository,
  RolePermissionsRepository,
} from '../../repositories';

import { CheckSystemInitializationUseCase } from './check-system-initialization.use-case';

describe('CheckSystemInitializationUseCase', () => {
  let usersRepository: Mocked<UsersRepository>;
  let rolesRepository: Mocked<RolesRepository>;
  let rolePermissionsRepository: Mocked<RolePermissionsRepository>;
  let useCase: CheckSystemInitializationUseCase;
  let superAdminRole: Role;
  let userRole: Role;
  let user: User;

  beforeEach(() => {
    usersRepository = {
      findAll: vi.fn(),
    } as unknown as Mocked<UsersRepository>;

    rolesRepository = {
      findByName: vi.fn(),
    } as unknown as Mocked<RolesRepository>;

    rolePermissionsRepository = {
      getUserRoles: vi.fn(),
    } as unknown as Mocked<RolePermissionsRepository>;

    useCase = new CheckSystemInitializationUseCase({
      usersRepository,
      rolesRepository,
      rolePermissionsRepository,
    });

    superAdminRole = new Role({
      id: '1',
      name: 'super-admin',
    });

    userRole = new Role({
      id: '2',
      name: 'user',
    });

    user = new User({
      id: 'u1',
      email: 'user@example.com',
      password: 'password',
      name: 'User',
    });
  });

  it('should pass when all roles and a super-admin user exist', async () => {
    rolesRepository.findByName.mockImplementation((name: string) => {
      if (name === 'super-admin') return Promise.resolve(superAdminRole);
      if (name === 'user') return Promise.resolve(userRole);
      return Promise.resolve(null);
    });
    usersRepository.findAll.mockResolvedValue([user]);
    rolePermissionsRepository.getUserRoles.mockResolvedValue([superAdminRole]);

    const result = await useCase.execute();
    expect(result.checkPass).toBe(true);
    expect(result.missingMessages).toEqual([]);
  });

  it('should fail if super-admin role is missing', async () => {
    rolesRepository.findByName.mockImplementation((name: string) => {
      if (name === 'super-admin') return Promise.resolve(null);
      if (name === 'user') return Promise.resolve(userRole);
      return Promise.resolve(null);
    });

    const result = await useCase.execute();
    expect(result.checkPass).toBe(false);
    expect(result.missingMessages).toContain(
      `No 'super-admin' role found. Please create a 'super-admin' role.`,
    );
  });

  it('should fail if user role is missing', async () => {
    rolesRepository.findByName.mockImplementation((name: string) => {
      if (name === 'super-admin') return Promise.resolve(superAdminRole);
      if (name === 'user') return Promise.resolve(null);
      return Promise.resolve(null);
    });
    usersRepository.findAll.mockResolvedValue([]);
    rolePermissionsRepository.getUserRoles.mockResolvedValue([]);

    const result = await useCase.execute();
    expect(result.checkPass).toBe(false);
    expect(result.missingMessages).toContain(
      `No 'user' role found. Please create a 'user' role.`,
    );
  });

  it('should fail if no user has super-admin role', async () => {
    rolesRepository.findByName.mockImplementation((name: string) => {
      if (name === 'super-admin') return Promise.resolve(superAdminRole);
      if (name === 'user') return Promise.resolve(userRole);
      return Promise.resolve(null);
    });
    usersRepository.findAll.mockResolvedValue([user]);
    rolePermissionsRepository.getUserRoles.mockResolvedValue([userRole]);

    const result = await useCase.execute();
    expect(result.checkPass).toBe(false);
    expect(result.missingMessages).toContain(
      `No user with 'super-admin' role found. Please create a super admin user.`,
    );
  });
});
