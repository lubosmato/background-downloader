// TODO import causes error: Native Node.js APIs are not supported in the Edge Runtime. Found `fs` imported.
import prismaClient from "../prisma/prismaClient"

process.on("message", async (message) => {
  console.log(message)
  const file = await prismaClient.file.findFirst({
    where: {
      id: 1,
    },
  })

  console.log(file)
})

process.on("exit", (code) => {
  console.log("process exited with code:", code)
})

export const dummy = {}
