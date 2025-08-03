import type { BaseRequestDTO, BaseResponseDTO } from '../types';

export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateUserRequestDTO = BaseRequestDTO<
  undefined,
  undefined,
  { email: string; password: string; name: string }
>;
export type CreateUserResponseDTO = BaseResponseDTO<User>;

export type GetUsersRequestDTO = BaseRequestDTO;
export type GetUsersResponseDTO = BaseResponseDTO<User[]>;

export type GetUserRequestDTO = BaseRequestDTO<{ id: string }>;
export type GetUserResponseDTO = BaseResponseDTO<User>;

export type UpdateUserRequestDTO = BaseRequestDTO<
  { id: string },
  undefined,
  { name: string }
>;
export type UpdateUserResponseDTO = void;

export type DeleteUserRequestDTO = BaseRequestDTO<{ id: string }>;
export type DeleteUserResponseDTO = void;
