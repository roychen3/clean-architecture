import { Role } from '@ca/core';

export interface RolesRepository {
  create(data: Role): Promise<void>;
  findAll(): Promise<Role[]>;
  findById(id: string): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  update(data: Role): Promise<void>;
  delete(id: string): Promise<void>;
}
