import type { BaseRequestDTO, BaseResponseDTO } from '../types';

export type Action = {
  id: string;
  name: string;
};
export type GetAllActionsRequestDTO = BaseRequestDTO;
export type GetAllActionsResponseDTO = BaseResponseDTO<Action[]>;

export type Resource = {
  id: string;
  name: string;
};
export type GetAllResourcesRequestDTO = BaseRequestDTO;
export type GetAllResourcesResponseDTO = BaseResponseDTO<Resource[]>;

export type Role = {
  id: string;
  name: string;
  priority: number;
  isSuperAdmin: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RolePermission = {
  role: { id: string; name: string; priority: number };
  permissions: {
    resource: { id: string; name: string };
    actions: { id: string; name: string }[];
  }[];
};

export type GetRolePermissionRequestDTO = BaseRequestDTO<{ id: string }>;
export type GetRolePermissionResponseDTO = BaseResponseDTO<RolePermission>;

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
