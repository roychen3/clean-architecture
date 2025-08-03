import { v4 as uuidv4 } from 'uuid';

export const PERMISSION_ACTION_ENUMS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
} as const;
export type PermissionActionName =
  (typeof PERMISSION_ACTION_ENUMS)[keyof typeof PERMISSION_ACTION_ENUMS];

export class PermissionAction {
  private id: string;
  private name: PermissionActionName;
  constructor(data: { id?: string; name: PermissionActionName }) {
    this.id = data.id || uuidv4();
    this.name = data.name;
  }

  getId(): string {
    return this.id;
  }

  getName(): PermissionActionName {
    return this.name;
  }
  setName(value: PermissionActionName): void {
    this.name = value;
  }
}
