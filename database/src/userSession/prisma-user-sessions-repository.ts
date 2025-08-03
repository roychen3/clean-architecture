import { UserSession } from '@ca/core';
import { UserSessionsRepository } from '@ca/application';

import {
  PrismaClient,
  UserSession as PrismaUserSession,
} from '../database/prisma';

export class PrismaUserSessionsRepository implements UserSessionsRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  private toEntity(session: PrismaUserSession): UserSession {
    if (!session) throw new Error('Session not found');
    return new UserSession({
      id: session.id,
      userId: session.userId,
      refreshToken: session.refreshToken,
      accessTokenVersion: session.accessTokenVersion,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    });
  }

  async create(session: UserSession): Promise<UserSession> {
    const created = await this.prisma.userSession.create({
      data: {
        id: session.getId(),
        userId: session.getUserId(),
        refreshToken: session.getRefreshToken(),
        accessTokenVersion: session.getAccessTokenVersion(),
        createdAt: session.getCreatedAt(),
        updatedAt: session.getUpdatedAt(),
      },
    });
    return this.toEntity(created);
  }

  async findById(id: string): Promise<UserSession | null> {
    const found = await this.prisma.userSession.findUnique({ where: { id } });
    return found ? this.toEntity(found) : null;
  }

  async findByUserId(userId: string): Promise<UserSession[]> {
    const sessions = await this.prisma.userSession.findMany({
      where: { userId },
    });
    return sessions.map((s) => this.toEntity(s));
  }

  async findByRefreshToken(refreshToken: string): Promise<UserSession | null> {
    const found = await this.prisma.userSession.findFirst({
      where: { refreshToken },
    });
    return found ? this.toEntity(found) : null;
  }

  async update(session: UserSession): Promise<UserSession> {
    const updated = await this.prisma.userSession.update({
      where: { id: session.getId() },
      data: {
        refreshToken: session.getRefreshToken(),
        accessTokenVersion: session.getAccessTokenVersion(),
        updatedAt: session.getUpdatedAt(),
      },
    });
    return this.toEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.userSession.delete({ where: { id } });
  }

  async deleteByUser(userId: string): Promise<void> {
    await this.prisma.userSession.deleteMany({ where: { userId } });
  }
}
