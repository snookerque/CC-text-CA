let font;
let textTyped = "Enter text...";
let fontsize = 40;
let textColor = 0;
let textEffect = 0;
let colorInput;

function setup() {
  createCanvas(windowWidth, windowHeight);
  opentype.load("data/FreeSans.otf", function(err, f) {
    if (err) {
      console.log(err);
    } else {
      font = f;
    }
  });
  colorInput = createColorPicker("#000000");
  colorInput.position(1100, 200);

  sizeSlider = createSlider(20, 100, 40, 5);
  sizeSlider.position(1130, 280);
  sizeSlider.style("width", "120px");

  button = createButton("Clear Text");
  button.position(1050, 500);
  button.mousePressed(clearText);
  button.style("width", "120px");
  button.style("height", "30px");

  radio = createRadio();
  radio.option('none',1);
  radio.option('distort', 2);
  radio.position(1140,365);
}

function draw() {
  if (!font) return;
  background(255);
  //create border around text input area
  noFill();
  stroke(0);
  strokeWeight(4);
  rect(120, 80, 720, 520);
  //create border around settings area
  rect(900, 80, 400, 520);

  //set fill color to color picker input
  textColor = colorInput.color();
  fontsize = sizeSlider.value();

  textEffect = radio.value();

  if (textEffect == 0 || textEffect ==1) {
    fill(textColor);
    noStroke();
    textSize(fontsize);
    text(textTyped,150,100,800,500);
  }

  else if(textEffect == 2){
    fill(textColor);
    stroke(textColor);
    let fontPath = font.getPath(textTyped, 150, 140, fontsize);
    var path = new g.Path(fontPath.commands);
    path = g.resampleByLength(path, 11);

    var addToAngle = map(mouseX, 0, width, -PI, PI);
    var curveHeight = map(mouseY, 0, height, 0.1, 2);

    for (var i = 0; i < path.commands.length - 1; i++) {
      var pnt0 = path.commands[i];
      var pnt1 = path.commands[i + 1];
      var d = dist(pnt0.x, pnt0.y, pnt1.x, pnt1.y);

      if (d > 20) continue;

      var stepper = map(i % 2, 0, 1, -1, 1);
      var angle = atan2(pnt1.y - pnt0.y, pnt1.x - pnt0.x);
      angle = angle + addToAngle;

      var cx = pnt0.x + cos(angle * stepper) * d * 4 * curveHeight;
      var cy = pnt0.y + sin(angle * stepper) * d * 3 * curveHeight;

      bezier(pnt0.x, pnt0.y, cx, cy, cx, cy, pnt1.x, pnt1.y);
    }
  }

  fill(0);
  noStroke();
  textSize(30);
  text("Settings", 1045, 140);

  textSize(25);
  text("Color:", 1000, 220);
  text("Text Size:", 1000, 300);
  text("Text Effect:", 1000, 380);
}

function clearText() {
  textTyped = "";
}

function keyPressed() {
  if (keyCode == DELETE || keyCode == BACKSPACE) {
    if (textTyped.length > 0) {
      textTyped = textTyped.substring(0, textTyped.length - 1);
    }
  }

  if (keyCode === ENTER || keyCode === RETURN) {
    textTyped += "\n";
  }
}

function keyTyped() {
  if (keyCode >= 32) {
    textTyped += key;
  }
}
