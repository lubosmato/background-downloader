
import { enumType, objectType, extendType } from "nexus"
import * as prismaSchema from "nexus-prisma"

export const Cloud = enumType(prismaSchema.Cloud)

export const CloudAccount = objectType({
  name: prismaSchema.CloudAccount.$name,
  definition(t) {
    t.field(prismaSchema.CloudAccount.id)
    t.field(prismaSchema.CloudAccount.label)
    t.field(prismaSchema.CloudAccount.username)
    t.field(prismaSchema.CloudAccount.password)
    t.field(prismaSchema.CloudAccount.active)
    t.field(prismaSchema.CloudAccount.metadata.name, { type: "JSON" })
    t.field(prismaSchema.CloudAccount.cloud)
  },
})

export const GetAllAccounts = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("allAccounts", {
      type: prismaSchema.CloudAccount.$name,
      resolve: async (_parent, _args, context, info) => {
        return await context.prisma.cloudAccount.findMany()
      },
    })
  },
})
