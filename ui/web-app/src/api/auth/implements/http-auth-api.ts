import { httpFetcher } from '@/lib/http-fetcher';

import type { AuthAPI } from '../interfaces';
import type {
  RegisterRequestDTO,
  RegisterResponseDTO,
  SignInUserRequestDTO,
  SignInUserResponseDTO,
  RefreshTokenResponseDTO,
  SignOutResponseDTO,
} from '../dto';

export class HttpAuthAPI implements AuthAPI {
  async signIn(req: SignInUserRequestDTO): Promise<SignInUserResponseDTO> {
    const response = await httpFetcher.post(`/api/auth/sign-in`, req.body);
    return response.data;
  }

  async refreshToken(): Promise<RefreshTokenResponseDTO> {
    const response = await httpFetcher.post(`/api/auth/refresh-token`);
    return response.data;
  }

  async singOut(): Promise<SignOutResponseDTO> {
    await httpFetcher.post(`/api/auth/sign-out`);
  }

  async register(req: RegisterRequestDTO): Promise<RegisterResponseDTO> {
    const response = await httpFetcher.post(`/api/auth/register`, req.body);
    return response.data;
  }
}
