import { BaseRequestDTO, BaseResponseDTO } from '../../types';

export type RegisterRequestDTO = BaseRequestDTO<
  undefined,
  undefined,
  {
    email: string;
    password: string;
    name: string;
  }
>;
export type RegisterResponseDTO = BaseResponseDTO<{
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
}>;

export type RefreshTokenRequestDTO = BaseRequestDTO;
export type RefreshTokenResponseDTO = BaseResponseDTO<{
  accessToken: string;
}>;

export type SignOutRequestDTO = BaseRequestDTO;
export type SignOutResponseDTO = void;

export type SignInUserRequestDTO = BaseRequestDTO<
  undefined,
  undefined,
  {
    email: string;
    password: string;
  }
>;
export type SignInUserResponseDTO = BaseResponseDTO<{
  accessToken: string;
}>;
