// Global variables
let r = 40; // Radius of each circle
let d = r * 2; // Diameter of each circle
let cr = r - 5; // Center of each circle
let cols, rows; // Amount of cols/rows
let angle = 0; // Starting angle
let lineArray = []; // Saves all previous points to be able to create a path

// Is run once by P5js
function setup(){
  // Create canvas with max possible size
  createCanvas(maxWindow(), maxWindow());
  // Calculate amount of cols/rows based on canvas size
  cols = floor(width / d);
  rows = floor(height / d);
  // Create a 2D array containing all points for all circles
  for (let i = 0; i < cols; i++) {
    lineArray[i] = [];
    for (let j = 0; j < rows; j++) {
      lineArray[i][j] = [];
    }
  }
  // Setup size/font for text
  textSize(cr);
  textAlign(CENTER, CENTER);
  textFont('Arial');
}

// Is run continuously by P5js
function draw(){
  // Draw a nice background
  background("#3d3d3d");

  // Loop over cols & rows
  for(let i = 0; i < cols; i++){
    for(let j = 0; j < rows; j++){
      // Set correct colorMode & colors
      colorMode(RGB, 255);
      noFill();
      stroke(255);
      strokeWeight(1);
      // Calculate center of each circle
      let cx = i * d + r;
      let cy = j * d + r;

      // If it's circle 0 aka top left, do nothing as it's suppose to not be drawn
      if (i == 0 && j == 0) {
        continue; // aka do nothing, lol.
      }
      // Otherwise if it's either the first column or the first row aka the main circles
      else if (i == 0 || j == 0) {
        noStroke();
        fill(255);
        // Draw which circle it is
        text(i == 0 ? j : i, cx, cy);

        noFill();
        stroke(255);
        // Draw a circle at its position
        circle(cx, cy, cr);
        strokeWeight(4);
        // Calculate where its guide point should be drawn
        let angleCoef = i == 0 ? j : i;
        let px = cx + cr * cos(angle * (angleCoef + 1));
        let py = cy + cr * sin(angle * (angleCoef + 1));
        // Draw guide point
        point(px, py);

        stroke(255, 20);
        strokeWeight(1);
        // Draw either a vertical or horizontal line
        if(i == 0)
          line(px, py, width, py);
        else
          line(px, py, px, height);
      }
      // Otherwise it has to be a "hidden" circle aka designated space for drawing the combined path
      else {
        // Calculate origin of the pixel by utilizing its i & j index
        let px = cx + cr * cos(angle * (i + 1));
        let py = cy + cr * sin(angle * (j + 1));
        stroke(255, 0, 0);
        strokeWeight(4);
        // Draw the point
        point(px, py);

        strokeWeight(1);
        colorMode(HSB, 255);
        stroke(255 / i, 255 - (50 / j), 255);
        // Push the point to the path history
        lineArray[i][j].push({x: px, y: py});
        // Begin creating the path
        beginShape();
        // Loop over path history and add each point as a vertex
        for(let v of lineArray[i][j]){
           vertex(v.x, v.y);
        }
        // Draw path
        endShape();
      }
    }
  }
  // After about 400 frames it's reasonable to clear the history to avoid lag
  if(frameCount % 400 == 0){
    // Simply loop over the 2D array and emty it
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        lineArray[i][j] = [];
      }
    }
    // Reset angle
    angle = 0;
  }
  // Otherwise, keep increasing the angle to continue drawing the path
  angle += PI / 200;
}

// Calculates max size of canvas
function maxWindow(){
    return windowWidth < windowHeight ? windowWidth - 50 : windowHeight - 50;
}
