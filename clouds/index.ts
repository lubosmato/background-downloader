
import type { File } from "@prisma/client"

export interface CloudFile {
  id: string
  url: string
  name: string
  size: number
  thumbUrl: string
}

export interface CloudConnector {

  metadata: any

  search(what: string): Promise<CloudFile[]>
  startDownloading(what: CloudFile): Promise<File>
}

export class NotImplementedConnector implements CloudConnector {
  metadata: any

  search(what: string): Promise<CloudFile[]> {
    throw new Error("Method not implemented.")
  }
  startDownloading(what: CloudFile): Promise<File> {
    throw new Error("Method not implemented.")
  }
}

export const downloadPath = "./downloads"
