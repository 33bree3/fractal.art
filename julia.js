// working code for julia set /// 

// Get the canvas element from the DOM and get its 2D drawing context
const canvas = document.getElementById("fractalCanvas");
const ctx = canvas.getContext("2d");

// Store the canvas dimensions for easier reference
const width = canvas.width;
const height = canvas.height;

// These are the constant real and imaginary parts for the Julia set formula z = z^2 + c
// You can change these to generate different-looking fractals
const cRe = -0.123;
const cIm = 0.745;

/**
 * Main function that draws the Julia set on the canvas
 */
function drawJulia() {
  const maxIter = 300;
  const zoom = 1.5;
  const offsetX = 0;
  const offsetY = 0;

  const imgData = ctx.createImageData(width, height);

  for (let px = 0; px < width; px++) {
    for (let py = 0; py < height; py++) {
      let x = 1.5 * (px - width / 2) / (0.5 * zoom * width) + offsetX;
      let y = (py - height / 2) / (0.5 * zoom * height) + offsetY;

      let i = 0;
      while (x*x + y*y < 4 && i < maxIter) {
        let xtemp = x*x - y*y + cRe;
        y = 2 * x * y + cIm;
        x = xtemp;
        i++;
      }

      const color = i === maxIter ? 0 : 255 - i * 4;
      const index = (px + py * width) * 4;

      imgData.data[index]     = color;
      imgData.data[index + 1] = color * 0.6;
      imgData.data[index + 2] = color * 0.3;
      imgData.data[index + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

drawJulia();
