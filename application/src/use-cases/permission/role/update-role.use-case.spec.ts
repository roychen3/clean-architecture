import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import { Role, NoPermissionError } from '@ca/core';

import { PermissionService } from '../../../services';
import { RolesRepository } from '../../../repositories';

import {
  UpdateRoleUseCaseError,
  RoleNotFoundError,
  InvalidSuperAdminPriorityError,
} from './role.errors';
import {
  UpdateRoleUseCase,
  UpdateRoleRequestDTO,
} from './update-role.use-case';

describe('UpdateRoleUseCase', () => {
  let rolesRepository: Mocked<RolesRepository>;
  let permissionService: Mocked<PermissionService>;
  let useCase: UpdateRoleUseCase;
  let request: UpdateRoleRequestDTO;
  let executer: string;
  let role: Mocked<Role>;

  executer = 'user-1';

  beforeEach(() => {
    rolesRepository = {
      findById: vi.fn(),
      update: vi.fn(),
    } as unknown as Mocked<RolesRepository>;

    permissionService = {
      can: vi.fn(),
    } as unknown as Mocked<PermissionService>;

    useCase = new UpdateRoleUseCase({
      rolesRepository,
      permissionService,
    });

    request = { id: 'role-1', name: 'New Name', priority: 3 };

    executer = 'user-1';

    role = {
      getId: vi.fn(),
      setName: vi.fn(),
      setPriority: vi.fn(),
      getIsSuperAdminRole: vi.fn(),
    } as unknown as Mocked<Role>;
  });

  it('should update role when user has update permissions', async () => {
    permissionService.can.mockResolvedValue(true);
    rolesRepository.findById.mockResolvedValue(role);
    rolesRepository.update.mockResolvedValue(undefined);

    await expect(useCase.execute(request, executer)).resolves.toBe(role);
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'update',
      'roles',
    );
    expect(role.setName).toHaveBeenCalledWith(request.name);
    expect(role.setPriority).toHaveBeenCalledWith(request.priority);
    expect(rolesRepository.update).toHaveBeenCalledWith(role);
  });

  it('should throw NoPermissionError if user lacks update permissions', async () => {
    permissionService.can.mockResolvedValue(false);

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      NoPermissionError,
    );
    expect(permissionService.can).toHaveBeenCalledWith(
      executer,
      'update',
      'roles',
    );
    expect(rolesRepository.findById).not.toHaveBeenCalled();
    expect(rolesRepository.update).not.toHaveBeenCalled();
  });

  it('should throw RoleNotFoundError if role does not exist', async () => {
    permissionService.can.mockResolvedValue(true);
    rolesRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      RoleNotFoundError,
    );
    expect(rolesRepository.update).not.toHaveBeenCalled();
  });

  it('should throw InvalidSuperAdminPriorityError if trying to set priority for super admin role', async () => {
    permissionService.can.mockResolvedValue(true);
    rolesRepository.findById.mockResolvedValue(role);
    role.getIsSuperAdminRole.mockReturnValue(true);

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      InvalidSuperAdminPriorityError,
    );
    expect(role.setPriority).not.toHaveBeenCalled();
    expect(rolesRepository.update).not.toHaveBeenCalled();
  });

  it('should allow setting priority=1 for super admin role', async () => {
    permissionService.can.mockResolvedValue(true);
    rolesRepository.findById.mockResolvedValue(role);
    role.getIsSuperAdminRole.mockReturnValue(true);

    await expect(
      useCase.execute({ ...request, priority: 1 }, executer),
    ).resolves.toBe(role);
    expect(role.setPriority).toHaveBeenCalledWith(1);
  });

  it('should throw UpdateRoleUseCaseError on unexpected error', async () => {
    permissionService.can.mockRejectedValue(new Error('Unexpected error'));

    await expect(useCase.execute(request, executer)).rejects.toBeInstanceOf(
      UpdateRoleUseCaseError,
    );
  });

  it('should not update name or priority if not provided', async () => {
    permissionService.can.mockResolvedValue(true);
    rolesRepository.findById.mockResolvedValue(role);

    const request: UpdateRoleRequestDTO = { id: 'role-1' };
    await expect(useCase.execute(request, executer)).resolves.toBe(role);
    expect(role.setName).not.toHaveBeenCalled();
    expect(role.setPriority).not.toHaveBeenCalled();
    expect(rolesRepository.update).toHaveBeenCalledWith(role);
  });
});
