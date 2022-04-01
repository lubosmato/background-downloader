import { PrismaClient } from "@prisma/client"
import { NextApiRequest } from "next"
import prismaClient from "../prisma/prismaClient"

export interface Context {
  prisma: PrismaClient;
}

export const context: ({ req }: { req: NextApiRequest }) => Promise<Context> =
  async () => ({
    prisma: prismaClient,
  })
