let font;
let textPoints = [];   // stores all text particles
let ripples = [];      // stores ripple objects
let isInteractive = true;  // controls intro state
let clickSound;

function preload() {
  font = loadFont('https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxP.ttf');
  clickSound = loadSound('click.mp3');
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container'); // puts canvas inside HTML container
  pixelDensity(1);

  generateTextPoints(); // turn text into particle points
}

function draw() {
  background(12, 12, 26); // clears screen each frame

  if (isInteractive) {
    // create ripple effect near mouse
    if (frameCount % 2 === 0) {
      ripples.push(new Ripple(mouseX, mouseY, random(10, 30)));
    }

    // update old ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      ripples[i].update();
      ripples[i].show();
      if (ripples[i].isDead()) {
        ripples.splice(i, 1); // remove ripple when too large
      }
    }
  }

  drawDistortedText(); // animate text particles
}

function generateTextPoints() {
  let textStr = "Interactive\nSystem";

  // responsive text size
  let fontSize = width * 0.9 / 12;
  fontSize = max(fontSize, height * 0.15);

  textFont(font);
  textSize(fontSize);
  textAlign(CENTER, CENTER);

  let startY = height * 0.15;
  let bbox = font.textBounds(textStr, width / 2, startY, fontSize);

  // convert text into many points
  let points = font.textToPoints(
    textStr,
    width / 2,
    startY + bbox.h / 6,
    fontSize,
    {
      sampleFactor: 0.4,      // amount of points, simplifies the shape
      simplifyThreshold: 0
    }
  );

  // each point becomes a particle object
  textPoints = points.map(p => ({
    x: p.x,
    y: p.y,
    originalX: p.x,   // original text shape
    originalY: p.y,
    targetX: p.x,     // where point wants to move
    targetY: p.y,
    phase: random(TWO_PI), // random direction for motion
    size: random(3, 8)
  }));
}

function drawDistortedText() {
  noStroke();
  fill(255, 240, 200, 240);

  for (let point of textPoints) {
    if (isInteractive) {
      // slowly pull points back to original text shape
      point.targetX = lerp(point.targetX, point.originalX, 0.04);
      point.targetY = lerp(point.targetY, point.originalY, 0.04);

      // ripple effect changes nearby particles
      for (let ripple of ripples) {
        let d = dist(point.x, point.y, ripple.x, ripple.y); // distance from ripple
        let distortion = (ripple.strength / max(d, 10)) * 0.4;

        point.targetX += cos(point.phase) * distortion;
        point.targetY += sin(point.phase) * distortion;
      }

      // mouse also pushes particles slightly apart
      let mouseD = dist(point.x, point.y, mouseX, mouseY);
      let mouseForce = (80 - mouseD) * 0.03;

      if (mouseD < 150) {
        point.targetX += cos(point.phase) * mouseForce * 0.3;
        point.targetY += sin(point.phase) * mouseForce * 0.3;
        point.phase += 0.05; // adds slight variation over time
      }

      // smooth movement toward target position
      point.x = lerp(point.x, point.targetX, 0.03);
      point.y = lerp(point.y, point.targetY, 0.03);
    }

    ellipse(point.x, point.y, point.size); // draw each particle
  }
}

function mousePressed() {
  if (!isInteractive) {
    // second click: play sound and go to project 1
    userStartAudio();
    if (clickSound) clickSound.play();
    window.location.href = "projects/project1/index.html";
    return;
  }

  // first click: stop interaction and let text settle
  isInteractive = false;
  userStartAudio();

  for (let point of textPoints) {
    point.targetX = point.originalX;
    point.targetY = point.originalY;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateTextPoints(); // remake particles for new screen size
}

class Ripple {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.maxSize = 150;      // when ripple is too big, remove it
    this.strength = random(20, 50);
  }

  update() {
    this.size += 4;          // ripple expands
    this.strength *= 0.95;   // ripple weakens over time
  }

  show() {
    noFill();
    stroke(100, 200, 255, 100);
    strokeWeight(2);
    ellipse(this.x, this.y, this.size);
  }

  isDead() {
    return this.size > this.maxSize; // used to delete old ripples
  }
}
