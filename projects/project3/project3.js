let step = 6;                 // controls pixel block size (bigger = chunkier, faster)
let colorModeState = 0;      // switches between color palettes

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);           // keeps pixel calculations consistent
  frameRate(30);             // lowers load since pixel work is heavy
}

function draw() {
  loadPixels();              // allows direct pixel editing

  let cx = mouseX;           // swirl center follows mouse
  let cy = mouseY;

  // loop through screen in blocks instead of every pixel
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {

      // distance from current point to mouse
      let dx = x - cx;
      let dy = y - cy;

      let d = sqrt(dx * dx + dy * dy);  // distance calculation
      let a = atan2(dy, dx);            // angle calculation

      let mouseInfluence = mouseX * 0.001; // small extra variation from mouse

      // main swirl formula (angle + distance + time + mouse)
      let swirl = a + d * 0.05 + frameCount * 0.03 + mouseInfluence;

      // convert swirl into color value using sine wave
      let v = 128 + 127 * sin(swirl);

      v += random(-12, 12);             // adds noise/texture
      v = constrain(v, 0, 255);         // keep valid color range

      let r, g, b;

      // brightness controlled by mouseY
      let light = map(mouseY, 0, height, 0.7, 1.4);

      // different color modes
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

      // make sure colors stay valid
      r = constrain(r, 0, 255);
      g = constrain(g, 0, 255);
      b = constrain(b, 0, 255);

      // fill each block of pixels
      for (let yy = 0; yy < step; yy++) {
        for (let xx = 0; xx < step; xx++) {
          let px = x + xx;
          let py = y + yy;

          if (px < width && py < height) {
            let i = (px + py * width) * 4; // pixel index

            pixels[i] = r;       // red
            pixels[i + 1] = g;   // green
            pixels[i + 2] = b;   // blue
            pixels[i + 3] = 255; // alpha (fully visible)
          }
        }
      }
    }
  }

  updatePixels(); // apply all pixel changes
}

function mousePressed() {
  colorModeState = (colorModeState + 1) % 3; // switch color palette
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // keep canvas responsive
}
