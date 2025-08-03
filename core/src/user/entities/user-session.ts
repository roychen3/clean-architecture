import { v4 as uuidv4 } from 'uuid';

export class UserSession {
  private id: string;
  private userId: string;
  private refreshToken: string;
  private accessTokenVersion: number;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(data: {
    id?: string;
    userId: string;
    refreshToken: string;
    accessTokenVersion?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = data.id || uuidv4();
    this.userId = data.userId;
    this.refreshToken = data.refreshToken;
    this.accessTokenVersion = data.accessTokenVersion ?? 1;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  getId(): string {
    return this.id;
  }

  getUserId(): string {
    return this.userId;
  }

  getRefreshToken(): string {
    return this.refreshToken;
  }

  getAccessTokenVersion(): number {
    return this.accessTokenVersion;
  }
  incrementAccessTokenVersion(): void {
    this.accessTokenVersion += 1;
    this.updatedAt = new Date();
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
}
