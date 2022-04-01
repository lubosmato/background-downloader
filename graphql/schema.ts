
import { makeSchema, objectType, enumType, scalarType } from "nexus"
import { File, FileState, CloudAccount, CloudType } from "nexus-prisma"

import { join } from "path"

export const JSONScalar = scalarType({
  name: "JSON",
  asNexusMethod: "json",
})

const CloudTypeType = enumType({ ...CloudType })
const FileStateType = enumType({ ...FileState })

const CloudAccountType = objectType({
  name: CloudAccount.$name,
  definition(t) {
    t.field(CloudAccount.id)
    t.field(CloudAccount.label)
    t.field(CloudAccount.username)
    t.field(CloudAccount.password)
    t.field(CloudAccount.cloud)
  },
})

const FileType = objectType({
  name: File.$name,
  definition(t) {
    t.field(File.id)
    t.field(File.account)
    t.field(File.downloadSpeed)
    t.field(File.metadata.name, { type: "JSON" })
    t.field(File.path)
    t.field(File.progress)
    t.field(File.size)
    t.field(File.state)
    t.field(File.thumbnailUrl)
    t.field(File.title)
    t.field(File.url)
  },
})

const Query = objectType({
  name: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("allAccounts", {
      type: CloudAccount.$name,
      resolve: async (_parent, _args, context, info) => {
        return await context.prisma.cloudAccount.findMany()
      },
    }),

    t.nonNull.list.nonNull.field("allFiles", {
      type: File.$name,
      resolve: async (_parent, _args, context, info) => {
        return await context.prisma.file.findMany()
      },
    })
  },
})

export const schema = makeSchema({
  types: [
    Query,
    JSONScalar,
    FileType,
    FileStateType,
    CloudTypeType,
    CloudAccountType,
  ],

  contextType: {
    module: join(process.cwd(), "graphql/context.ts"),
    export: "Context",
  },

  outputs: {
    schema: true, // means schema.graphql in the root
    typegen: join(process.cwd(), "graphql/__generated__/index.d.ts"),
  },
})
