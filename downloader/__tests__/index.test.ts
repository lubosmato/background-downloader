import { parseWgetLine } from ".."

describe("wget output parser", () => {

  it("should parse line without eta", () => {
    const line = `
google.png            3%[                    ]     512   512 B/s               `

    const progress = parseWgetLine(line)

    expect(progress).toEqual({
      percent: 3,
      downloadedSize: 512,
      speed: 512,
      eta: null,
    })
  })

  it("should parse line with eta", () => {
    const line = `
google.png           11%[=>                  ]   1.50K   512 B/s    eta 23s    `

    const progress = parseWgetLine(line)

    expect(progress).toEqual({
      percent: 11,
      downloadedSize: 1.5 * 1024,
      speed: 512,
      eta: 23,
    })
  })

  it("should parse line from resumed download", () => {
    const line = `
google.png           66%[+++++++++++++       ]   8.76K  --.-KB/s               `

    const progress = parseWgetLine(line)

    expect(progress).toEqual({
      percent: 66,
      downloadedSize: 8.76 * 1024,
      speed: NaN,
      eta: null,
    })
  })

  it("should parse line from resumed download", () => {
    const line = `
google.png           96%[+++++++++++++=====> ]  12.76K   567 B/s    eta 1s     `

    const progress = parseWgetLine(line)

    expect(progress).toEqual({
      percent: 96,
      downloadedSize: 12.76 * 1024,
      speed: 567,
      eta: 1,
    })
  })

  it("should not parse other than progress lines", () => {
    const lines = [`
--2022-04-04 10:13:42--  https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png`,
    `
--2022-04-04 10:13:42--  https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png`,
    `
Connecting to www.google.com (www.google.com)|142.251.36.68|:443... `,
    "Length: 13504 (13K) [image/png]",
    "",
    ]

    for (const line of lines) expect(parseWgetLine(line)).toEqual(null)
  })

  it("should convert speed units", () => {
    const testIt = (speed: number, unit: string, expectedSpeed: number) => {
      expect(parseWgetLine(`google.png           96%[+++++++++++++=====> ]  12.76K   ${speed} ${unit}/s   eta 1s     `)).toEqual({
        percent: 96,
        downloadedSize: 12.76 * 1024,
        speed: expectedSpeed,
        eta: 1,
      })
    }

    testIt(123, "B", 123)
    testIt(123, "K", 123 * 1024)
    testIt(123, "M", 123 * 1024 * 1024)
    testIt(123, "G", 123 * 1024 * 1024 * 1024)
  })

  it("should convert size units", () => {
    const testIt = (size: number, unit: string, expectedSize: number) => {
      expect(parseWgetLine(`google.png           96%[+++++++++++++=====> ]  ${size}${unit}   512 B/s   eta 1s     `)).toEqual({
        percent: 96,
        downloadedSize: expectedSize,
        speed: 512,
        eta: 1,
      })
    }

    testIt(123, "B", 123)
    testIt(123, "K", 123 * 1024)
    testIt(123, "M", 123 * 1024 * 1024)
    testIt(123, "G", 123 * 1024 * 1024 * 1024)
  })

  it("should convert eta units", () => {
    const testIt = (eta: string, expectedEta: number) => {
      expect(parseWgetLine(`google.png           96%[+++++++++++++=====> ]  12.76K   512 B/s   eta ${eta}     `)).toEqual({
        percent: 96,
        downloadedSize: 12.76 * 1024,
        speed: 512,
        eta: expectedEta,
      })
    }

    testIt("158s", 158)
    testIt("21m 48s", 21 * 60 + 48)
    testIt("4h 21m 48s", 4 * 60 * 60 + 21 * 60 + 48)
    testIt("1234d", 1234 * 24 * 60 * 60)
  })
})
