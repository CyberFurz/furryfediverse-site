import { PrismaClient, PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient & PrismaClientKnownRequestError & PrismaClientValidationError | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma