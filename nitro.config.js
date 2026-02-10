import { middlewareDefs } from './module/definitions/middlewares.js'

export default defineNitroConfig({

  runtimeConfig: {
    corsProxySecret: process.env.NUXT_CORS_PROXY_SECRET,
    corsTargetUrl: process.env.NUXT_CORS_TARGET_URL,
  },

  handlers: middlewareDefs.map(mw => ({
    middleware: true,
    route: '/',
    handler: `./runtime/middleware/${mw.file}`
  }))
});
