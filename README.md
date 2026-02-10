# cors-proxy-nitro

A minimal **Nitro-based CORS-aware HTTP proxy**, designed to forward requests to a target API while enforcing server-side access control.

## What this is

- A **Nitro service** that proxies HTTP requests to a configurable target URL
- Designed to solve **CORS and browser limitations** by moving the request server-side
- Includes optional **header-based authentication** to protect the proxy from public abuse
- Can run:
  - **standalone** (as a Nitro server)
  - **embedded as a Nuxt module** inside a Nuxt 3 app

## What this is NOT

- Not a generic open proxy
- Not a browser-side CORS workaround
- Not intended to bypass authentication or rate limits of the target service

This proxy is explicitly **opt-in, server-controlled, and locked down by design**.

## Typical use cases

- Proxying third-party APIs that do not support browser CORS
- Centralizing API access logic inside your infrastructure
- Protecting sensitive API credentials from the client
- Reusing the same proxy logic across multiple Nuxt / Nitro projects

## Security model (brief)

- Requests must include a **shared secret header** to be accepted
- All requests execute **server-side only**

## Modes of operation

### Standalone

Run as a standalone Nitro service with environment variables.

### Nuxt module

Import as a Nuxt module and enable it explicitly in `nuxt.config.js`.  
Endpoints are **disabled by default** when used as a module.

## Status

- Stable
- Used as a building block in the p2pay / proxy tooling stack
- Designed to be extended or composed with other Nitro modules


## Configuration

### Standalone

Set environment variables as explained in the `.env.example` file.

Deploy the repo and add the header `x-cors-proxy-secret` with the `NUXT_CORS_PROXY_SECRET`

### Module

- `nuxt.config.js`
```js
export default defineNuxtConfig({
  modules: [
    'cors-proxy-nitro',
  ],

  corsProxyNitro: {
    enabled: true,
    corsProxySecret: process.env.NUXT_CORS_PROXY_SECRET,
    corsTargetUrl: process.env.NUXT_CORS_TARGET_URL,
    corsHealthPath: process.env.NUXT_CORS_HEALTH_PATH // Optional. Defaults to '/'
  }
})
```
Set environment variables as explained in the `.env.example` file.

## Deployment

For manual deployment on cloudflare workers run `npm run deploy:cf`

