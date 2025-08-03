import { describe, it, expect } from 'vitest';

import {
  PermissionResource,
  PERMISSION_RESOURCE_ENUMS,
  PermissionResourceName,
} from './permission-resource';

describe('PermissionResource', () => {
  it('should create a PermissionResource with a given id and name', () => {
    const id = 'test-resource-id';
    const name: PermissionResourceName = PERMISSION_RESOURCE_ENUMS.ARTICLES;
    const resource = new PermissionResource({ id, name });

    expect(resource.getId()).toBe(id);
    expect(resource.getName()).toBe(name);
  });

  it('should generate a new id if not provided', () => {
    const name: PermissionResourceName = PERMISSION_RESOURCE_ENUMS.USERS;
    const resource = new PermissionResource({ name });

    expect(resource.getId()).toBeTypeOf('string');
    expect(resource.getId()).not.toBe('');
    expect(resource.getName()).toBe(name);
  });

  it('should allow updating the name', () => {
    const name: PermissionResourceName = PERMISSION_RESOURCE_ENUMS.ME;
    const resource = new PermissionResource({ name });

    expect(resource.getName()).toBe(PERMISSION_RESOURCE_ENUMS.ME);

    resource.setName(PERMISSION_RESOURCE_ENUMS.ROLES);
    expect(resource.getName()).toBe(PERMISSION_RESOURCE_ENUMS.ROLES);
  });

  it('should support all enum values as names', () => {
    Object.values(PERMISSION_RESOURCE_ENUMS).forEach((enumName) => {
      const resource = new PermissionResource({ name: enumName });
      expect(resource.getName()).toBe(enumName);
    });
  });
});
