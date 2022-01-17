// Snowpack Configuration File
// See all supported options: https://www.snowpack.dev/reference/configuration

/** @type {import("snowpack").SnowpackUserConfig } */

const httpProxy = require('http-proxy')
const proxy = httpProxy.createServer({
  target: 'http://0.0.0.0:3001'
})

module.exports = {
  mount: {
    public: { url: "/", static: true },
    src: { url: "/dist" },
  },
  devOptions: {
    hostname: "0.0.0.0",
    port: 3000
  },
  routes: [
    {
      src: '/api/.*',
      dest: (req, res) => proxy.web(req, res)
    },
    {
      match: "routes", 
      src: ".*", 
      dest: "/index.html"
    }
  ],
  plugins: [
    "@snowpack/plugin-react-refresh",
    "@snowpack/plugin-dotenv",
    "@snowpack/plugin-typescript",
    "snowpack-plugin-relative-css-urls",
    "snowpack-plugin-svgr",
    "@snowpack/plugin-sass",
    "@snowpack/plugin-dotenv",
    [
      "@snowpack/plugin-run-script", {
        "cmd": "eslint src --ext .js,jsx,.ts,.tsx",
        "watch": "esw -w --clear src --ext .js,jsx,.ts,.tsx"
      }
    ]
  ],
  alias: {
    "components": "./src/components",
    "routes": "./src/routes",
    "assets": "./src/assets",
    "api": "./src/api.ts",
    "bpkutil": "./src/bpkutil.ts"
  }
}