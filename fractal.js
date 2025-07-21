const canvas = document.getElementById("fractalCanvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const width = canvas.width;
const height = canvas.height;

function drawMandelbrot() {
  const imgData = ctx.createImageData(width, height);
  const maxIter = 100;

  for (let px = 0; px < width; px++) {
    for (let py = 0; py < height; py++) {
      let x0 = (px - width / 2) * 4 / width;
      let y0 = (py - height / 2) * 4 / width;

      let x = 0;
      let y = 0;
      let iter = 0;

      while (x*x + y*y <= 4 && iter < maxIter) {
        let xtemp = x*x - y*y + x0;
        y = 2 * x * y + y0;
        x = xtemp;
        iter++;
      }

      const color = iter === maxIter ? 0 : 255 - iter * 5;
      const index = (px + py * width) * 4;
      imgData.data[index] = color;        // R
      imgData.data[index + 1] = color;    // G
      imgData.data[index + 2] = color;    // B
      imgData.data[index + 3] = 255;      // A
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

drawMandelbrot();
