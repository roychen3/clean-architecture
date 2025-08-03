import { describe, beforeEach, it, expect } from 'vitest';

import { UserSession } from './user-session';

describe('UserSession', () => {
  let userSession: UserSession;
  const userId = 'user-123';
  const refreshToken = 'refresh-token-abc';

  beforeEach(() => {
    userSession = new UserSession({ userId, refreshToken });
  });

  it('should create a UserSession with required fields', () => {
    expect(userSession.getId()).toBeDefined();
    expect(userSession.getUserId()).toBe(userId);
    expect(userSession.getRefreshToken()).toBe(refreshToken);
    expect(userSession.getAccessTokenVersion()).toBe(1);
    expect(userSession.getCreatedAt()).toBeInstanceOf(Date);
    expect(userSession.getUpdatedAt()).toBeInstanceOf(Date);
  });

  it('should use provided id, accessTokenVersion, createdAt, and updatedAt if given', () => {
    const now = new Date();
    const customId = 'custom-id';
    const customVersion = 5;
    const session = new UserSession({
      id: customId,
      userId,
      refreshToken,
      accessTokenVersion: customVersion,
      createdAt: now,
      updatedAt: now,
    });

    expect(session.getId()).toBe(customId);
    expect(session.getAccessTokenVersion()).toBe(customVersion);
    expect(session.getCreatedAt()).toBe(now);
    expect(session.getUpdatedAt()).toBe(now);
  });

  it('should increment accessTokenVersion and update updatedAt', () => {
    const before = userSession.getAccessTokenVersion();
    const prevUpdatedAt = userSession.getUpdatedAt();

    userSession.incrementAccessTokenVersion();

    expect(userSession.getAccessTokenVersion()).toBe(before + 1);
    expect(userSession.getUpdatedAt().getTime()).toBeGreaterThanOrEqual(
      prevUpdatedAt.getTime(),
    );
  });

  it('should return correct values from getters', () => {
    expect(userSession.getId()).toBeDefined();
    expect(userSession.getUserId()).toBe(userId);
    expect(userSession.getRefreshToken()).toBe(refreshToken);
    expect(typeof userSession.getAccessTokenVersion()).toBe('number');
    expect(userSession.getCreatedAt()).toBeInstanceOf(Date);
    expect(userSession.getUpdatedAt()).toBeInstanceOf(Date);
  });
});
