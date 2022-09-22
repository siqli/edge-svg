/**
 * Generate 20 random SVG images as a test.
 * Was 100.
 * Originally tried 1000, but that resulted in 429 errors.
 */

// Copy to clipboard
const copyToClipbord = (e) => {

  // Get image source
  const { src } = e.target

  // Try writing to clipboard
  try {
    // Write to clipboard
    navigator.clipboard.writeText(src)

    // Create copied dive
    const copied = document.createElement('div')

    // Set classname
    copied.className = "copied"

    // Add text
    copied.innerText = "Copied!"

    // Append to body
    document.body.appendChild(copied)

    // Make it disappear automagically
    setTimeout(() => document.body.removeChild(copied), 500)
  }
  // Clipboard events unavailable
  catch(err) {
    console.log(err)
  }
}

// Where to output everything
const main = document.querySelector('main')

// Characters for colour codes
const chars = [ "A", "B", "C", "D", "E", "F", 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ];

// RRGGBBAA codes look nicer
const codes = Array.from(
  { length: 20 },
  () => Array.from(
    { length: 8 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join('')
)

// Loop each code
codes.forEach(code => {

  // Create image element
  let img = document.createElement('img')

  // Set source
  img.src = `/svg?width=384&height=384&bg_color=${code}&text=*`

  // Set loading to lazy (does this really work?)
  img.loading = "lazy"

  // Alt text
  img.alt = `Color: ${code}`

  // Make keyboard focusable
  img.tabIndex = 0

  // Add click event
  img.addEventListener('click', copyToClipbord)

  // Add keydown event
  img.addEventListener('keydown', (e) => {
    if (e.code === "Enter")
      copyToClipbord(e)
  })

  // Append image to output area
  main.appendChild(img)
})
