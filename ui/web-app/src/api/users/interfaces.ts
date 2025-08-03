import type {
  CreateUserRequestDTO,
  CreateUserResponseDTO,
  GetUsersRequestDTO,
  GetUsersResponseDTO,
  GetUserRequestDTO,
  GetUserResponseDTO,
  UpdateUserRequestDTO,
  UpdateUserResponseDTO,
  DeleteUserRequestDTO,
  DeleteUserResponseDTO,
} from './dto';

export interface UsersAPI {
  create(req: CreateUserRequestDTO): Promise<CreateUserResponseDTO>;
  getAll(req: GetUsersRequestDTO): Promise<GetUsersResponseDTO>;
  getOne(req: GetUserRequestDTO): Promise<GetUserResponseDTO>;
  update(req: UpdateUserRequestDTO): Promise<UpdateUserResponseDTO>;
  delete(req: DeleteUserRequestDTO): Promise<DeleteUserResponseDTO>;
}
