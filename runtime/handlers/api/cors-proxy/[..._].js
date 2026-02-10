import { readBody, getQuery, getRequestHeaders, getMethod } from 'h3'
import { ofetch } from 'ofetch'

export default defineEventHandler(async (event) => {

  const { corsTargetUrl, corsProxySecret } = useRuntimeConfig()

  const apiFetch = ofetch.create({

    baseURL: `https://${corsTargetUrl}`,
    // force JSON parsing so you always get a JS object, not raw bytes
    responseType: 'json',
    // async onRequest({ request, options }) {
    //   console.log('[peach fetch request]', request, options)
    // },
    // async onResponse({ request, response, options }) {
    //   console.log('[peach fetch response]', request, response)
    // },
    // async onRequestError({ request, error }) {
    //   console.log('[peach fetch request error]', request, error)
    // },
    // async onResponseError({ request, response }) {
    //   console.log('[peach fetch response error]', request, response._data)
    // }
  })


  const method = getMethod(event)
  const params = event.context.params._      // e.g. "v1/system/status"
  const query = getQuery(event)

  // Start from incoming headers…
  const incomingHeaders = getRequestHeaders(event)

  if (incomingHeaders['x-cors-proxy-secret'] !== corsProxySecret) {
    setResponseStatus(event, 403)
    return { error: 'Forbidden' }
  }

  // …but DO NOT forward everything blindly.
  // Strip problematic ones so Node/ofetch can handle compression and
  // let Nitro set correct response headers.
  const headers = {
    ...incomingHeaders,
    host: corsTargetUrl,
    accept: 'application/json'
  }

  delete headers['accept-encoding']
  delete headers['content-length']
  delete headers['connection']
  delete headers['origin']
  delete headers['referer']

  let body
  if (method !== 'GET' && method !== 'HEAD') {
    body = await readBody(event)
  }

  const data = await apiFetch(`/${params}`, {
    method,
    headers,
    query,
    body
  })

  return data
})

