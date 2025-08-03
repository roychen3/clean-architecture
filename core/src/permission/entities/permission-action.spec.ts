import { describe, it, expect } from 'vitest';

import {
  PermissionAction,
  PERMISSION_ACTION_ENUMS,
  PermissionActionName,
} from './permission-action';

describe('PermissionAction', () => {
  it('should create a PermissionAction with a given id and name', () => {
    const id = 'test-id';
    const name: PermissionActionName = PERMISSION_ACTION_ENUMS.CREATE;
    const action = new PermissionAction({ id, name });

    expect(action.getId()).toBe(id);
    expect(action.getName()).toBe(name);
  });

  it('should generate a new id if not provided', () => {
    const name: PermissionActionName = PERMISSION_ACTION_ENUMS.READ;
    const action = new PermissionAction({ name });

    expect(action.getId()).toBeTypeOf('string');
    expect(action.getId()).not.toBe('');
    expect(action.getName()).toBe(name);
  });

  it('should allow updating the name', () => {
    const name: PermissionActionName = PERMISSION_ACTION_ENUMS.UPDATE;
    const action = new PermissionAction({ name });

    expect(action.getName()).toBe(PERMISSION_ACTION_ENUMS.UPDATE);

    action.setName(PERMISSION_ACTION_ENUMS.DELETE);
    expect(action.getName()).toBe(PERMISSION_ACTION_ENUMS.DELETE);
  });

  it('should support all enum values as names', () => {
    Object.values(PERMISSION_ACTION_ENUMS).forEach((enumName) => {
      const action = new PermissionAction({ name: enumName });
      expect(action.getName()).toBe(enumName);
    });
  });
});
