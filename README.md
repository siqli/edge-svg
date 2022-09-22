# Generate SVG Images at the Edge!

Netlify Edge Function to generate SVG images on the edge using [@cloudfour/simple-svg-placeholder](https://github.com/cloudfour/simple-svg-placeholder).

Unlike the original version using Cloudflare Workers, the function here runs on a different path `/svg`.

This version is a demonstration of how one might implement and use their own generator, rather than using an external service *(like [https://svg.siq.li](https://svg.siq.li).)*

Demonstration available at [https://siqli-svg.netlify.app](https://siqli-svg.netlify.app).

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
- `/svg?width=512&height=512`
- `/svg?width=512&height=512&bg_color=000`
- `/svg?width=512&height=512&bg_color=000&text=*`
- `/svg?width=512&height=512&bg_color=000&text_color=FFF`

## License

[Jam License](LICENSE)
