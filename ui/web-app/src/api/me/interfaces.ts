import type {
  GetMeProfileResponseDTO,
  UpdateMeRequestDTO,
  UpdateMeResponseDTO,
  ChangeMePasswordRequestDTO,
  ChangeMePasswordResponseDTO,
  DeleteMeRequestDTO,
  DeleteMeResponseDTO,
} from './dto';

export interface MeAPI {
  getMe(): Promise<GetMeProfileResponseDTO>;
  updateMe(req: UpdateMeRequestDTO): Promise<UpdateMeResponseDTO>;
  changePassword(
    req: ChangeMePasswordRequestDTO,
  ): Promise<ChangeMePasswordResponseDTO>;
  deleteMe(req: DeleteMeRequestDTO): Promise<DeleteMeResponseDTO>;
}
