import {
  Body,
  Controller,
  Get,
  Patch,
  Delete,
  Req,
  Request,
  HttpCode,
} from '@nestjs/common';

import {
  GetMeProfileUseCase,
  UpdateMeProfileUseCase,
  ChangeMePasswordUseCase,
  DeleteMeUseCase,
} from '@ca/application';

import {
  GetMeProfileResponseDTO,
  UpdateMeRequestDTO,
  ChangeMePasswordRequestDTO,
  ChangeMePasswordResponseDTO,
  DeleteMeRequestDTO,
  DeleteMeResponseDTO,
} from './me.dto';

@Controller('me')
export class MeController {
  constructor(
    private readonly getMeProfileUseCase: GetMeProfileUseCase,
    private readonly updateMeProfileUseCase: UpdateMeProfileUseCase,
    private readonly changeMePasswordUseCase: ChangeMePasswordUseCase,
    private readonly deleteMeUseCase: DeleteMeUseCase,
  ) {}

  @Get()
  async getMe(@Req() request: Request): Promise<GetMeProfileResponseDTO> {
    const user = request['user'];
    const me = await this.getMeProfileUseCase.execute(user, user.id);
    const result = {
      data: {
        id: me.getId(),
        email: me.getEmail(),
        name: me.getName(),
        createdAt: me.getCreatedAt().toISOString(),
        updatedAt: me.getUpdatedAt().toISOString(),
      },
    };
    return result;
  }

  @Patch()
  @HttpCode(204)
  async update(
    @Body() body: UpdateMeRequestDTO['body'],
    @Req() request: Request,
  ) {
    const user = request['user'];
    await this.updateMeProfileUseCase.execute(
      {
        id: user.id,
        name: body.name,
      },
      user.id,
    );
  }

  @Patch('change-password')
  @HttpCode(204)
  async changePassword(
    @Req() request: Request,
    @Body() body: ChangeMePasswordRequestDTO['body'],
  ): Promise<ChangeMePasswordResponseDTO> {
    const user = request['user'];
    await this.changeMePasswordUseCase.execute(
      {
        id: user.id,
        oldPassword: body.oldPassword,
        newPassword: body.newPassword,
      },
      user.id,
    );
  }

  @Delete()
  @HttpCode(204)
  async delete(
    @Req() request: Request,
    @Body() body: DeleteMeRequestDTO['body'],
  ): Promise<DeleteMeResponseDTO> {
    const user = request['user'];
    await this.deleteMeUseCase.execute(
      {
        id: user.id,
        password: body.password,
      },
      user.id,
    );
  }
}
