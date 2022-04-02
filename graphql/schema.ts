
import { makeSchema } from "nexus"
import { join } from "path"
import * as CloudAccountTypes from "./types/CloudAccount"
import * as FileTypes from "./types/File"

export const schema = makeSchema({
  types: [
    ...Object.values(CloudAccountTypes),
    ...Object.values(FileTypes),
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
