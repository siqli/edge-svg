/**
 * SVG Generator Cloudflare Worker
 * 
 * SPDX-License-Identifier: Jam
 */
import svg from '../../node_modules/@cloudfour/simple-svg-placeholder/mjs/index.js'
import pkg from "../../package.json" assert { type: 'json' }

const { version } = pkg

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
export default (req) => {
 
  // Get some bits
  const { url, method, } = req

  // Only allow  GET
  if (method !== "GET")
    return new Response("Method Not Allowed", {
      status: 405,
      headers: {
        Allow: "GET",
      }
    })

  // params for SVG
  // href for canonical
  const {
      searchParams: params,
      href,
    } = new URL(url)

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

    
    // Response for generated SVG
    let response = new Response(svg(settings), {
      status: 201,  // 201 Created. Could use 200 OK
      headers: {
        Vary: 'Accept',
        Link: `<${href}>; rel="canonical"`,
        'Content-Type': 'image/svg+xml',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Origin': '*',
        'Siqli-Edge-SVG': `v${version}`,
        'Cache-Control': 's-maxage=3600',       // Set long
      }
    })

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
