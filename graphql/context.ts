import { PrismaClient } from "@prisma/client"
import { NextApiRequest } from "next"
import prismaClient from "../prisma/prismaClient"

export interface Context {
  prisma: PrismaClient;
}

export function createContext({ req }: { req: NextApiRequest }): Context {
  return {
    prisma: prismaClient,
  }
}
