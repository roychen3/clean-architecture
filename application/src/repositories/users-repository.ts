import { User } from '@ca/core';

export interface UsersRepository {
  create(data: User): Promise<void>;
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(data: User): Promise<void>;
  delete(id: string): Promise<void>;
}
