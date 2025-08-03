import { describe, beforeEach, it, expect } from 'vitest';

import { Role } from '../../permission';

import { User } from './user';

describe('User Entity', () => {
  let user: User;
  const validUserData = {
    email: 'TestUser@example.com',
    password: 'Password1!',
    name: 'Test User',
    roles: [new Role({ name: 'admin' }), new Role({ name: 'user' })],
  };

  beforeEach(() => {
    user = new User(validUserData);
  });

  it('should create a user with valid data', () => {
    expect(user.getEmail()).toBe(validUserData.email);
    expect(user.getName()).toBe(validUserData.name);
    expect(user.getPassword()).toBe(validUserData.password);
    expect(user.getRoles()).toEqual(validUserData.roles);
    expect(user.getId()).toBeTypeOf('string');
    expect(user.getCreatedAt()).toBeInstanceOf(Date);
    expect(user.getUpdatedAt()).toBeInstanceOf(Date);
  });

  it('should update email and updatedAt', () => {
    const prevUpdatedAt = user.getUpdatedAt();
    user.setEmail('newemail@example.com');
    expect(user.getEmail()).toBe('newemail@example.com');
    expect(user.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(
      prevUpdatedAt.getTime(),
    );
  });

  it('should update password and updatedAt', () => {
    const prevUpdatedAt = user.getUpdatedAt();
    user.setPassword('NewPassword1!');
    expect(user.getPassword()).toBe('NewPassword1!');
    expect(user.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(
      prevUpdatedAt.getTime(),
    );
  });

  it('should update name and updatedAt', () => {
    const prevUpdatedAt = user.getUpdatedAt();
    user.setName('New Name');
    expect(user.getName()).toBe('New Name');
    expect(user.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(
      prevUpdatedAt.getTime(),
    );
  });

  it('should update roles and updatedAt', () => {
    const prevUpdatedAt = user.getUpdatedAt();
    const newRoles = [new Role({ name: 'editor' })];
    user.setRoles(newRoles);
    expect(user.getRoles()).toEqual(newRoles);
    expect(user.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(
      prevUpdatedAt.getTime(),
    );
  });

  it('should validate a valid user', () => {
    const result = user.validate();
    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should fail validation for invalid email', () => {
    user.setEmail('invalid-email');
    const result = user.validate();
    expect(result.success).toBe(false);
    expect(result.error).not.toBeNull();
  });

  it('should pass validation for password', () => {
    user.setPassword('ValidPassword1!');
    const result = user.validate();
    expect(result.success).toBe(true);
    expect(result.error).toBeNull();
  });

  it('should fail validation for invalid password', () => {
    user.setPassword('short');
    const result = user.validate();
    expect(result.success).toBe(false);
    expect(result.error).not.toBeNull();
  });

  it('should fail validation for long name', () => {
    user.setName('a'.repeat(41));
    const result = user.validate();
    expect(result.success).toBe(false);
    expect(result.error).not.toBeNull();
  });

  it('should fail validation for no special character', () => {
    user.setPassword('NoSpecialChar1');
    const result = user.validate();
    expect(result.success).toBe(false);
    expect(result.error).not.toBeNull();
  });

  it('should fail validation for no lowercase character', () => {
    user.setPassword('NOLOWERCASE1!');
    const result = user.validate();
    expect(result.success).toBe(false);
    expect(result.error).not.toBeNull();
  });

  it('should fail validation for no uppercase character', () => {
    user.setPassword('nouppercase1!');
    const result = user.validate();
    expect(result.success).toBe(false);
    expect(result.error).not.toBeNull();
  });

  it('should generate a uuid if id is not provided', () => {
    const newUser = new User({
      email: 'a@b.com',
      password: 'Password1!',
      name: 'A',
    });
    expect(newUser.getId()).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
  });

  it('should use provided id if given', () => {
    const newUser = new User({
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'a@b.com',
      password: 'Password1!',
      name: 'A',
    });
    expect(newUser.getId()).toBe('123e4567-e89b-12d3-a456-426614174000');
  });

  it('should use provided createdAt and updatedAt if given', () => {
    const date = new Date('2020-01-01T00:00:00Z');
    const newUser = new User({
      email: 'a@b.com',
      password: 'Password1!',
      name: 'A',
      createdAt: date,
      updatedAt: date,
    });
    expect(newUser.getCreatedAt()).toEqual(date);
    expect(newUser.getUpdatedAt()).toEqual(date);
  });
});
