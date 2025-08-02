import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { UnauthorizedError, TokenExpiredError } from '@ca/core';
import { CheckAccessTokenUseCase } from '@ca/application';

import { IS_PUBLIC_KEY } from '../../decorators/public';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private checkAccessTokenUseCase: CheckAccessTokenUseCase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedError();
    }

    try {
      const accessPayload = await this.checkAccessTokenUseCase.execute({
        accessToken: token,
      });

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = {
        ...accessPayload,
        id: accessPayload?.userId,
      };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw error;
      }
      throw new UnauthorizedError();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
