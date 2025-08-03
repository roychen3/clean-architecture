import {
  JwtService,
  TokenExpiredError as JwtTokenExpiredError,
} from '@nestjs/jwt';

import { TokenExpiredError, AuthenticationError } from '@ca/core';

import { TokenGenerator, TokenPayload, VerifyPayload } from '../interface';

type GenerateOptions = {
  secret: string;
  expiresIn: string;
};
export class NestJwtTokenGenerator implements TokenGenerator {
  private readonly jwtService: JwtService;
  private readonly options?: GenerateOptions;

  constructor(options?: GenerateOptions) {
    this.options = options;
    this.jwtService = new JwtService(options);
  }

  generateToken(payload: TokenPayload, options?: GenerateOptions): string {
    const runOptions = options || this.options;
    return this.jwtService.sign(
      {
        sub: payload.userId,
        ...payload,
      },
      runOptions,
    );
  }

  verifyToken(token: string, options?: { secret: string }): VerifyPayload {
    const runOptions = options || this.options;

    try {
      const payload = this.jwtService.verify<VerifyPayload>(token, runOptions);
      return payload;
    } catch (error) {
      if (error instanceof JwtTokenExpiredError) {
        throw new TokenExpiredError({ cause: error });
      }
      throw new AuthenticationError({
        cause: error instanceof Error ? error : undefined,
      });
    }
  }

  decodeToken(token: string): VerifyPayload {
    try {
      const payload = this.jwtService.decode<VerifyPayload>(token);
      if (
        typeof payload !== 'object' ||
        payload === null ||
        Array.isArray(payload)
      ) {
        throw new Error('Decoded payload is not an object');
      }
      return payload;
    } catch (error) {
      throw new AuthenticationError({
        cause: error instanceof Error ? error : undefined,
      });
    }
  }
}
