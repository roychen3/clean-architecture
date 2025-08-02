import { Body, Controller, Post, Req, Request, HttpCode } from '@nestjs/common';

import { UnauthorizedError } from '@ca/core';
import {
  SignInUserUseCase,
  RefreshTokenUseCase,
  RegisterAndSignInUserUseCase,
  SignOutUseCase,
} from '@ca/application';

import { Public } from '../../decorators/public';

import {
  SignInUserRequestDTO,
  SignInUserResponseDTO,
  RegisterRequestDTO,
  RegisterResponseDTO,
  RefreshTokenResponseDTO,
  SignOutResponseDTO,
} from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signInUserUseCase: SignInUserUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly registerAndSignInUserUseCase: RegisterAndSignInUserUseCase,
    private readonly signOutUseCase: SignOutUseCase,
  ) {}

  @Public()
  @Post('sign-in')
  async signIn(
    @Body() body: SignInUserRequestDTO['body'],
  ): Promise<SignInUserResponseDTO> {
    const response = await this.signInUserUseCase.execute(body);
    const result = {
      data: {
        accessToken: response.accessToken,
      },
    };
    return result;
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(
    @Req() request: Request,
  ): Promise<RefreshTokenResponseDTO> {
    const authHeader = request.headers['authorization'];
    const accessToken =
      typeof authHeader === 'string' ? authHeader.split(' ')[1] : undefined;
    if (!accessToken) {
      throw new UnauthorizedError();
    }
    const response = await this.refreshTokenUseCase.execute({
      accessToken,
    });
    const result = {
      data: response,
    };
    return result;
  }

  @Public()
  @HttpCode(204)
  @Post('sign-out')
  async signOut(@Req() request: Request): Promise<SignOutResponseDTO> {
    const authHeader = request.headers['authorization'];
    const accessToken =
      typeof authHeader === 'string' ? (authHeader.split(' ')[1] ?? '') : '';
    await this.signOutUseCase.execute({ accessToken });
  }

  @Public()
  @Post('register')
  async register(
    @Body() body: RegisterRequestDTO['body'],
  ): Promise<RegisterResponseDTO> {
    const response = await this.registerAndSignInUserUseCase.execute(body);
    return {
      data: {
        accessToken: response.accessToken,
        user: {
          id: response.user.getId(),
          email: response.user.getEmail(),
          name: response.user.getName(),
          createdAt: response.user.getCreatedAt().toISOString(),
          updatedAt: response.user.getUpdatedAt().toISOString(),
        },
      },
    };
  }
}
