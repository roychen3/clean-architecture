import { PrismaClient } from '../../prisma/generated/client';

export * from '../../prisma/generated/client';

export const prisma = new PrismaClient();
