import type {
  RegisterRequestDTO,
  RegisterResponseDTO,
  SignInUserRequestDTO,
  SignInUserResponseDTO,
  RefreshTokenResponseDTO,
  SignOutResponseDTO,
} from './dto';

export interface AuthAPI {
  register(req: RegisterRequestDTO): Promise<RegisterResponseDTO>;
  signIn(req: SignInUserRequestDTO): Promise<SignInUserResponseDTO>;
  refreshToken(): Promise<RefreshTokenResponseDTO>;
  singOut(): Promise<SignOutResponseDTO>;
}
