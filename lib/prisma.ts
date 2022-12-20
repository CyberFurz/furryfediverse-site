import { PrismaClient } from "@prisma/client";
declare let global: { prismac: PrismaClient };

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more: 
// https://pris.ly/d/help/next-js-best-practices

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.prismac) {
    global.prismac = new PrismaClient()
  }
  prisma = global.prismac
}
export default prisma