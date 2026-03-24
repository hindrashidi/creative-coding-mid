let t = 0;
let sizes = [];  

// 🔥 Floating text variables
let tx, ty;
let vx, vy;

function setup() {
  createCanvas(windowWidth, windowHeight);
  noFill();
  strokeWeight(3);

  // ring setup
  for (let i = 0; i < 6; i++) {
    sizes.push(i * 15);
  }

  // 🎯 Initialize floating text
  tx = random(width);
  ty = random(height);

  // random direction & speed
  vx = random(-5, 5);
  vy = random(-5, 5);
}

function draw() {
  background(10);

  let cx = width / 2;
  let cy = height / 2;

  let speed = map(mouseX, 0, width, 0.02, 0.09);

  // 🔵 Animated rings
  for (let i = 0; i < sizes.length; i++) {
    let breathe = sin(t - i * 0.35);
    let r = 100 + breathe * 40 + sizes[i];

    stroke(255, 210 - i * 25);
    circle(cx, cy, r * 2);
  }

  t += speed;

  // 🚀 Move floating text
  tx += vx;
  ty += vy;

  // 🔁 Bounce off edges
  if (tx < 0 || tx > width) vx *= -1;
  if (ty < 0 || ty > height) vy *= -1;

  // // ✨ Glow effect
  // drawingContext.shadowBlur = 20;
  // drawingContext.shadowColor = 'rgba(100,200,255,0.8)';

  // 📝 Draw text
  // noStroke();
  // fill(180, 220, 255);
  textAlign(CENTER, CENTER);
  textSize(28);
  textStyle(BOLD);

  text("You will reach your destination in 1 light year", tx, ty);

  // // ❗ Reset glow
  // drawingContext.shadowBlur = 0;
}