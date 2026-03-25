let t = 0;
let sizes = [];  

let tx, ty;
let vx, vy;

let hoverSound;

function preload() {
  soundFormats('mp3');
  hoverSound = loadSound('wobble.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  strokeWeight(3);

  for (let i = 0; i < 6; i++) {
    sizes.push(i * 15);
  }

  tx = random(width);
  ty = random(height);

  vx = random(-5, 5);
  vy = random(-5, 5);

  textAlign(CENTER, CENTER);
  textSize(28);
  textStyle(BOLD);
}

function draw() {
  background(10);

  let cx = width / 2;
  let cy = height / 2;

  // detect hover 
  let d = dist(mouseX, mouseY, cx, cy);
  let hoverRadius = 120;
  let hoveringCircle = d < hoverRadius;

  //SPEED 
  let baseSpeed = map(mouseX, 0, width, 0.02, 0.09);

  let speed;
  if (hoveringCircle) {
    speed = baseSpeed * 2.5; //  faster when hovering
  } else {
    speed = baseSpeed;
  }

  // draw rings
  noFill();
  strokeWeight(3);

  for (let i = 0; i < sizes.length; i++) {
    let breathe = sin(t - i * 0.35);
    let r = 100 + breathe * 40 + sizes[i];

    //glow effect when hovered
    if (hoveringCircle) {
      stroke(200, 220, 255);
    } else {
      stroke(255, 210 - i * 25);
    }

    circle(cx, cy, r * 2);
  }

  t += speed;

  //  SOUND 
  if (hoveringCircle) {
    if (hoverSound && !hoverSound.isPlaying()) {
      hoverSound.loop();
    }
  } else {
    if (hoverSound && hoverSound.isPlaying()) {
      hoverSound.stop();
    }
  }

function mousePressed() {
  userStartAudio();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
}
