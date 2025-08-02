import { BaseRequestDTO, BaseResponseDTO } from '../../types';

export type RolePermissionDTO = {
  role: { id: string; name: string; priority: number };
  permissions: {
    resource: { id: string; name: string };
    actions: { id: string; name: string }[];
  }[];
};

export type GetRolePermissionRequestDTO = BaseRequestDTO<{ id: string }>;
export type GetRolePermissionResponseDTO = BaseResponseDTO<RolePermissionDTO>;

export type GetUserRolesRequestDTO = BaseRequestDTO<{ userId: string }>;
export type GetUserRolesResponseDTO = BaseResponseDTO<
  { id: string; name: string; priority: number }[]
>;

export type SetPermissionRequestDTO = BaseRequestDTO<
  undefined,
  undefined,
  {
    roleId: string;
    permissions: {
      resourceId: string;
      actionIds: string[];
    }[];
  }
>;
export type SetPermissionResponseDTO = void;

export type SetUserRolesRequestDTO = BaseRequestDTO<
  undefined,
  undefined,
  {
    userId: string;
    roleIds: string[];
  }
>;
export type SetUserRolesResponseDTO = void;
