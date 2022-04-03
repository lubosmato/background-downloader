console.log("worker starting")

// TODO it throws error
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
