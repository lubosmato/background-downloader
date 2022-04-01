import { ApolloServer } from "apollo-server-micro"
import { schema } from "./schema"
import { context } from "./context"

export default new ApolloServer({
  schema,
  context,
})
