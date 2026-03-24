let font;
let textPoints = [];
let ripples = [];
let isInteractive = true; // true = ripples, false = clickable
let clickSound;

let floatingX, floatingY;
let t = 0; // time variable for motion

function preload() {
  font = loadFont('https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxP.ttf');
  clickSound = loadSound('click.mp3'); // optional click sound
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('canvas-container');
  pixelDensity(1);
  
  // Generate text points
  generateTextPoints();

  floatingX = width / 2;
floatingY = height / 2;
}

function draw() {
  background(12, 12, 26, 20); // trail effect
  
  if (isInteractive) {
    // Add ripples near mouse
    if (frameCount % 2 === 0) {
      ripples.push(new Ripple(mouseX, mouseY, random(10, 30)));
    }
    
    // Update ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
      ripples[i].update();
      ripples[i].show();
      if (ripples[i].isDead()) {
        ripples.splice(i, 1);
      }
    }
  }
  
  // Draw distorted text
  drawDistortedText();

  drawFloatingText();
}

function generateTextPoints() {
  let textStr = "Welcome\nto the\nAI world";
  
  // FIXED: Much larger font (90% of screen width)
  let fontSize = width * 0.9 / 12; // ~90% screen width for "Welcome"
  fontSize = max(fontSize, height * 0.15); // minimum height scaling
  
  textFont(font);
  textSize(fontSize);
  textAlign(CENTER, CENTER);
  
  // FIXED: Position text to span full screen vertically
  let startY = height * 0.15; // start 15% from top
  let lineHeight = fontSize * 1.2;
  
  let bbox = font.textBounds(textStr, width/2, startY, fontSize);
  let points = font.textToPoints(textStr, width/2, startY + bbox.h/6, fontSize, {
    sampleFactor: 0.4,      // More points for larger text
    simplifyThreshold: 0
  });
  
  textPoints = points.map(p => ({
    x: p.x,
    y: p.y,
    originalX: p.x,
    originalY: p.y,
    targetX: p.x,
    targetY: p.y,
    phase: random(TWO_PI),
    size: random(3, 8)       // Slightly larger particles
  }));
}

function drawDistortedText() {
  noStroke();
  fill(255, 240, 200, 240);  // Brighter glow
  textAlign(CENTER, CENTER);
  
  for (let point of textPoints) {
    if (isInteractive) {
      // Ripple distortion
      let distortion = 0;
      for (let ripple of ripples) {
        let d = dist(point.x, point.y, ripple.x, ripple.y);
        distortion += ripple.strength / max(d, 10);
      }
      
      // Mouse proximity effect (stronger for larger text)
      let mouseD = dist(point.x, point.y, mouseX, mouseY);
      let mouseForce = (80 - mouseD) * 0.03;  // Stronger pull
      if (mouseD < 150) {                     // Larger influence area
        point.targetX += cos(point.phase) * mouseForce;
        point.targetY += sin(point.phase) * mouseForce;
        point.phase += 0.4;
      }
      
      // Animate back to position
      point.x = lerp(point.x, point.targetX, 0.08);
      point.y = lerp(point.y, point.targetY, 0.08);
    }
    
    ellipse(point.x, point.y, point.size);
  }
}

// Rest of your code stays the same...
function mousePressed() {
  if (!isInteractive) {
    userStartAudio();
    if (clickSound) clickSound.play();
    window.location.href = "projects/project1/project1.html";
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

function drawFloatingText() {
  t += 0.08;   // fast evolving time (controls speed)

  // ⚡ Complex chaotic motion (inspired by your pixel math)
  let targetX = width/2 
    + cos((t * 3) + sin(t * 0.7)) * (width * 0.4)
    + sin((t * 1.5) + cos(t * 2.1)) * (width * 0.2);

  let targetY = height/2 
    + sin((t * 2.8) + cos(t * 0.9)) * (height * 0.4)
    + cos((t * 1.2) + sin(t * 1.7)) * (height * 0.25);

  // 🚀 Fast smooth movement
  floatingX = lerp(floatingX, targetX, 0.2);
  floatingY = lerp(floatingY, targetY, 0.2);

  // 🌈 Dynamic alpha (like your wave-based pixel intensity)
  let alpha = 150 + 100 * sin(t * 4 + cos(t * 2));

  // ✨ Glow effect
  drawingContext.shadowBlur = 30;
  drawingContext.shadowColor = 'rgba(100,200,255,0.9)';

  // 🎨 Text styling
  fill(180, 220, 255, alpha);
  textAlign(CENTER, CENTER);
  textSize(32);
  textStyle(BOLD);

  // 🌀 Slight rotation (adds more "alive" feeling)
  push();
  translate(floatingX, floatingY);
  rotate(sin(t * 2) * 0.3);
  text("Can you teleport into the world through a secret clicking door?", 0, 0);
  pop();

  // ❗ Reset glow
  drawingContext.shadowBlur = 0;
}
