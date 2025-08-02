import { BaseRequestDTO, BaseResponseDTO } from '../../types';

export type UserDTO = {
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
export type CreateUserResponseDTO = BaseResponseDTO<UserDTO>;

export type GetUsersRequestDTO = BaseRequestDTO;
export type GetUsersResponseDTO = BaseResponseDTO<UserDTO[]>;

export type GetUserRequestDTO = BaseRequestDTO<{ id: string }>;
export type GetUserResponseDTO = BaseResponseDTO<UserDTO>;

export type UpdateUserRequestDTO = BaseRequestDTO<
  { id: string },
  undefined,
  { name: string }
>;
export type UpdateUserResponseDTO = void;

export type DeleteUserRequestDTO = BaseRequestDTO<{ id: string }>;
export type DeleteUserResponseDTO = void;
