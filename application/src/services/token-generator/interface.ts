import { RolePermissions } from '@ca/core';

export type AccessTokenPayload = {
  type: 'access';
  userId: string;
  userSessionId: string;
  userPermissions: RolePermissions[];
  version: number;
};

export type RefreshTokenPayload = {
  type: 'refresh';
  userId: string;
};

export type TokenPayload = AccessTokenPayload | RefreshTokenPayload;

export type BaseVerifyPayload = {
  sub: string;
  iat: number;
  exp: number;
};

export type VerifyPayload = BaseVerifyPayload & TokenPayload;

export interface TokenGenerator {
  generateToken(payload: TokenPayload): string;
  verifyToken(token: string): VerifyPayload;
  decodeToken(token: string): VerifyPayload;
}
