# Generate SVG Images at the Edge!

Cloudflare Workers script to generate SVG images on the edge using [@cloudfour/simple-svg-placeholder](https://github.com/cloudfour/simple-svg-placeholder).

Utilises the [Cloudflare Cache API](https://developers.cloudflare.com/workers/runtime-apis/cache/) for generated images.

Domain root will serve either the homepage or default SVG based on the [`Accept`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept) header.

Deploy to your own worker, or use [https://svg.siq.li](https://svg.siq.li).

## Available Options

- `width`
- `height`
- `text`
- `font_family`
- `font_weight`
- `font_size`
- `dy`
- `bg_color`
- `text_color`
- `data_uri`
- `charset`

## Examples
- `/?width=512&height=512`
- `/?width=512&height=512&bg_color=000`
- `/?width=512&height=512&bg_color=000&text=*`
- `/?width=512&height=512&bg_color=000&text_color=FFF`

## License

[Jam License](LICENSE)
