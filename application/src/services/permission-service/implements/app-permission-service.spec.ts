import { describe, beforeEach, it, expect, vi, Mocked } from 'vitest';

import {
  PermissionAction,
  PermissionResource,
  Role,
  RolePermissions,
} from '@ca/core';

import { RolePermissionsRepository } from '../../../repositories';

import { AppPermissionService } from './app-permission-service';

describe('AppPermissionService', () => {
  let appPermissionService: AppPermissionService;
  let rolePermissionsRepository: Mocked<RolePermissionsRepository>;
  let noPermissionRole: Role;
  let heightPriorityRole: Role;
  let middlePriorityRole: Role;
  let lowPriorityRole: Role;
  let articlesResource: PermissionResource;
  let updateAction: PermissionAction;
  let userPermissions: RolePermissions[];

  beforeEach(() => {
    rolePermissionsRepository = {
      getUserPermissions: vi.fn(),
      getUserRoles: vi.fn(),
    } as unknown as Mocked<RolePermissionsRepository>;

    appPermissionService = new AppPermissionService(rolePermissionsRepository);

    noPermissionRole = new Role({
      id: 'no-permissions-id',
      name: 'no-permissions',
      priority: Role.NO_PERMISSIONS,
    });

    heightPriorityRole = new Role({
      id: 'height-id',
      name: 'height',
      priority: 1,
    });

    middlePriorityRole = new Role({
      id: 'middle-id',
      name: 'middle',
      priority: 2,
    });

    lowPriorityRole = new Role({
      id: 'low-id',
      name: 'low',
      priority: 3,
    });

    articlesResource = new PermissionResource({
      id: 'article-id',
      name: 'articles',
    });

    updateAction = new PermissionAction({
      id: 'update-id',
      name: 'update',
    });

    userPermissions = [
      {
        role: middlePriorityRole,
        permissions: [
          {
            resource: articlesResource,
            actions: [updateAction],
          },
        ],
      },
    ];
  });

  describe('can', () => {
    it('should pass if subject has permission', async () => {
      rolePermissionsRepository.getUserPermissions.mockResolvedValue(
        userPermissions,
      );

      const result = await appPermissionService.can(
        'user1',
        'update',
        'articles',
      );
      expect(result).toBe(true);
    });

    it('should pass if subject has permission with conditions', async () => {
      rolePermissionsRepository.getUserPermissions.mockResolvedValue(
        userPermissions,
      );
      rolePermissionsRepository.getUserRoles.mockResolvedValue([
        heightPriorityRole,
      ]);

      const result = await appPermissionService.can(
        'user1',
        'update',
        'articles',
        {
          target: { userId: 'user2', priority: '$gt' },
          validator: async () => true,
        },
      );
      expect(result).toBe(true);
    });

    it('should pass with priority comparison operators', async () => {
      rolePermissionsRepository.getUserPermissions.mockResolvedValue(
        userPermissions,
      );

      type PriorityTestCase = {
        operator: '$eq' | '$gt' | '$gte' | '$lt' | '$lte';
        scenarios: Array<{
          subjectRole: Role;
          expectedResult: boolean;
        }>;
      };

      const priorityTestCases: PriorityTestCase[] = [
        {
          operator: '$eq',
          scenarios: [
            { subjectRole: heightPriorityRole, expectedResult: false },
            { subjectRole: middlePriorityRole, expectedResult: true },
            { subjectRole: lowPriorityRole, expectedResult: false },
          ],
        },
        {
          operator: '$gt',
          scenarios: [
            { subjectRole: heightPriorityRole, expectedResult: true },
            { subjectRole: middlePriorityRole, expectedResult: false },
            { subjectRole: lowPriorityRole, expectedResult: false },
          ],
        },
        {
          operator: '$gte',
          scenarios: [
            { subjectRole: heightPriorityRole, expectedResult: true },
            { subjectRole: middlePriorityRole, expectedResult: true },
            { subjectRole: lowPriorityRole, expectedResult: false },
          ],
        },
        {
          operator: '$lt',
          scenarios: [
            { subjectRole: heightPriorityRole, expectedResult: false },
            { subjectRole: middlePriorityRole, expectedResult: false },
            { subjectRole: lowPriorityRole, expectedResult: true },
          ],
        },
        {
          operator: '$lte',
          scenarios: [
            { subjectRole: heightPriorityRole, expectedResult: false },
            { subjectRole: middlePriorityRole, expectedResult: true },
            { subjectRole: lowPriorityRole, expectedResult: true },
          ],
        },
      ];

      for (const testCase of priorityTestCases) {
        for (const scenario of testCase.scenarios) {
          rolePermissionsRepository.getUserRoles.mockResolvedValueOnce([
            scenario.subjectRole,
          ]);

          const result = await appPermissionService.can(
            'user1',
            'update',
            'articles',
            {
              target: { userId: 'user2', priority: testCase.operator },
            },
          );

          expect(result).toBe(scenario.expectedResult);
        }
      }
    });

    it('should fail if subject not has any role-permissions', async () => {
      rolePermissionsRepository.getUserPermissions.mockResolvedValue([]);

      const result = await appPermissionService.can(
        'user1',
        'update',
        'articles',
      );
      expect(result).toBe(false);
    });

    it('should fail if subject all role priorities are NO_PERMISSIONS', async () => {
      rolePermissionsRepository.getUserPermissions.mockResolvedValue([
        {
          role: noPermissionRole,
          permissions: [
            {
              resource: articlesResource,
              actions: [updateAction],
            },
          ],
        },
      ]);

      const result = await appPermissionService.can(
        'user1',
        'update',
        'articles',
      );
      expect(result).toBe(false);
    });

    it('should fail if subject has no permission for the resource', async () => {
      rolePermissionsRepository.getUserPermissions.mockResolvedValue([
        {
          role: middlePriorityRole,
          permissions: [],
        },
      ]);

      const result = await appPermissionService.can(
        'user1',
        'update',
        'articles',
      );
      expect(result).toBe(false);
    });

    it('should fail if subject has no permission for the action', async () => {
      rolePermissionsRepository.getUserPermissions.mockResolvedValue([
        {
          role: middlePriorityRole,
          permissions: [
            {
              resource: articlesResource,
              actions: [],
            },
          ],
        },
      ]);

      const result = await appPermissionService.can(
        'user1',
        'update',
        'articles',
      );
      expect(result).toBe(false);
    });

    it('should fail if target is not self and conditions.own is true', async () => {
      rolePermissionsRepository.getUserPermissions.mockResolvedValue(
        userPermissions,
      );
      rolePermissionsRepository.getUserRoles.mockResolvedValue([
        middlePriorityRole,
      ]);

      const result = await appPermissionService.can(
        'user1',
        'update',
        'articles',
        {
          target: { userId: 'user2', own: true },
        },
      );
      expect(result).toBe(false);
    });

    it('should fail if target role priority is lower than subject role priority', async () => {
      rolePermissionsRepository.getUserPermissions.mockResolvedValue(
        userPermissions,
      );
      rolePermissionsRepository.getUserRoles.mockResolvedValue([
        lowPriorityRole,
      ]);

      const result = await appPermissionService.can(
        'user1',
        'update',
        'articles',
        {
          target: { userId: 'user2', priority: '$gt' },
        },
      );

      expect(result).toBe(false);
    });

    it('should fail if conditions.validator returns false', async () => {
      rolePermissionsRepository.getUserPermissions.mockResolvedValue(
        userPermissions,
      );

      const validator = vi.fn().mockResolvedValue(false);
      const result = await appPermissionService.can(
        'user1',
        'update',
        'articles',
        {
          validator,
        },
      );
      expect(result).toBe(false);
      expect(validator).toHaveBeenCalledWith(userPermissions, null);
    });

    it('should fail if conditions.validator throws an error', async () => {
      rolePermissionsRepository.getUserPermissions.mockResolvedValue(
        userPermissions,
      );

      const validator = vi
        .fn()
        .mockRejectedValue(new Error('Validation error'));
      const result = await appPermissionService.can(
        'user1',
        'update',
        'articles',
        {
          validator,
        },
      );

      expect(result).toBe(false);
      expect(validator).toHaveBeenCalledWith(userPermissions, null);
    });

    it('should pass when target is self and conditions.own is not specified', async () => {
      rolePermissionsRepository.getUserPermissions.mockResolvedValue(
        userPermissions,
      );
      rolePermissionsRepository.getUserRoles.mockResolvedValue([]);

      const result = await appPermissionService.can(
        'user1',
        'update',
        'articles',
        {
          target: { userId: 'user1' },
        },
      );
      expect(result).toBe(true);
    });
  });
});
