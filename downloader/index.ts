import { ChildProcess, fork } from "child_process"
import path from "path"

let downloaderProcess: ChildProcess | null = null

export function send(message: any) {
  if (!downloaderProcess) run()

  downloaderProcess.send(message)
}

export function run() {
  if (downloaderProcess) return

  downloaderProcess = fork(path.join(process.cwd(), ".next/server/downloader/worker.js"), [], { cwd: process.cwd() })

  send({
    type: "start",
    data: {
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      accountId: 1,
      metadata: {
        name: "test",
      },
    },
  })
}
