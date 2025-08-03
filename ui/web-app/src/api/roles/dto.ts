import type { BaseRequestDTO, BaseResponseDTO } from '../types';

export type Role = {
  id: string;
  name: string;
  priority: number;
  isSuperAdmin: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateRoleRequestDTO = BaseRequestDTO<
  undefined,
  undefined,
  { name: string; priority?: number }
>;
export type CreateRoleResponseDTO = BaseResponseDTO<Role>;

export type GetAllRolesRequestDTO = BaseRequestDTO;
export type GetAllRolesResponseDTO = BaseResponseDTO<Role[]>;

export type GetRoleRequestDTO = BaseRequestDTO<{ id: string }>;
export type GetRoleResponseDTO = BaseResponseDTO<Role>;

export type UpdateRoleRequestDTO = BaseRequestDTO<
  { id: string },
  undefined,
  { name?: string; priority?: number }
>;
export type UpdateRoleResponseDTO = void;

export type DeleteRoleRequestDTO = BaseRequestDTO<{ id: string }>;
export type DeleteRoleResponseDTO = void;
