let angle = 0;
let starsLayer;

let planets = [];
let selectedPlanet = null;

let rocks = [];

// --- NEW: ambient sound variables ---
let ambientSound;
let isPlaying = false; // flag for playing
// --------------------------------------

// { --------------------------------------
function preload() {
  // Load your ambient track (adjust path and file name)
  ambientSound = loadSound("ambient.mp3");
}
// --------------------------------------  }

function setup() {
  createCanvas(windowWidth, windowHeight);
  // canvas.parent('canvas-container');
  angleMode(DEGREES);

  starsLayer = createGraphics(windowWidth, windowHeight);
  makeStars();

  planets.push({
    orbit: 120,
    size: 40,
    color: "red",
    direction: 1,
    offsetX: 0,
    offsetY: 0,
    dragging: false,
    x: 0,
    y: 0
  });

  planets.push({
    orbit: 200,
    size: 60,
    color: "blue",
    direction: -1,
    offsetX: 0,
    offsetY: 0,
    dragging: false,
    x: 0,
    y: 0
  });

  planets.push({
    orbit: 280,
    size: 60,
    color: "orange",
    direction: 1,
    offsetX: 0,
    offsetY: 0,
    dragging: false,
    x: 0,
    y: 0
  });
}

function draw() {
  image(starsLayer, 0, 0);

  let cx = width / 2;
  let cy = height / 2;

  fill("yellow");
  noStroke();
  ellipse(cx, cy, 90, 90);

  for (let p of planets) {
    let planetAngle = angle * p.direction;

    let baseX = cx + cos(planetAngle) * p.orbit;
    let baseY = cy + sin(planetAngle) * p.orbit;

    if (!p.dragging) {
      p.offsetX = lerp(p.offsetX, 0, 0.08);
      p.offsetY = lerp(p.offsetY, 0, 0.08);
    }

    let px = baseX + p.offsetX;
    let py = baseY + p.offsetY;

    stroke(180);
    line(cx, cy, px, py);

    noStroke();
    fill(p.color);
    ellipse(px, py, p.size, p.size);

    p.x = px;
    p.y = py;
  }

  for (let i = rocks.length - 1; i >= 0; i--) {
    rocks[i].update();
    rocks[i].show();

    if (rocks[i].offScreen()) {
      rocks.splice(i, 1);
    }
  }

  angle += 0.2;
}

function mousePressed() {
  let clickedPlanet = false;

  for (let i = planets.length - 1; i >= 0; i--) {
    let p = planets[i];
    let d = dist(mouseX, mouseY, p.x, p.y);

    if (d < p.size / 2) {
      selectedPlanet = p;
      p.dragging = true;
      clickedPlanet = true;
      break;
    }
  }

  if (!clickedPlanet) {
    rocks.push(new Rock(mouseX, mouseY));
  }
}

function mouseDragged() {
  if (selectedPlanet) {
    selectedPlanet.offsetX += mouseX - pmouseX;
    selectedPlanet.offsetY += mouseY - pmouseY;

    // Start --------------------------------------
    if (!isPlaying && ambientSound) {
      ambientSound.loop();     // loop the track
      ambientSound.setVolume(0.1); // keep it ambient
      isPlaying = true;
    }
    // --------------------------------------  End
  }
}

function mouseReleased() {
  if (selectedPlanet) {
    selectedPlanet.dragging = false;
    selectedPlanet = null;

  // Start --------------------------------------
   if (isPlaying && ambientSound) {
      ambientSound.setVolume(0, 1.0); // fade out over 1 second
      isPlaying = false;
    }
    // --------------------------------------  End

  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  starsLayer = createGraphics(windowWidth, windowHeight);
  makeStars();
}

function makeStars() {
  starsLayer.background(0);
  starsLayer.noStroke();
  starsLayer.fill(255);

  for (let i = 0; i < 200; i++) {
    let x = random(width);
    let y = random(height);
    let s = random(1, 4);
    starsLayer.circle(x, y, s);
  }
}

class Rock {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-1, 1), random(2, 5));
    this.acceleration = createVector(0, 0);
    this.size = random(20, 40);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    let gravity = createVector(0, 0.08);
    this.applyForce(gravity);

    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  show() {
    fill(150);
    noStroke();
    ellipse(this.position.x, this.position.y, this.size, this.size);

    fill(120);
    ellipse(this.position.x - 5, this.position.y - 5, this.size * 0.25, this.size * 0.25);
    ellipse(this.position.x + 6, this.position.y + 4, this.size * 0.18, this.size * 0.18);
  }

  offScreen() {
    return this.position.y > height + this.size;
  }
}
