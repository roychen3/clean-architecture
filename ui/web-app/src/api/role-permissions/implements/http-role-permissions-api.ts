import type {
  GetAllActionsResponseDTO,
  GetAllResourcesResponseDTO,
  SetPermissionRequestDTO,
  SetPermissionResponseDTO,
  GetRolePermissionRequestDTO,
  GetRolePermissionResponseDTO,
  GetUserRolesRequestDTO,
  GetUserRolesResponseDTO,
  SetUserRolesRequestDTO,
  SetUserRolesResponseDTO,
} from '../dto';
import { httpFetcher } from '@/lib/http-fetcher';
import type { RolePermissionsAPI } from '../interface';

export class HttpRolePermissionsAPI implements RolePermissionsAPI {
  async getActions(): Promise<GetAllActionsResponseDTO> {
    const response = await httpFetcher.get(`/api/permissions/actions`);
    return response.data;
  }

  async getResources(): Promise<GetAllResourcesResponseDTO> {
    const response = await httpFetcher.get(`/api/permissions/resources`);
    return response.data;
  }

  async setRolePermissions(
    req: SetPermissionRequestDTO,
  ): Promise<SetPermissionResponseDTO> {
    await httpFetcher.patch(`/api/permissions/role-permissions`, req.body);
  }

  async getRolePermissions(
    req: GetRolePermissionRequestDTO,
  ): Promise<GetRolePermissionResponseDTO> {
    const response = await httpFetcher.get(
      `/api/permissions/role-permissions/${req.path.id}`,
    );
    return response.data;
  }

  async getUserRoles(
    req: GetUserRolesRequestDTO,
  ): Promise<GetUserRolesResponseDTO> {
    const response = await httpFetcher.get(
      `/api/permissions/user-roles/${req.path.userId}`,
    );
    return response.data;
  }

  async setUserRoles(
    req: SetUserRolesRequestDTO,
  ): Promise<SetUserRolesResponseDTO> {
    await httpFetcher.patch(`/api/permissions/set-user-roles`, req.body);
  }
}
