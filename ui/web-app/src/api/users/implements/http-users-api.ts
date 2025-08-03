import { httpFetcher } from '@/lib/http-fetcher';

import type { UsersAPI } from '../interfaces';
import type {
  CreateUserRequestDTO,
  CreateUserResponseDTO,
  GetUsersResponseDTO,
  GetUserRequestDTO,
  GetUserResponseDTO,
  UpdateUserRequestDTO,
  UpdateUserResponseDTO,
  DeleteUserRequestDTO,
  DeleteUserResponseDTO,
} from '../dto';

export class HttpUsersAPI implements UsersAPI {
  async create(req: CreateUserRequestDTO): Promise<CreateUserResponseDTO> {
    const response = await httpFetcher.post(`/api/users`, req.body);
    return response.data;
  }

  async getAll(): Promise<GetUsersResponseDTO> {
    const response = await httpFetcher.get(`/api/users`);
    return response.data;
  }

  async getOne(req: GetUserRequestDTO): Promise<GetUserResponseDTO> {
    const response = await httpFetcher.get(`/api/users/${req.path.id}`);
    return response.data;
  }

  async update(req: UpdateUserRequestDTO): Promise<UpdateUserResponseDTO> {
    await httpFetcher.patch(`/api/users/${req.path.id}`, req.body);
  }

  async delete(req: DeleteUserRequestDTO): Promise<DeleteUserResponseDTO> {
    await httpFetcher.delete(`/api/users/${req.path.id}`);
  }
}
