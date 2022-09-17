/**
 * Minify homepage HTML
 */
const minify = require('html-minifier').minify;
const fs = require('fs')

const homepage = fs.readFileSync('site/index.html').toString()
const minified = minify(homepage, {
  removeAttributeQuotes: true,
  collapseWhitespace: true,
  html5: true,
  removeComments: true,
  useShortDoctype: true,
  minifyCSS: true,
  minifyJS: true,
});

fs.writeFileSync('src/index.html', minified)
