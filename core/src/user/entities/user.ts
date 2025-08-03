import { v4 as uuidv4 } from 'uuid';
import z from 'zod';

import { ValidateResponse } from '../../validators';
import { Role } from '../../permission';

const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(40, 'Name must be at most 40 characters long'),
  email: z
    .string()
    .email('Invalid email format')
    .max(40, 'Email must be at most 40 characters long'),
  password: z
    .string()
    .min(8, 'Password must be at least 6 characters long')
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
    ),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export class User {
  private id: string;
  private email: string;
  private password: string;
  private name: string;
  private roles: Role[];
  private createdAt: Date;
  private updatedAt: Date;

  constructor(data: {
    id?: string;
    email: string;
    password: string;
    name: string;
    roles?: Role[];
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = data.id || uuidv4();
    this.email = data.email;
    this.password = data.password;
    this.name = data.name;
    this.roles = data.roles || [];
    this.createdAt = data.createdAt || new Date();
    this.updatedAt = data.updatedAt || new Date();
  }

  getId(): string {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }
  setEmail(value: string): void {
    this.email = value;
    this.updatedAt = new Date();
  }

  getPassword(): string {
    return this.password;
  }
  setPassword(value: string): void {
    this.password = value;
    this.updatedAt = new Date();
  }

  getName(): string {
    return this.name;
  }
  setName(value: string): void {
    this.name = value;
    this.updatedAt = new Date();
  }

  getRoles(): Role[] {
    return this.roles;
  }
  setRoles(value: Role[]): void {
    this.roles = value;
    this.updatedAt = new Date();
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  validate(): ValidateResponse {
    const result = userSchema.safeParse({
      id: this.id,
      name: this.name,
      email: this.email,
      password: this.password,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });

    return {
      success: result.success,
      error: result.success ? null : result.error,
    };
  }
}
