/**
 * emotion-driven sketch inspired by feelingswheel.com and OpenProcessing theme https://openprocessing.org/curation/89576
 * Source JSON by Geoffrey Roberts (borrowed without permission) https://feelingswheel.com/
 * Interaction system by libregd + Copilot
 */

let emotionRaw;
let emotionData = [];
let bubbles = [];

let cursorRadius = 10;         // current radius of mouse ball
let cursorTargetRadius = 10;   // target radius for smoothing
let cursorMomentum = 0;        // accumulative emotional effect

function preload() {
  loadJSON("emotions.json", (data) => {
    emotionRaw = data;         // load emotion dataset
  });
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  ellipseMode(RADIUS);
  emotionData = emotionRaw;

  // generate bubble objects from emotion words
  for (let i = 0; i < emotionData.length; i++) {
    let color = emotionData[i].color;
    let category = emotionData[i].category;
    let wordList = emotionData[i].words;

    for (let word of wordList) {
      let r = random(10, 20);  // initial radius
      bubbles.push({
        x: random(width),
        y: random(height),
        bx: random(width),     // actual position (for easing)
        by: random(height),
        r: r,
        baseR: r,              // permanent growth value
        col: color,
        offsetX: random(0.02, 0.05),
        offsetY: random(0.02, 0.05),
        word: word,
        category: category,
        pulseTime: null        // trigger for merge animation
      });
    }
  }
}

let pointerX, pointerY;

function draw() {
  pointerX = touches.length > 0 ? touches[0].x : mouseX;
  pointerY = touches.length > 0 ? touches[0].y : mouseY;

  background(204);

  // Title text in the center
  fill(255,50);
  textAlign(CENTER, CENTER);
  textSize(128);
  text("Must Be Moved", width / 2, height / 2);
  
  

  // bubble merging logic: same category, close distance
  for (let i = bubbles.length - 1; i >= 0; i--) {
    for (let j = i - 1; j >= 0; j--) {
      let b1 = bubbles[i];
      let b2 = bubbles[j];
      let d = dist(b1.bx, b1.by, b2.bx, b2.by);

      if (d < b1.r + b2.r && b1.category === b2.category) {
        let newR = b1.r + b2.r;
        bubbles.splice(i, 1);
        bubbles.splice(j, 1);
        bubbles.push({
          bx: (b1.bx + b2.bx) / 2,
          by: (b1.by + b2.by) / 2,
          r: newR,
          baseR: newR,
          col: b1.col,
          offsetX: random(0.02, 0.05),
          offsetY: random(0.02, 0.05),
          word: b1.category,
          category: b1.category,
          pulseTime: frameCount
        });
        break;
      }
    }
  }

  let easing = getDynamicEasing();
  cursorTargetRadius = 20;

  // update and draw bubbles
  for (let b of bubbles) {
    // negative emotion bubbles track cursor
    if (b.category !== "Happy" && b.category !== "Surprised") {
      b.bx += (pointerX - b.bx) * easing;
      b.by += (pointerY - b.by) * easing;
    }

    let jitterX = sin(frameCount * b.offsetX) * 1.5;
    let jitterY = cos(frameCount * b.offsetY) * 1.5;
    let xPos = b.bx + jitterX;
    let yPos = b.by + jitterY;

    // interaction logic
    let d = dist(pointerX, pointerY, xPos, yPos);
    if (d < b.r && b.r > 5) {
      if (b.category === "Happy" || b.category === "Surprised") {
        b.r -= 0.1;
        cursorMomentum += 0.3;
      } else {
        b.r += 0.1;
        b.baseR += 0.05;
        cursorMomentum -= 0.3;
      }
    }

    // slow restoration to original size
    if (b.r < b.baseR) {
      b.r += 0.05;
    }

    // pulse animation on merge
    let pulseScale = 1;
    if (b.pulseTime && frameCount - b.pulseTime < 30) {
      pulseScale = 1 + sin((frameCount - b.pulseTime) * 0.3) * 0.3;
    } else {
      b.pulseTime = null;
    }

    // draw bubble
    fill(b.col);
    noStroke();
    ellipse(xPos, yPos, b.r * pulseScale, b.r * pulseScale);

    // draw word or category label
    fill(50);
    textAlign(CENTER, BOTTOM);
    textSize(10);
    text(b.word, xPos, yPos - b.r - 5);
  }

  // apply momentum to cursor ball
  cursorMomentum = constrain(cursorMomentum, -10, 100);
  cursorTargetRadius = 10 + cursorMomentum;
  cursorRadius = lerp(cursorRadius, cursorTargetRadius, 0.2);

  drawCursorBall(cursorRadius);
}

function drawCursorBall(radius = 10) {
  fill(255, 200);     // semi-transparent white
  noStroke();
  ellipse(pointerX, pointerY, radius, radius);
}

function getDynamicEasing() {
  let t = millis();

  // progression timing (total: 13+ sec)
  if (t < 3000) {
    return 0.0001;
  } else if (t < 8000) {
    return 0.001;
  } else if (t < 13000) {
    return 0.01;
  } else {
    return 0.01;
  }
}
// support works on mobile

function touchStarted() {
  // Prevent mobile browser default behavior like scroll
  return false;
}

function touchMoved() {
  // Optional: could be used later for advanced gestures
  return false;
}
