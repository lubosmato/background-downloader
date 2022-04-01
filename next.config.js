/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, options) => {
    config.experiments.topLevelAwait = true
    // unfortunately top level await works only with babel so SWC is not used
    // https://githubhot.com/repo/module-federation/module-federation-examples/issues/1288
    return config
  },
}

module.exports = nextConfig
