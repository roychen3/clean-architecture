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
} from './dto';

export interface RolesAPI {
  create(req: CreateRoleRequestDTO): Promise<CreateRoleResponseDTO>;
  getRoles(): Promise<GetAllRolesResponseDTO>;
  getOne(req: GetRoleRequestDTO): Promise<GetRoleResponseDTO>;
  update(req: UpdateRoleRequestDTO): Promise<UpdateRoleResponseDTO>;
  delete(req: DeleteRoleRequestDTO): Promise<DeleteRoleResponseDTO>;
}
