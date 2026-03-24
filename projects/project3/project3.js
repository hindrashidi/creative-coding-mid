let step = 4; 
let colorModeState = 0; // 0 = purple, 1 = blue, 2 = black/grey

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
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

      let swirl = a + d * 0.05 + frameCount * 0.05 + mouseInfluence;

      // keep the blur / texture
      let v = 128 + 127 * sin(swirl);
      v += random(-30, 30);
      v = constrain(v, 0, 255);

      for (let yy = 0; yy < step; yy++) {
        for (let xx = 0; xx < step; xx++) {
          let px = x + xx;
          let py = y + yy;

          if (px < width && py < height) {
            let i = (px + py * width) * 4;

            let r, g, b;

            // mouseY controls lightness
            let light = map(mouseY, 0, height, 0.7, 1.4);

            if (colorModeState === 0) {
              // PURPLE: dark purple -> lighter purple
              r = map(v, 0, 255, 40, 150) * light;
              g = map(v, 0, 255, 10, 70) * light;
              b = map(v, 0, 255, 70, 200) * light;
            } 
            else if (colorModeState === 1) {
              // BLUE: dark blue -> lighter blue
              r = map(v, 0, 255, 10, 60) * light;
              g = map(v, 0, 255, 40, 140) * light;
              b = map(v, 0, 255, 90, 255) * light;
            } 
            else {
              // BLACK/GREY: black -> grey
              let grey = map(v, 0, 255, 15, 170) * light;
              r = grey;
              g = grey;
              b = grey;
            }

            pixels[i]     = constrain(r, 0, 255);
            pixels[i + 1] = constrain(g, 0, 255);
            pixels[i + 2] = constrain(b, 0, 255);
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