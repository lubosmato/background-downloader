import { ApolloServer } from "apollo-server-micro"
import { schema } from "./schema"
import { createContext } from "./context"

export default new ApolloServer({
  schema,
  context: createContext,
})
