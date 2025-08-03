import { UserSession } from '@ca/core';

export interface UserSessionsRepository {
  create(session: UserSession): Promise<UserSession>;
  findById(id: string): Promise<UserSession | null>;
  findByUserId(userId: string): Promise<UserSession[]>;
  findByRefreshToken(refreshToken: string): Promise<UserSession | null>;
  update(session: UserSession): Promise<UserSession>;
  delete(id: string): Promise<void>;
  deleteByUser(userId: string): Promise<void>;
}
