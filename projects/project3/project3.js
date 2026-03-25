let t = 0;              // controls animation over time
let sizes = [];         // spacing between rings  

let tx, ty;             // leftover variables (not used now)
let vx, vy;

let hoverSound;         // sound for hover effect

function preload() {
  soundFormats('mp3');
  hoverSound = loadSound('wobble.mp3'); // load sound file
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();             // rings have no fill
  strokeWeight(3);      // thickness of rings

  // create different ring sizes
  for (let i = 0; i < 6; i++) {
    sizes.push(i * 15); // spacing between each ring
  }

  // leftover from earlier version (not used)
  tx = random(width);
  ty = random(height);

  vx = random(-5, 5);
  vy = random(-5, 5);

  textAlign(CENTER, CENTER);
  textSize(28);
  textStyle(BOLD);
}

function draw() {
  background(10); // clears screen each frame

  let cx = width / 2;   // center x
  let cy = height / 2;  // center y

  // detect if mouse is near the center
  let d = dist(mouseX, mouseY, cx, cy);
  let hoverRadius = 120;
  let hoveringCircle = d < hoverRadius; // true if inside circle

  // base speed depends on mouse x position
  let baseSpeed = map(mouseX, 0, width, 0.02, 0.09);

  let speed;
  if (hoveringCircle) {
    speed = baseSpeed * 2.5; // faster when hovering
  } else {
    speed = baseSpeed;
  }

  // draw rings
  noFill();
  strokeWeight(3);

  for (let i = 0; i < sizes.length; i++) {
    let breathe = sin(t - i * 0.35); // wave motion
    let r = 100 + breathe * 40 + sizes[i]; // radius changes over time

    // change color when hovering
    if (hoveringCircle) {
      stroke(200, 220, 255); // glow effect
    } else {
      stroke(255, 210 - i * 25); // normal color
    }

    circle(cx, cy, r * 2); // draw ring (diameter = r * 2)
  }

  t += speed; // updates animation

  // play sound only when hovering
  if (hoveringCircle) {
    if (hoverSound && !hoverSound.isPlaying()) {
      hoverSound.loop(); // start sound once
    }
  } else {
    if (hoverSound && hoverSound.isPlaying()) {
      hoverSound.stop(); // stop when leaving
    }
  }

function mousePressed() {
  userStartAudio(); // required to enable sound in browser
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // responsive canvas
}
}
