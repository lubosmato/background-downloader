import { CloudConnector, CloudFile } from ".."
import { hash } from "./helpers"
import convert from "xml-js"
import fetch from "node-fetch"

interface WebshareMetadata {
  wst: string
}

export class Webshare implements CloudConnector {
  metadata: WebshareMetadata

  constructor() {
    this.metadata = { wst: "" }
  }

  async startDownloading(what: CloudFile): Promise<void> {
    const data = await this.callApi("api/file_link/", {
      ident: what.id,
      password: "",
      download_type: "file_download",
      force_https: true,
      device_res_x: 1920,
      device_res_y: 1080,
    })

    if (data["response"]["status"]["_text"] !== "OK") throw new Error("Download failed")

    const link = data["response"]["link"]["_text"]
    console.log("file link is:", link)
    // TODO continue here
  }

  async search(what: string): Promise<CloudFile[]> {
    const data = await this.callApi("api/search/", {
      what, sort: "largest", offset: 0, limit: 25, category: "",
    })
    const files = data["response"]["file"] ?? []

    return files.map((f: any): CloudFile => ({
      id: f["ident"]["_text"],
      name: f["name"]["_text"],
      size: parseInt(f["size"]["_text"]),
      url: `https://webshare.cz/#/file/${f["ident"]["_text"]}`,
      thumbUrl: f["img"]["_text"],
    }))
  }

  async login(username: string, password: string): Promise<void> {
    if (await this.checkLogin()) return

    const salt = await this.getSalt(username)
    this.metadata.wst = this.randomString(16)
    const passwordHash = hash(password, salt)

    await this.callLogin(username, passwordHash)
  }

  private randomString(length: number) {
    const chars ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let result = " "
    const charactersLength = chars.length
    for (let i = 0; i < length; i++ ) {
      result += chars.charAt(Math.floor(Math.random() * charactersLength))
    }

    return result
  }

  private async callApi(endpoint: string, input: {[key: string]: any}): Promise<any> {
    input["wst"] = this.metadata.wst
    const query = Object.entries(input).map(([k, v]) => `${k}=${v}`).join("&")

    const response = await fetch(`https://webshare.cz/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: query,
    })

    const xmlData = await response.text()
    const data = convert.xml2js(xmlData, { compact: true })

    return data
  }

  private async checkLogin(): Promise<boolean> {
    if (!this.metadata.wst) return false

    try {
      const data = await this.callApi("api/user_data/", {})
      return data["response"]["status"]["_text"] === "OK"
    } catch {
      return false
    }
  }

  private async getSalt(username: string): Promise<string> {
    try {
      const data = await this.callApi("api/salt/", { username_or_email: username })
      return data["response"]["salt"]["_text"]
    } catch {
      return ""
    }
  }

  private async callLogin(username: string, passwordHash: string): Promise<void> {
    const data = await this.callApi("api/login/", {
      username_or_email: username,
      password: passwordHash,
      keep_logged_in: 1,
    })

    if (data["response"]["status"]["_text"] !== "OK") throw new Error("Login failed")

    this.metadata.wst = data["response"]["token"]["_text"]
  }

}
