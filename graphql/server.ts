import { ApolloServer } from "apollo-server-micro"
import { schema } from "./schema"
import { createContext } from "./context"
import { run } from "../downloader"

export default new ApolloServer({
  schema,
  context: createContext,
})

// TODO run downloader on server start
run()
