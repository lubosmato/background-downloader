import { wget } from "."
import fs from "fs"

const proc = wget("https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png", "google.png")

proc
  .on("close", () => {
    console.log("Downloaded google.png")
  })
  .on("error", (err) => {
    console.error(err)
  })

const lineRegex = /.*?(\d+)%\[.*?\]\s+(.*?)\s+(.*?)\s(.*?)(\s+eta\s+(.*?)|)\s*/

const speedUnitsMultipliers: Map<string, number> = new Map()
speedUnitsMultipliers.set("B/s", 1)
speedUnitsMultipliers.set("KB/s", 1024)
speedUnitsMultipliers.set("MB/s", 1024 * 1024)
speedUnitsMultipliers.set("GB/s", 1024 * 1024 * 1024)

const handleOutput = (data: Buffer | string | any) => {
  const line = data.toString() as string
  const match = line.match(lineRegex)
  console.log(line)

  // if (!match) return

  // const groups = Array.from(match)
  // const [_, percent, size, speed, speedUnit, eta] = groups
  // console.log(`"${line}",`)
  // console.log(groups)
  // console.log({ percent, size, speed, speedUnit, eta })
}

proc.stdout.on("data", handleOutput)
proc.stderr.on("data", handleOutput)

;(async () => {
  await new Promise((resolve) => {
    proc.on("close", resolve)
  })
  console.log("Done")
})()
