let step = 6;
let colorModeState = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
  frameRate(30);
}

function draw() {
  loadPixels();

  let cx = mouseX;
  let cy = mouseY;

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      let dx = x - cx;
      let dy = y - cy;

      let d = sqrt(dx * dx + dy * dy);
      let a = atan2(dy, dx);

      let mouseInfluence = mouseX * 0.001;
      let swirl = a + d * 0.05 + frameCount * 0.03 + mouseInfluence;

      let v = 128 + 127 * sin(swirl);
      v += random(-12, 12);
      v = constrain(v, 0, 255);

      let r, g, b;
      let light = map(mouseY, 0, height, 0.7, 1.4);

      if (colorModeState === 0) {
        r = map(v, 0, 255, 40, 150) * light;
        g = map(v, 0, 255, 10, 70) * light;
        b = map(v, 0, 255, 70, 200) * light;
      } else if (colorModeState === 1) {
        r = map(v, 0, 255, 10, 60) * light;
        g = map(v, 0, 255, 40, 140) * light;
        b = map(v, 0, 255, 90, 255) * light;
      } else {
        let grey = map(v, 0, 255, 15, 170) * light;
        r = grey;
        g = grey;
        b = grey;
      }

      r = constrain(r, 0, 255);
      g = constrain(g, 0, 255);
      b = constrain(b, 0, 255);

      for (let yy = 0; yy < step; yy++) {
        for (let xx = 0; xx < step; xx++) {
          let px = x + xx;
          let py = y + yy;

          if (px < width && py < height) {
            let i = (px + py * width) * 4;
            pixels[i] = r;
            pixels[i + 1] = g;
            pixels[i + 2] = b;
            pixels[i + 3] = 255;
          }
        }
      }
    }
  }

  updatePixels();
}

function mousePressed() {
  colorModeState = (colorModeState + 1) % 3;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
