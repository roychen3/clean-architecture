import { describe, it, expect } from 'vitest';

import { Role } from './role';

describe('Role', () => {
  it('should create a role with default values', () => {
    const role = new Role({ name: 'User' });
    expect(role.getName()).toBe('User');
    expect(role.getPriority()).toBe(Role.NO_PERMISSIONS);
    expect(role.getIsSuperAdminRole()).toBe(false);
    expect(role.getId()).toBeTypeOf('string');
    expect(role.getCreatedAt()).toBeInstanceOf(Date);
    expect(role.getUpdatedAt()).toBeInstanceOf(Date);
  });

  it('should create a role with provided values', () => {
    const now = new Date();
    const role = new Role({
      id: 'custom-id',
      name: 'Admin',
      priority: 1,
      isSuperAdmin: true,
      createdAt: now,
      updatedAt: now,
    });
    expect(role.getId()).toBe('custom-id');
    expect(role.getName()).toBe('Admin');
    expect(role.getPriority()).toBe(1);
    expect(role.getIsSuperAdminRole()).toBe(true);
    expect(role.getCreatedAt()).toBe(now);
    expect(role.getUpdatedAt()).toBe(now);
  });

  it('should update name', () => {
    const role = new Role({ name: 'User' });
    role.setName('Editor');
    expect(role.getName()).toBe('Editor');
  });

  it('should update priority', () => {
    const role = new Role({ name: 'User' });
    role.setPriority(2);
    expect(role.getPriority()).toBe(2);
  });

  it('should update isSuperAdmin', () => {
    const role = new Role({ name: 'User' });
    role.setIsSuperAdminRole(true);
    expect(role.getIsSuperAdminRole()).toBe(true);
  });

  it('should update createdAt', () => {
    const role = new Role({ name: 'User' });
    const date = new Date('2023-01-01');
    role.setCreatedAt(date);
    expect(role.getCreatedAt()).toBe(date);
  });

  it('should update updatedAt', () => {
    const role = new Role({ name: 'User' });
    const date = new Date('2023-01-02');
    role.setUpdatedAt(date);
    expect(role.getUpdatedAt()).toBe(date);
  });
});
