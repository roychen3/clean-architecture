import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Req,
  Request,
  HttpCode,
} from '@nestjs/common';

import {
  CreateUserWithPermissionUseCase,
  GetUserUseCase,
  GetUsersUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
} from '@ca/application';

import {
  CreateUserRequestDTO,
  CreateUserResponseDTO,
  GetUserRequestDTO,
  GetUserResponseDTO,
  GetUsersResponseDTO,
  UpdateUserRequestDTO,
  UpdateUserResponseDTO,
  DeleteUserRequestDTO,
  DeleteUserResponseDTO,
} from './users.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly createUserWithPermissionUseCase: CreateUserWithPermissionUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
  ) {}

  @Post()
  async create(
    @Req() request: Request,
    @Body() body: CreateUserRequestDTO['body'],
  ): Promise<CreateUserResponseDTO> {
    const user = request['user'];

    const newUser = await this.createUserWithPermissionUseCase.execute(
      body,
      user.id,
    );
    const result = {
      data: {
        id: newUser.getId(),
        email: newUser.getEmail(),
        name: newUser.getName(),
        createdAt: newUser.getCreatedAt().toISOString(),
        updatedAt: newUser.getUpdatedAt().toISOString(),
      },
    };
    return result;
  }

  @Get()
  async getAll(@Req() request: Request): Promise<GetUsersResponseDTO> {
    const user = request['user'];
    const users = await this.getUsersUseCase.execute(user.id);
    const result = {
      data: users.map((user) => ({
        id: user.getId(),
        email: user.getEmail(),
        name: user.getName(),
        createdAt: user.getCreatedAt().toISOString(),
        updatedAt: user.getUpdatedAt().toISOString(),
      })),
    };
    return result;
  }

  @Get(':id')
  async getOne(
    @Req() request: Request,
    @Param() params: GetUserRequestDTO['path'],
  ): Promise<GetUserResponseDTO> {
    const user = request['user'];
    const found = await this.getUserUseCase.execute({ id: params.id }, user.id);
    const result = {
      data: {
        id: found.getId(),
        email: found.getEmail(),
        name: found.getName(),
        createdAt: found.getCreatedAt().toISOString(),
        updatedAt: found.getUpdatedAt().toISOString(),
      },
    };
    return result;
  }

  @Patch(':id')
  @HttpCode(204)
  async update(
    @Req() request: Request,
    @Param() params: UpdateUserRequestDTO['path'],
    @Body() body: UpdateUserRequestDTO['body'],
  ): Promise<UpdateUserResponseDTO> {
    const user = request['user'];
    await this.updateUserUseCase.execute({ id: params.id, ...body }, user.id);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(
    @Req() request: Request,
    @Param() params: DeleteUserRequestDTO['path'],
  ): Promise<DeleteUserResponseDTO> {
    const user = request['user'];
    await this.deleteUserUseCase.execute({ id: params.id }, user.id);
  }
}
