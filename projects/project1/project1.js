let angle = 0;              // controls orbit rotation over time
let starsLayer;             // separate graphics layer for background stars

let planets = [];           // stores all planet objects
let selectedPlanet = null;  // keeps track of the planet being dragged

let rocks = [];             // stores asteroid objects

let ambientSound;
let hasPlayedThisDrag = false; // makes sure sound plays only once per drag

function preload() {
  ambientSound = loadSound("ambient.mp3"); // load sound before sketch starts
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES); // use degrees instead of radians for sin/cos

  starsLayer = createGraphics(windowWidth, windowHeight);
  makeStars(); // generate background stars once

  // each planet is stored as an object
  planets.push({
    orbit: 120,       // distance from center
    size: 40,
    color: "red",
    direction: 1,     // orbit direction
    offsetX: 0,       // dragging offset
    offsetY: 0,
    dragging: false,
    x: 0,             // current x position on screen
    y: 0              // current y position on screen
  });

  planets.push({
    orbit: 200,
    size: 60,
    color: "blue",
    direction: -1,    // opposite direction
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
  image(starsLayer, 0, 0); // draw star background

  let cx = width / 2;      // center x
  let cy = height / 2;     // center y

  // draw the sun
  fill("yellow");
  noStroke();
  ellipse(cx, cy, 90, 90);

  // orbit + draw each planet
  for (let p of planets) {
    let planetAngle = angle * p.direction;

    // circular motion using cos and sin
    let baseX = cx + cos(planetAngle) * p.orbit;
    let baseY = cy + sin(planetAngle) * p.orbit;

    // if not dragging, smoothly return to orbit
    if (!p.dragging) {
      p.offsetX = lerp(p.offsetX, 0, 0.08);
      p.offsetY = lerp(p.offsetY, 0, 0.08);
    }

    // final planet position = orbit position + drag offset
    let px = baseX + p.offsetX;
    let py = baseY + p.offsetY;

    // draw line from sun to planet
    stroke(180);
    line(cx, cy, px, py);

    // draw planet
    noStroke();
    fill(p.color);
    ellipse(px, py, p.size, p.size);

    // save current position for click detection
    p.x = px;
    p.y = py;
  }

  // update and draw asteroids
  for (let i = rocks.length - 1; i >= 0; i--) {
    rocks[i].update();
    rocks[i].show();

    if (rocks[i].offScreen()) {
      rocks.splice(i, 1); // remove rock when it leaves screen
    }
  }

  angle += 0.2; // keeps planets orbiting
}

function mousePressed() {
  let clickedPlanet = false;

  // check whether mouse clicked on any planet
  for (let i = planets.length - 1; i >= 0; i--) {
    let p = planets[i];
    let d = dist(mouseX, mouseY, p.x, p.y); // distance from mouse to planet center

    if (d < p.size / 2) { // if inside planet radius
      selectedPlanet = p;
      p.dragging = true;
      clickedPlanet = true;

      hasPlayedThisDrag = false; // reset sound for new drag
      break;
    }
  }

  // if click was not on a planet, create asteroid
  if (!clickedPlanet) {
    rocks.push(new Rock(mouseX, mouseY));
  }
}

function mouseDragged() {
  if (selectedPlanet) {
    // move selected planet with mouse
    selectedPlanet.offsetX += mouseX - pmouseX;
    selectedPlanet.offsetY += mouseY - pmouseY;

    // play sound once per drag
    if (!hasPlayedThisDrag && ambientSound) {
      ambientSound.setVolume(0.1);
      ambientSound.play();
      hasPlayedThisDrag = true;
    }
  }
}

function mouseReleased() {
  if (selectedPlanet) {
    selectedPlanet.dragging = false; // stop dragging
    selectedPlanet = null;
  }

  hasPlayedThisDrag = false; // reset for next drag
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  starsLayer = createGraphics(windowWidth, windowHeight);
  makeStars(); // redraw stars when screen size changes
}

function makeStars() {
  starsLayer.background(0);
  starsLayer.noStroke();
  starsLayer.fill(255);

  // create random stars
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
    this.velocity = createVector(random(-1, 1), random(2, 5)); // starting motion
    this.acceleration = createVector(0, 0);
    this.size = random(20, 40);
  }

  applyForce(force) {
    this.acceleration.add(force); // adds force like gravity
  }

  update() {
    let gravity = createVector(0, 0.08);
    this.applyForce(gravity);

    // simple physics: acceleration -> velocity -> position
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0); // reset acceleration each frame
  }

  show() {
    // draw asteroid body
    fill(150);
    noStroke();
    ellipse(this.position.x, this.position.y, this.size, this.size);

    // small craters/details
    fill(120);
    ellipse(this.position.x - 5, this.position.y - 5, this.size * 0.25, this.size * 0.25);
    ellipse(this.position.x + 6, this.position.y + 4, this.size * 0.18, this.size * 0.18);
  }

  offScreen() {
    return this.position.y > height + this.size; // delete when below screen
  }
}
