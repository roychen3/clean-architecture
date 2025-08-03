import { v4 as uuidv4 } from 'uuid';

export class Role {
  static NO_PERMISSIONS = 0;
  private id: string;
  private name: string;
  private priority: number; // Lower number means higher priority. 1 is the highest; 0 means no permissions (default).
  private isSuperAdmin: boolean;
  private createdAt: Date;
  private updatedAt: Date;

  constructor(data: {
    id?: string;
    name: string;
    priority?: number;
    isSuperAdmin?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.priority = data.priority || Role.NO_PERMISSIONS;
    this.isSuperAdmin = data.isSuperAdmin || false;
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  getId(): string {
    return this.id;
  }

  getName(): string {
    return this.name;
  }
  setName(value: string): void {
    this.name = value;
  }

  getPriority(): number {
    return this.priority;
  }
  setPriority(value: number): void {
    this.priority = value;
  }

  getIsSuperAdminRole(): boolean {
    return this.isSuperAdmin;
  }
  setIsSuperAdminRole(value: boolean): void {
    this.isSuperAdmin = value;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }
  setCreatedAt(value: Date): void {
    this.createdAt = value;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }
  setUpdatedAt(value: Date): void {
    this.updatedAt = value;
  }
}
