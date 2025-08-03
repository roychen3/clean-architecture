import type { AccessTokenPayload } from '@/api/auth/dto';
import { jwtDecode as jwtDecodeLib } from 'jwt-decode';

export function jwtDecode(token: string): AccessTokenPayload {
  const decoded = jwtDecodeLib<AccessTokenPayload>(token);
  return decoded;
}
