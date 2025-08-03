import { httpFetcher } from '@/lib/http-fetcher';

import type {
  CreateRoleRequestDTO,
  CreateRoleResponseDTO,
  GetAllRolesResponseDTO,
  GetRoleRequestDTO,
  GetRoleResponseDTO,
  UpdateRoleRequestDTO,
  UpdateRoleResponseDTO,
  DeleteRoleRequestDTO,
  DeleteRoleResponseDTO,
} from '../dto';
import type { RolesAPI } from '../interfaces';

export class HttpRolesAPI implements RolesAPI {
  async create(req: CreateRoleRequestDTO): Promise<CreateRoleResponseDTO> {
    const response = await httpFetcher.post('/api/permissions/roles', req.body);
    return response.data;
  }

  async getRoles(): Promise<GetAllRolesResponseDTO> {
    const response = await httpFetcher.get(`/api/permissions/roles`);
    return response.data;
  }

  async getOne(req: GetRoleRequestDTO): Promise<GetRoleResponseDTO> {
    const response = await httpFetcher.get(
      `/api/permissions/roles/${req.path.id}`,
    );
    return response.data;
  }

  async update(req: UpdateRoleRequestDTO): Promise<UpdateRoleResponseDTO> {
    await httpFetcher.patch(`/api/permissions/roles/${req.path.id}`, req.body);
  }

  async delete(req: DeleteRoleRequestDTO): Promise<DeleteRoleResponseDTO> {
    await httpFetcher.delete(`/api/permissions/roles/${req.path.id}`);
  }
}
