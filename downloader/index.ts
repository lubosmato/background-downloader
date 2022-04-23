import { spawn } from "child_process"

export function wget(url: string, filePath: string) {
  return spawn("wget", ["-c", "--progress=bar:force", "--show-progress", "--limit-rate", "1", url, "-O", filePath])
}

const lineRegex = /^.*?(\d+)%\[.*?\]\s+(.*?)(K|M|G|)\s+(.*?)\s*(K|M|G|B)\/s(\s+eta(\s+(.*?)d|)(\s+(.*?)h|)(\s+(.*?)m|)(\s+(.*?)s|)\s*|)\s*$/gm

const unitsMultipliers: Map<string, number> = new Map()
unitsMultipliers.set("B", 1)
unitsMultipliers.set("K", 1024)
unitsMultipliers.set("M", 1024 * 1024)
unitsMultipliers.set("G", 1024 * 1024 * 1024)

export interface DownloadProgress {
  percent: number
  downloadedSize: number
  speed: number
  eta: number | null
}

export function parseWgetLine(line: string): DownloadProgress | null {
  const match = line.matchAll(lineRegex)

  if (!match) return null

  const groups = Array.from(match)[0]

  const toString = (value: any | undefined | null) => {
    return value?.toString() ?? ""
  }

  if (!groups) return null

  const percent = parseFloat(toString(groups[1]))

  const sizeUnitLetter = toString(groups[3])
  const sizeMultiplier = unitsMultipliers.has(sizeUnitLetter) ? unitsMultipliers.get(sizeUnitLetter) : 1
  const size = parseFloat(toString(groups[2])) * sizeMultiplier

  const speedUnitLetter = toString(groups[5])
  const speedMultiplier = unitsMultipliers.has(speedUnitLetter) ? unitsMultipliers.get(speedUnitLetter) : 0
  const speed = parseFloat(toString(groups[4])) * speedMultiplier

  const days = parseFloat(toString(groups[8]))
  const hours = parseFloat(toString(groups[10]))
  const minutes = parseFloat(toString(groups[12]))
  const seconds = parseFloat(toString(groups[14]))

  const isEtaUnknown = isNaN(days) && isNaN(hours) && isNaN(minutes) && isNaN(seconds)

  const eta =
    (!isNaN(days) ? days : 0) * 24 * 60 * 60 +
    (!isNaN(hours) ? hours : 0) * 60 * 60 +
    (!isNaN(minutes) ? minutes : 0) * 60 +
    (!isNaN(seconds) ? seconds : 0)

  return {
    percent,
    downloadedSize: size,
    speed,
    eta: isEtaUnknown ? null : eta,
  }
}
