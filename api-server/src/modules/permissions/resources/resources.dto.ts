import { PermissionResourceName } from '@ca/core';

import { BaseRequestDTO, BaseResponseDTO } from '../../../types';

export type ResourceDTO = {
  id: string;
  name: PermissionResourceName;
};

export type GetAllResourcesRequestDTO = BaseRequestDTO;
export type GetAllResourcesResponseDTO = BaseResponseDTO<ResourceDTO[]>;
