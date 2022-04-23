
import { enumType, objectType, extendType, scalarType, mutationField, nonNull, arg, inputObjectType } from "nexus"
import * as prismaSchema from "nexus-prisma"
import type { Cloud } from "@prisma/client"
import { CloudConnector, NotImplementedConnector } from "../../clouds"
import { Webshare } from "../../clouds/webshare"

export const JSONScalar = scalarType({
  name: "JSON",
  asNexusMethod: "json",
})

export const FileState = enumType(prismaSchema.FileState)

export const File = objectType({
  name: prismaSchema.File.$name,
  definition(t) {
    t.field(prismaSchema.File.id)
    t.field(prismaSchema.File.account)
    t.field(prismaSchema.File.downloadSpeed)
    t.field(prismaSchema.File.metadata.name, { type: "JSON" })
    t.field(prismaSchema.File.path)
    t.field(prismaSchema.File.progress)
    t.field(prismaSchema.File.size)
    t.field(prismaSchema.File.state)
    t.field(prismaSchema.File.thumbnailUrl)
    t.field(prismaSchema.File.title)
    t.field(prismaSchema.File.url)
  },
})

export const GetAllFiles = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("allFiles", {
      type: prismaSchema.File.$name,
      resolve: async (_parent, _args, context, info) => {
        return await context.prisma.file.findMany()
      },
    })
  },
})

export const NewFileInput = inputObjectType({
  name: "NewFileInput",
  definition(t) {
    t.nonNull.string("url")
    t.nonNull.int("accountId")
    t.json("metadata")
  },
})

export const AddNewFile = mutationField("addNewFile", {
  type: File,
  args: {
    data: nonNull(arg({ type: NewFileInput.name })),
  },
  resolve: async (_parent, { data }, context, info) => {
    // TODO start downloading process, etc.

    return await context.prisma.file.create({
      data: {
        metadata: {},
        ...data,
        downloadSpeed: 0,
        path: "TODO",
        progress: 0,
        size: 0,
        state: "InQueue",
        thumbnailUrl: "TODO",
        title: "TODO",
      },
    })
  },
})

type CloudConnectors = {
  [key in Cloud]: CloudConnector
}

const clouds: CloudConnectors = {
  Http: new NotImplementedConnector(),
  TorrentMagnet: new NotImplementedConnector(),
  WebShare: new Webshare(),
}

export const TestWebshare = mutationField("testWebshare", {
  type: JSONScalar,
  args: {},
  resolve: async () => {
    // NOTE PoC code here
    const cloudType = "WebShare"
    const cloud = clouds[cloudType]

    if(!cloud) throw new Error(`Cloud ${cloudType} not found`)

    const files = await cloud.search("jumanji 2160p")
    await cloud.startDownloading(files[0])

    return files
  },
})
