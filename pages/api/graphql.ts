import server from "../../graphql/server"
import type { NextApiRequest, NextApiResponse } from "next"

const handleCors = (next: (req: NextApiRequest, res: NextApiResponse) => any) => async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Access-Control-Allow-Credentials", "true")
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://studio.apollographql.com"
  )

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  )
  res.setHeader("Access-Control-Allow-Headers", "*")
  if (req.method === "OPTIONS") {
    res.status(200).end()
    return
  }

  return await next(req, res)
}

export const config = {
  api: {
    bodyParser: false,
  },
}

// @ts-ignore
await server.start()

const serverHandler = server.createHandler({
  path: "/api/graphql",
})

export default handleCors(serverHandler)
