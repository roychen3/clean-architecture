import { Controller, Get, Req, Request } from '@nestjs/common';

import { GetAllPermissionResourcesUseCase } from '@ca/application';

import { GetAllResourcesResponseDTO } from './resources.dto';

@Controller('permissions/resources')
export class ResourcesController {
  constructor(
    private readonly getAllPermissionResourcesUseCase: GetAllPermissionResourcesUseCase,
  ) {}

  @Get()
  async getAll(@Req() request: Request): Promise<GetAllResourcesResponseDTO> {
    const user = request['user'];
    const resources = await this.getAllPermissionResourcesUseCase.execute(
      user.id,
    );
    const result = {
      data: resources.map((resource) => ({
        id: resource.getId(),
        name: resource.getName(),
      })),
    };
    return result;
  }
}
