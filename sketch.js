let font;
let textPoints = [];
let ripples = [];
let isInteractive = true;
let clickSound;

function preload() {
  font = loadFont('https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxP.ttf');
  clickSound = loadSound('click.mp3');
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  pixelDensity(1);

  generateTextPoints();
}

function draw() {
  background(12, 12, 26);

  if (isInteractive) {
    if (frameCount % 2 === 0) {
      ripples.push(new Ripple(mouseX, mouseY, random(10, 30)));
    }

    for (let i = ripples.length - 1; i >= 0; i--) {
      ripples[i].update();
      ripples[i].show();
      if (ripples[i].isDead()) {
        ripples.splice(i, 1);
      }
    }
  }

  drawDistortedText();
}

function generateTextPoints() {
  let textStr = "Explore\nthe Solar\nSystem";

  // keep the SAME sizing style as your original code
  let fontSize = width * 0.9 / 12;
  fontSize = max(fontSize, height * 0.15);

  textFont(font);
  textSize(fontSize);
  textAlign(CENTER, CENTER);

  let startY = height * 0.15;
  let bbox = font.textBounds(textStr, width / 2, startY, fontSize);

  let points = font.textToPoints(
    textStr,
    width / 2,
    startY + bbox.h / 6,
    fontSize,
    {
      sampleFactor: 0.4,
      simplifyThreshold: 0
    }
  );

  textPoints = points.map(p => ({
    x: p.x,
    y: p.y,
    originalX: p.x,
    originalY: p.y,
    targetX: p.x,
    targetY: p.y,
    phase: random(TWO_PI),
    size: random(3, 8)
  }));
}

function drawDistortedText() {
  noStroke();
  fill(255, 240, 200, 240);
  textAlign(CENTER, CENTER);

  for (let point of textPoints) {
    if (isInteractive) {
      // slowly return toward original position
      point.targetX = lerp(point.targetX, point.originalX, 0.04);
      point.targetY = lerp(point.targetY, point.originalY, 0.04);

      // softer ripple effect
      for (let ripple of ripples) {
        let d = dist(point.x, point.y, ripple.x, ripple.y);
        let distortion = (ripple.strength / max(d, 10)) * 0.4;

        point.targetX += cos(point.phase) * distortion;
        point.targetY += sin(point.phase) * distortion;
      }

      // slower mouse separation
      let mouseD = dist(point.x, point.y, mouseX, mouseY);
      let mouseForce = (80 - mouseD) * 0.03;

      if (mouseD < 150) {
        point.targetX += cos(point.phase) * mouseForce * 0.3;
        point.targetY += sin(point.phase) * mouseForce * 0.3;
        point.phase += 0.05;
      }

      // smoother movement
      point.x = lerp(point.x, point.targetX, 0.03);
      point.y = lerp(point.y, point.targetY, 0.03);
    }

    ellipse(point.x, point.y, point.size);
  }
}

function mousePressed() {
  if (!isInteractive) {
    userStartAudio();
    if (clickSound) clickSound.play();
    window.location.href = "projects/project1/index.html";
    return;
  }

  isInteractive = false;
  userStartAudio();

  for (let point of textPoints) {
    point.targetX = point.originalX;
    point.targetY = point.originalY;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  generateTextPoints();
}

class Ripple {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.maxSize = 150;
    this.strength = random(20, 50);
  }

  update() {
    this.size += 4;
    this.strength *= 0.95;
  }

  show() {
    noFill();
    stroke(100, 200, 255, 100);
    strokeWeight(2);
    ellipse(this.x, this.y, this.size);
  }

  isDead() {
    return this.size > this.maxSize;
  }
}
