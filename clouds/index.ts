
export interface CloudFile {
  id: string
  url: string
  name: string
  size: number
  thumbUrl: string
}

export interface CloudConnector {

  metadata: any

  login(username: string, password: string): Promise<void>
  search(what: string): Promise<CloudFile[]>
  startDownloading(what: CloudFile): Promise<void>
}

export class NotImplementedConnector implements CloudConnector {
  metadata: any

  login(username: string, password: string): Promise<void> {
    throw new Error("Method not implemented.")
  }
  search(what: string): Promise<CloudFile[]> {
    throw new Error("Method not implemented.")
  }
  startDownloading(what: CloudFile): Promise<void> {
    throw new Error("Method not implemented.")
  }
}
