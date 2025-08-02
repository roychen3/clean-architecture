import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Req,
  Request,
} from '@nestjs/common';

import {
  CreateRoleUseCase,
  GetAllRolesUseCase,
  GetRoleUseCase,
  UpdateRoleUseCase,
  DeleteRoleUseCase,
} from '@ca/application';

import {
  CreateRoleRequestDTO,
  CreateRoleResponseDTO,
  GetAllRolesResponseDTO,
  GetRoleRequestDTO,
  GetRoleResponseDTO,
  UpdateRoleRequestDTO,
  UpdateRoleResponseDTO,
  DeleteRoleRequestDTO,
  DeleteRoleResponseDTO,
} from './roles.dto';

@Controller('permissions/roles')
export class RolesController {
  constructor(
    private readonly createRoleUseCase: CreateRoleUseCase,
    private readonly getAllRolesUseCase: GetAllRolesUseCase,
    private readonly getRoleUseCase: GetRoleUseCase,
    private readonly updateRoleUseCase: UpdateRoleUseCase,
    private readonly deleteRoleUseCase: DeleteRoleUseCase,
  ) {}

  @Post()
  async create(
    @Req() request: Request,
    @Body() body: CreateRoleRequestDTO['body'],
  ): Promise<CreateRoleResponseDTO> {
    const user = request['user'];
    const role = await this.createRoleUseCase.execute(body, user.id);
    const result = {
      data: {
        id: role.getId(),
        name: role.getName(),
        priority: role.getPriority(),
        isSuperAdmin: role.getIsSuperAdminRole(),
        createdAt: role.getCreatedAt().toISOString(),
        updatedAt: role.getUpdatedAt().toISOString(),
      },
    };
    return result;
  }

  @Get()
  async getAll(@Req() request: Request): Promise<GetAllRolesResponseDTO> {
    const user = request['user'];
    const roles = await this.getAllRolesUseCase.execute(user.id);
    const result = {
      data: roles.map((role) => ({
        id: role.getId(),
        name: role.getName(),
        priority: role.getPriority(),
        isSuperAdmin: role.getIsSuperAdminRole(),
        createdAt: role.getCreatedAt().toISOString(),
        updatedAt: role.getUpdatedAt().toISOString(),
      })),
    };
    return result;
  }

  @Get(':id')
  async getOne(
    @Req() request: Request,
    @Param() params: GetRoleRequestDTO['path'],
  ): Promise<GetRoleResponseDTO> {
    const user = request['user'];
    const role = await this.getRoleUseCase.execute({ id: params.id }, user.id);
    const result = {
      data: {
        id: role.getId(),
        name: role.getName(),
        priority: role.getPriority(),
        isSuperAdmin: role.getIsSuperAdminRole(),
        createdAt: role.getCreatedAt().toISOString(),
        updatedAt: role.getUpdatedAt().toISOString(),
      },
    };
    return result;
  }

  @Patch(':id')
  @HttpCode(204)
  async update(
    @Req() request: Request,
    @Param() params: UpdateRoleRequestDTO['path'],
    @Body() body: UpdateRoleRequestDTO['body'],
  ): Promise<UpdateRoleResponseDTO> {
    const user = request['user'];
    await this.updateRoleUseCase.execute(
      {
        id: params.id,
        name: body.name,
        priority: body.priority,
      },
      user.id,
    );
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(
    @Req() request: Request,
    @Param() params: DeleteRoleRequestDTO['path'],
  ): Promise<DeleteRoleResponseDTO> {
    const user = request['user'];
    await this.deleteRoleUseCase.execute({ id: params.id }, user.id);
  }
}
