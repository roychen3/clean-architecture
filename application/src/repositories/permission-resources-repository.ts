import { PermissionResource } from '@ca/core';

export interface PermissionResourcesRepository {
  create(data: PermissionResource): Promise<void>;
  findAll(): Promise<PermissionResource[]>;
  findById(id: string): Promise<PermissionResource | null>;
  update(data: PermissionResource): Promise<void>;
  delete(id: string): Promise<void>;
}
