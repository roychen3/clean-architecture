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
} from './dto';

export interface RolePermissionsAPI {
  getActions(): Promise<GetAllActionsResponseDTO>;
  getResources(): Promise<GetAllResourcesResponseDTO>;
  setRolePermissions(
    req: SetPermissionRequestDTO,
  ): Promise<SetPermissionResponseDTO>;
  getRolePermissions(
    req: GetRolePermissionRequestDTO,
  ): Promise<GetRolePermissionResponseDTO>;
  getUserRoles(req: GetUserRolesRequestDTO): Promise<GetUserRolesResponseDTO>;
  setUserRoles(req: SetUserRolesRequestDTO): Promise<SetUserRolesResponseDTO>;
}
