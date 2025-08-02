import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  HttpCode,
  Req,
  Request,
} from '@nestjs/common';

import {
  SetRolePermissionUseCase,
  GetRolePermissionsUseCase,
  SetUserRolesUseCase,
  GetUserRolesUseCase,
} from '@ca/application';

import {
  SetPermissionRequestDTO,
  SetPermissionResponseDTO,
  SetUserRolesRequestDTO,
  SetUserRolesResponseDTO,
  GetRolePermissionRequestDTO,
  GetRolePermissionResponseDTO,
  GetUserRolesRequestDTO,
  GetUserRolesResponseDTO,
} from './permissions.dto';

import { convertRolePermissionToDTO } from './presenters/convert-role-permission-to-dto.presenters';

@Controller('permissions')
export class PermissionsController {
  constructor(
    private readonly setRolePermissionUseCase: SetRolePermissionUseCase,
    private readonly getRolePermissionsUseCase: GetRolePermissionsUseCase,
    private readonly setUserRolesUseCase: SetUserRolesUseCase,
    private readonly getUserRolesUseCase: GetUserRolesUseCase,
  ) {}

  @Patch('role-permissions')
  @HttpCode(204)
  async setRolePermissions(
    @Req() request: Request,
    @Body() body: SetPermissionRequestDTO['body'],
  ): Promise<SetPermissionResponseDTO> {
    const user = request['user'];
    await this.setRolePermissionUseCase.execute(body, user.id);
  }

  @Get('role-permissions/:id')
  async getRolePermissions(
    @Req() request: Request,
    @Param() params: GetRolePermissionRequestDTO['path'],
  ): Promise<GetRolePermissionResponseDTO> {
    const user = request['user'];
    const rolePermission = await this.getRolePermissionsUseCase.execute(
      { roleId: params.id },
      user.id,
    );
    return { data: convertRolePermissionToDTO(rolePermission) };
  }

  @Patch('set-user-roles')
  @HttpCode(204)
  async setUserRoles(
    @Req() request: Request,
    @Body() body: SetUserRolesRequestDTO['body'],
  ): Promise<SetUserRolesResponseDTO> {
    const user = request['user'];
    await this.setUserRolesUseCase.execute(body, user.id);
  }

  @Get('user-roles/:userId')
  async getUserRoles(
    @Req() request: Request,
    @Param() params: GetUserRolesRequestDTO['path'],
  ): Promise<GetUserRolesResponseDTO> {
    const user = request['user'];
    const rolePermissions = await this.getUserRolesUseCase.execute(
      { userId: params.userId },
      user.id,
    );
    return {
      data: rolePermissions.map((role) => ({
        id: role.getId(),
        name: role.getName(),
        priority: role.getPriority(),
      })),
    };
  }
}
