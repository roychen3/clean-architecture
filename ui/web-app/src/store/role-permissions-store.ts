import { Store } from '@tanstack/store';

import { jwtDecode } from '@/lib/jwt';

import type { RolePermission } from '@/api/role-permissions/dto';
interface RolePermissionsState {
  userPermissions: RolePermission[];
}

export class RolePermissionsStore extends Store<RolePermissionsState> {
  constructor() {
    let userPermissions: RolePermission[] = [];
    const accessToken = window.localStorage.getItem('accessToken');
    if (accessToken) {
      const payload = jwtDecode(accessToken);
      userPermissions = payload.userPermissions;
    }
    super({ userPermissions });
  }

  setUserPermissions(value: RolePermission[]) {
    this.setState((prevState) => ({
      ...prevState,
      userPermissions: value,
    }));
  }

  can(action: string, resource: string): boolean {
    const result = this.state.userPermissions.some((rp) =>
      rp.permissions.some(
        (p) =>
          p.resource.name === resource &&
          p.actions.some((a) => a.name === action),
      ),
    );
    return result;
  }
}

export const rolePermissionsStore = new RolePermissionsStore();
