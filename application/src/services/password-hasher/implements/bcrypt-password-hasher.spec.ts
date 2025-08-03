import { describe, beforeEach, it, expect } from 'vitest';

import { BcryptPasswordHasher } from './bcrypt-password-hasher';

describe('BcryptPasswordHasher', () => {
  let passwordHasher: BcryptPasswordHasher;

  beforeEach(() => {
    passwordHasher = new BcryptPasswordHasher();
  });

  it('should hash passwords', async () => {
    const password = 'mySecretPassword';
    const hash = await passwordHasher.hash(password);
    expect(typeof hash).toBe('string');
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(0);
  });

  it('should compare passwords correctly', async () => {
    const password = 'mySecretPassword';
    const hash = await passwordHasher.hash(password);
    const isMatch = await passwordHasher.compare(password, hash);
    expect(isMatch).toBe(true);
    const isNotMatch = await passwordHasher.compare('wrongPassword', hash);
    expect(isNotMatch).toBe(false);
  });
});
