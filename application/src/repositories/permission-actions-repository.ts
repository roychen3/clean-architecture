import { PermissionAction } from '@ca/core';

export interface PermissionActionsRepository {
  create(data: PermissionAction): Promise<void>;
  findAll(): Promise<PermissionAction[]>;
  findById(id: string): Promise<PermissionAction | null>;
  update(data: PermissionAction): Promise<void>;
  delete(id: string): Promise<void>;
}
