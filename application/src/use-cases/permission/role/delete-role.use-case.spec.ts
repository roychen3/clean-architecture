import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { Role, NoPermissionError } from '@ca/core';

import { PermissionService } from '../../../services';
import { RolesRepository } from '../../../repositories';

import {
  DeleteRoleUseCaseError,
  RoleNotFoundError,
  CannotDeleteSuperAdminRoleError,
} from './role.errors';
import {
  DeleteRoleUseCase,
  DeleteRoleRequestDTO,
} from './delete-role.use-case';

describe('DeleteRoleUseCase', () => {
  let rolesRepository: Mocked<RolesRepository>;
  let permissionService: Mocked<PermissionService>;
  let useCase: DeleteRoleUseCase;
  let request: DeleteRoleRequestDTO;
  let executer: string;
  let role: Mocked<Role>;
  let superAdminRole: Mocked<Role>;

  beforeEach(() => {
    rolesRepository = {
      findById: vi.fn(),
      delete: vi.fn(),
    } as unknown as Mocked<RolesRepository>;

    permissionService = {
      can: vi.fn(),
    } as unknown as Mocked<PermissionService>;

    useCase = new DeleteRoleUseCase({
      rolesRepository,
      permissionService,
    });

    request = { id: 'role-1' };

    executer = 'user-1';

    role = {
      getIsSuperAdminRole: vi.fn().mockReturnValue(false),
    } as unknown as Mocked<Role>;

    superAdminRole = {
      getIsSuperAdminRole: vi.fn().mockReturnValue(true),
    } as unknown as Mocked<Role>;
  });

  it('should delete a role with valid ID', async () => {
    permissionService.can.mockResolvedValue(true);
    rolesRepository.findById.mockResolvedValue(role);
    rolesRepository.delete.mockResolvedValue(undefined);

    await expect(useCase.execute(request, executer)).resolves.toBeUndefined();
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'delete',
      'roles',
    );
    expect(rolesRepository.findById).toHaveBeenCalledWith(request.id);
    expect(rolesRepository.delete).toHaveBeenCalledWith(request.id);
  });

  it('should throw NoPermissionError if user lacks delete permissions', async () => {
    permissionService.can.mockResolvedValue(false);

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      NoPermissionError,
    );
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'delete',
      'roles',
    );
    expect(rolesRepository.findById).not.toHaveBeenCalled();
    expect(rolesRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw CannotDeleteSuperAdminRoleError if trying to delete super admin role', async () => {
    permissionService.can.mockResolvedValue(true);
    rolesRepository.findById.mockResolvedValue(superAdminRole);

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      CannotDeleteSuperAdminRoleError,
    );
    expect(rolesRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw RoleNotFoundError if role does not exist', async () => {
    permissionService.can.mockResolvedValue(true);
    rolesRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      RoleNotFoundError,
    );
    expect(rolesRepository.delete).not.toHaveBeenCalled();
  });

  it('should throw DeleteRoleUseCaseError on unexpected error', async () => {
    permissionService.can.mockRejectedValue(new Error('Unexpected error'));

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      DeleteRoleUseCaseError,
    );
  });
});
