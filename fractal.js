// Grab canvas and context
const canvas = document.getElementById('fractalCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;

// Control elements
const zoomSlider = document.getElementById('zoom');
const iterSlider = document.getElementById('iterations');
const speedSlider = document.getElementById('speed');
const btnJulia = document.getElementById('btnJulia');
const btnMandelbrot = document.getElementById('btnMandelbrot');

// Variables for fractal parameters
let zoom = parseFloat(zoomSlider.value);
let maxIter = parseInt(iterSlider.value);
let rotationSpeed = parseFloat(speedSlider.value);

let setType = 'julia';  // 'julia' or 'mandelbrot'

// Rotation angle (used for Julia set c parameter)
let angle = 0;

// Listen for control changes and update parameters live
zoomSlider.oninput = () => {
  zoom = parseFloat(zoomSlider.value);
};
iterSlider.oninput = () => {
  maxIter = parseInt(iterSlider.value);
};
speedSlider.oninput = () => {
  rotationSpeed = parseFloat(speedSlider.value);
};

// Switch set type buttons and update UI
btnJulia.onclick = () => {
  setType = 'julia';
  btnJulia.classList.add('active');
  btnMandelbrot.classList.remove('active');
};
btnMandelbrot.onclick = () => {
  setType = 'mandelbrot';
  btnMandelbrot.classList.add('active');
  btnJulia.classList.remove('active');
};

/**
 * Draw the Julia set on canvas
 * @param {number} cRe Real part of constant c
 * @param {number} cIm Imaginary part of constant c
 */
function drawJulia(cRe, cIm) {
  const imgData = ctx.createImageData(width, height);

  // Loop every pixel
  for (let px = 0; px < width; px++) {
    for (let py = 0; py < height; py++) {
      // Map pixel to complex plane coordinates
      let x = 1.5 * (px - width / 2) / (0.5 * zoom * width);
      let y = (py - height / 2) / (0.5 * zoom * height);

      let i = 0;
      while (x * x + y * y < 4 && i < maxIter) {
        let xtemp = x * x - y * y + cRe;
        y = 2 * x * y + cIm;
        x = xtemp;
        i++;
      }

      // Color calculation based on iterations
      const color = i === maxIter ? 0 : 255 - i * 255 / maxIter;
      const idx = (px + py * width) * 4;

      imgData.data[idx] = color;            // Red
      imgData.data[idx + 1] = color * 0.6;  // Green
      imgData.data[idx + 2] = color * 0.3;  // Blue
      imgData.data[idx + 3] = 255;           // Alpha
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * Draw the Mandelbrot set on canvas
 */
function drawMandelbrot() {
  const imgData = ctx.createImageData(width, height);

  for (let px = 0; px < width; px++) {
    for (let py = 0; py < height; py++) {
      let x0 = 1.5 * (px - width / 2) / (0.5 * zoom * width);
      let y0 = (py - height / 2) / (0.5 * zoom * height);

      // Rotate coordinates by angle
      let xr = x0 * Math.cos(angle) - y0 * Math.sin(angle);
      let yr = x0 * Math.sin(angle) + y0 * Math.cos(angle);

      let x = 0;
      let y = 0;
      let i = 0;

      while (x*x + y*y < 4 && i < maxIter) {
        let xtemp = x*x - y*y + xr;
        y = 2 * x * y + yr;
        x = xtemp;
        i++;
      }

      const color = i === maxIter ? 0 : 255 - i * 255 / maxIter;
      const idx = (px + py * width) * 4;

      imgData.data[idx] = color;
      imgData.data[idx + 1] = color * 0.6;
      imgData.data[idx + 2] = color * 0.3;
      imgData.data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
}


/**
 * Main animation loop
 */
function animate() {
  // For Julia set, update c to rotate around the circle in complex plane
  if (setType === 'julia') {
    const cRe = Math.cos(angle);
    const cIm = Math.sin(angle);

    drawJulia(cRe, cIm);
  } else {
    // For Mandelbrot, just draw static fractal with current zoom/iterations
    drawMandelbrot();
  }

  // Increase angle based on rotation speed for animation
  angle += rotationSpeed;

  // Wrap angle to keep it in range 0-2π for numerical stability
  if (angle > 2 * Math.PI) {
    angle -= 2 * Math.PI;
  }

  // Request next animation frame for smooth rendering
  requestAnimationFrame(animate);
}

// Start animation loop
animate();
