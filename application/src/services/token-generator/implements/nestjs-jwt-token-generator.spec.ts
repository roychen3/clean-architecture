import { describe, beforeEach, it, expect } from 'vitest';
import { NestJwtTokenGenerator } from './nestjs-jwt-token-generator';
import { TokenExpiredError, AuthenticationError } from '@ca/core';
import { TokenPayload } from '../interface';

const SECRET = 'test-secret';
const EXPIRES_IN = '1h';

describe('NestJwtTokenGenerator', () => {
  let tokenGenerator: NestJwtTokenGenerator;
  let payload: TokenPayload;

  beforeEach(() => {
    tokenGenerator = new NestJwtTokenGenerator({
      secret: SECRET,
      expiresIn: EXPIRES_IN,
    });

    payload = {
      type: 'refresh',
      userId: 'user-123',
    };
  });

  it('should generate a JWT token with the correct payload and secret', () => {
    const token = tokenGenerator.generateToken(payload);
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3); // JWT format
  });

  it('should verify a valid JWT token', () => {
    const token = tokenGenerator.generateToken(payload);
    const verified = tokenGenerator.verifyToken(token);
    expect(verified.userId).toBe(payload.userId);
    expect(verified.type).toBe(payload.type);
  });

  it('should throw AuthenticationError for an invalid JWT token', () => {
    expect(() => tokenGenerator.verifyToken('invalid.token')).toThrow(
      AuthenticationError,
    );
  });

  it('should decode a JWT token and return the payload', () => {
    const token = tokenGenerator.generateToken(payload);
    const decoded = tokenGenerator.decodeToken(token);
    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.type).toBe(payload.type);
  });

  it('should throw AuthenticationError when decoding an invalid JWT token', () => {
    expect(() => tokenGenerator.decodeToken('invalid.token')).toThrow(
      AuthenticationError,
    );
  });

  it('should throw TokenExpiredError for an expired JWT token', async () => {
    const shortLivedGenerator = new NestJwtTokenGenerator({
      secret: SECRET,
      expiresIn: '1ms',
    });
    const token = shortLivedGenerator.generateToken(payload);
    await new Promise((res) => setTimeout(res, 10));
    expect(() => shortLivedGenerator.verifyToken(token)).toThrow(
      TokenExpiredError,
    );
  });

  it('should allow overriding secret and expiresIn in generateToken', () => {
    const token = tokenGenerator.generateToken(payload, {
      secret: 'other-secret',
      expiresIn: '2h',
    });
    expect(typeof token).toBe('string');
    expect(token.split('.').length).toBe(3); // JWT format
  });

  it('should allow overriding secret in verifyToken', () => {
    const customGenerator = new NestJwtTokenGenerator({
      secret: 'other-secret',
      expiresIn: EXPIRES_IN,
    });
    const token = customGenerator.generateToken(payload);
    expect(() =>
      tokenGenerator.verifyToken(token, { secret: 'other-secret' }),
    ).not.toThrow();
  });
});
