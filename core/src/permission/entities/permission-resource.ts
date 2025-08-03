import { v4 as uuidv4 } from 'uuid';

export const PERMISSION_RESOURCE_ENUMS = {
  ARTICLES: 'articles',
  USERS: 'users',
  ME: 'me',
  ROLES: 'roles',
  PERMISSIONS: 'permissions',
} as const;
export type PermissionResourceName =
  (typeof PERMISSION_RESOURCE_ENUMS)[keyof typeof PERMISSION_RESOURCE_ENUMS];

export class PermissionResource {
  private id: string;
  private name: PermissionResourceName;
  constructor(data: { id?: string; name: PermissionResourceName }) {
    this.id = data.id || uuidv4();
    this.name = data.name;
  }

  getId(): string {
    return this.id;
  }

  getName(): PermissionResourceName {
    return this.name;
  }
  setName(value: PermissionResourceName): void {
    this.name = value;
  }
}
