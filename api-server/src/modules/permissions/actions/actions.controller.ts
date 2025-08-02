import { Controller, Get, Req, Request } from '@nestjs/common';

import { GetAllPermissionActionsUseCase } from '@ca/application';

import { GetAllActionsResponseDTO } from './actions.dto';

@Controller('permissions/actions')
export class ActionsController {
  constructor(
    private readonly getAllPermissionActionsUseCase: GetAllPermissionActionsUseCase,
  ) {}

  @Get()
  async getAll(@Req() request: Request): Promise<GetAllActionsResponseDTO> {
    const user = request['user'];
    const actions = await this.getAllPermissionActionsUseCase.execute(user.id);
    const result = {
      data: actions.map((action) => ({
        id: action.getId(),
        name: action.getName(),
      })),
    };
    return result;
  }
}
