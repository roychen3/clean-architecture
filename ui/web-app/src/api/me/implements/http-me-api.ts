import { httpFetcher } from '@/lib/http-fetcher';

import type {
  GetMeProfileResponseDTO,
  UpdateMeRequestDTO,
  UpdateMeResponseDTO,
  ChangeMePasswordRequestDTO,
  ChangeMePasswordResponseDTO,
  DeleteMeRequestDTO,
  DeleteMeResponseDTO,
} from '../dto';
import type { MeAPI } from '../interfaces';

export class HttpMeAPI implements MeAPI {
  async getMe(): Promise<GetMeProfileResponseDTO> {
    const response = await httpFetcher.get('/api/me');
    return response.data;
  }

  async updateMe(req: UpdateMeRequestDTO): Promise<UpdateMeResponseDTO> {
    await httpFetcher.patch('/api/me', req.body);
  }

  async changePassword(
    req: ChangeMePasswordRequestDTO,
  ): Promise<ChangeMePasswordResponseDTO> {
    await httpFetcher.patch('/api/me/change-password', req.body);
  }

  async deleteMe(req: DeleteMeRequestDTO): Promise<DeleteMeResponseDTO> {
    await httpFetcher.delete('/api/me', { data: req.body });
  }
}
