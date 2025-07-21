// Get the canvas element from the DOM and get its 2D drawing context
const canvas = document.getElementById("fractalCanvas");
const ctx = canvas.getContext("2d");

// Set the canvas dimensions to fill the browser window
const width = canvas.width;
const height = canvas.height;


// Store the canvas dimensions for easier reference
const width = canvas.width;
const height = canvas.height;

// These are the constant real and imaginary parts for the Julia set formula z = z^2 + c
// You can change these to generate different-looking fractals
const cRe = -0.7;
const cIm = 0.27015;

/**
 * Main function that draws the Julia set on the canvas
 */
function drawJulia() {
  // How many iterations to try before assuming a point is in the set
  const maxIter = 300;

  // Zoom factor (higher zooms in on the fractal)
  const zoom = 1.5;

  // Offset allows us to pan around the fractal
  const offsetX = 0;
  const offsetY = 0;

  // Create an empty image buffer to draw pixels onto
  const imgData = ctx.createImageData(width, height);

  // Loop over each pixel on the screen
  for (let px = 0; px < width; px++) {
    for (let py = 0; py < height; py++) {

      // Map pixel coordinate to complex number space (x + iy)
      let x = 1.5 * (px - width / 2) / (0.5 * zoom * width) + offsetX;
      let y = (py - height / 2) / (0.5 * zoom * height) + offsetY;

      // Start the iteration count
      let i = 0;

      // Iterate the formula z = z^2 + c until the magnitude grows too large or we hit the max iterations
      while (x*x + y*y < 4 && i < maxIter) {
        let xtemp = x*x - y*y + cRe; // Real part of z^2 + c
        y = 2 * x * y + cIm;         // Imaginary part of z^2 + c
        x = xtemp;
        i++;
      }

      // Determine color based on how quickly the point "escaped"
      // More iterations = darker color (points closer to the set)
      const color = i === maxIter ? 0 : 255 - i * 4;

      // Calculate the pixel index in the image data array
      const index = (px + py * width) * 4;

      // Set pixel color (R, G, B, A)
      imgData.data[index]     = color;         // Red
      imgData.data[index + 1] = color * 0.6;   // Green (dimmer for variety)
      imgData.data[index + 2] = color * 0.3;   // Blue (even dimmer)
      imgData.data[index + 3] = 255;           // Alpha (fully opaque)
    }
  }

  // Draw the final image to the canvas
  ctx.putImageData(imgData, 0, 0);
}




// Run the function to generate the image
drawJulia();
