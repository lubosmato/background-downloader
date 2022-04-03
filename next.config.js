const { merge } = require("webpack-merge")
const path = require("path")

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, options) => {
    config.experiments.topLevelAwait = true
    // unfortunately top level await works only with babel so SWC is not used
    // https://githubhot.com/repo/module-federation/module-federation-examples/issues/1288

    if (options.isServer) {
      // transpile downloader worker into a file that can be run as a process by the server
      config.output.globalObject = "this"

      return merge(config, {
        entry () {
          return config.entry().then((entry) => {
            return {
              ...entry,
              "downloader/worker": path.resolve(process.cwd(), "downloader/worker.ts"),
            }
          })
        },
      })
    } else {
      return config
    }

    return config
  },
}

module.exports = nextConfig
