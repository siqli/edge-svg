/**
 * SVG Generator Cloudflare Worker
 */
 import simpleSvgPlaceholder from '@cloudfour/simple-svg-placeholder'
 import homepage from "./index.html"
 
/**
 * Validate Hex
 * RGB, RGBA, RRGGBB, RRGGBBAA
 */
const validateHex = (color) => 
  (
    color &&
    [ 3, 4, 6, 8 ].includes(String(color).length) &&
    /^[0-9A-F]+$/i.test(color)
  )
    ? '#'.concat(color)
    : undefined

/**
 * Strip <, > for tags. If asterisk `*` return empty string.
 */
const strCheck = (text) =>
  text
    ? String(text) === "*"
      ? ''
      : text.replace('<', '').replace('>', '')
    : undefined

/**
 * Let the work begin
 */
export default {
  async fetch(req, env, ctx) {
 
    // Get some bits
    const { url, method, headers, } = req

    // Only allow  GET
    if (method !== "GET")
      return new Response("Method Not Allowed", {
        status: 405,
        headers: {
          Allow: "GET",
        }
      })

    // params for SVG
    // pathname for other things
    const {
        searchParams: params,
        pathname,
        origin,
      } = new URL(url)

    // If Accept includes text/html, assume request wants homepage
    if (headers.get('accept') && headers.get('accept').includes('text/html'))
      return new Response(homepage, {
        status: pathname === "/" ? 200 : 404,
        headers: {
          'Content-Type': 'text/html;charset=utf-8',
          Link: `${origin}${pathname}; rel="canonical"`,
          Vary: 'Accept', // If it doesn't include text/html, SVG is generated
        }
      })
    
      // ////////
      // Question now is, should the homepage get cached too?
      // If yes, for how long?
      // Should 404 paths also get cached?
      // It is possible more difficult to implement given the domain root will
      // return either
      // - the homepage as text/html; or
      // - the default SVG as image/svg+xml
      // ////////
    
    // TEST: Implementing of cache as per
    // https://developers.cloudflare.com/workers/examples/cache-api/
    const cacheUrl = new URL(url)
    const cacheKey = new Request(cacheUrl.toString(), req)
    const cache = caches.default

    let response = await cache.match(cacheKey)
    
    // If cache hit, return
    if (response)
      return response
      // Wondering if the reponse status code should get changed here.

    // No cache hit
    // Generating and return SVG
    try {
      const settings = {};
        // Get settings from parameters if they exist
        settings.width = Number(params.get('width')) || undefined
        settings.height = Number(params.get('height')) || undefined
        settings.text = strCheck(params.get('text'))
        settings.fontFamily = params.get('font_family') || undefined
        settings.fontWeight = params.get('font_weight') || undefined
        settings.fontSize = params.get('font_size') || undefined
        settings.dy = Number(params.get('dy')) || undefined
        settings.bgColor = validateHex(params.get('bg_color'))
        settings.textColor = validateHex(params.get('text_color'))
        settings.dataUri = params.get('data_uri') === "true" ? true : false
        settings.charset = params.get('charset') || undefined

      // Set up canonical header for SVG
      const svgCanonical = new URL(origin)
      svgCanonical.search = new URLSearchParams(
        Object.entries(settings)
          // Filter those parameters that are undefined
          .filter(s => s[1] !== undefined)
          // This will include `data_uri` regardless of value though.
        ).toString()

      // Response for generated SVG
      response = new Response(simpleSvgPlaceholder(settings), {
        status: 201,  // 201 Created. Could use 200 OK
        headers: {
          Vary: 'Accept',
          Link: `${svgCanonical}; rel="canonical"`,
          'Content-Type': 'image/svg+xml',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 's-maxage=3600',       // Set long
        }
      })

      // Put reponse into cache
      ctx.waitUntil(cache.put(cacheKey, response.clone()))

      // Return reponse
      return response

    } catch(e) {

      // There was an error... hopefully never.
      // return new Response(e.message || e.toString(), { status: 500 })

      // Given content is expected by this point, rather than returning 500
      // thinking '204 No Content' is possibly better.
      return new Response(null, { status: 204 })
    }
  }
}
