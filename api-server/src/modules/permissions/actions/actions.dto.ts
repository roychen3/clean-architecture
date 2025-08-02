import { PermissionActionName } from '@ca/core';

import { BaseRequestDTO, BaseResponseDTO } from '../../../types';

export type ActionDTO = {
  id: string;
  name: PermissionActionName;
};

export type GetAllActionsRequestDTO = BaseRequestDTO;
export type GetAllActionsResponseDTO = BaseResponseDTO<ActionDTO[]>;
