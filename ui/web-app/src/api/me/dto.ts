import type { BaseRequestDTO, BaseResponseDTO } from '../types';

export type GetMeProfileRequestDTO = BaseRequestDTO;
export type GetMeProfileResponseDTO = BaseResponseDTO<{
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}>;

export type UpdateMeRequestDTO = BaseRequestDTO<
  undefined,
  undefined,
  { name: string }
>;
export type UpdateMeResponseDTO = void;

export type ChangeMePasswordRequestDTO = BaseRequestDTO<
  undefined,
  undefined,
  { oldPassword: string; newPassword: string }
>;
export type ChangeMePasswordResponseDTO = void;

export type DeleteMeRequestDTO = BaseRequestDTO<
  undefined,
  undefined,
  { password: string }
>;
export type DeleteMeResponseDTO = void;
