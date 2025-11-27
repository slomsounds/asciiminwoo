let img;
let portrait;

function preload() {
  img = loadImage("minu.jpg"); // Load portrait image
}

function setup() {
  // Create canvas to fit the picture... 
  createCanvas(windowWidth * 3/4, windowHeight);
  textFont("monospace");

  // ASCII renderer with grid size 10
  portrait = new AsciiPortrait(img, 10);
}

function draw() {
  background(230, 230, 230, 50);

  portrait.update();
  portrait.display();
}


class AsciiPortrait {
  constructor(img, step) {
    this.img = img;                  // source image
    this.step = step;                // grid spacing
    this.chars = ["ㅁ", "ㅣ", "ㄴ", "ㅇ", "ㅜ", ".", " ", " ", " "];
    this.t = 0;                      // time for noise motion
  }

  update() {
    this.img.loadPixels();           // update image pixels
    this.t += 0.05;                  // noise motion horizontal flow
  }

  display() {
    textAlign(CENTER, CENTER);
    textSize(15);

    // Global contrast / visibility oscillation (0 → 1 → 0)
    let contrast = (sin(frameCount * 0.025) + 1) / 2;

    for (let y = 0; y < height; y += this.step) {
      for (let x = 0; x < width; x += this.step) {

        // Map screen coordinates to image pixel coordinates
        let cx = floor(map(x, 0, width,  0, this.img.width  - 1));
        let cy = floor(map(y, 0, height, 0, this.img.height - 1));

        // Get pixel color from each pixel [r,g,b,a] and calculate brightness
        let idx = (cx + cy * this.img.width) * 4; // pixel index in array
        let r = this.img.pixels[idx]-15;
        let g = this.img.pixels[idx + 1]-15;
        let b = this.img.pixels[idx + 2]-15;

        //get absolute brightness value and normalize it
        let bright = (r + g + b) / 1.5;
        let norm = bright / 255.0;   // 0 ~ 1
        
        // perlin noise for wobble effect
        let n = noise(x * 0.03 + this.t, y * 0.03);
        let wobble = (n - 0.5) * 0.25;

        // apply contrast envelope + wobble
        let v = constrain(norm * contrast + wobble, 0, 1);

        // Brightness to ASCII index
        let characterIndex = floor(v * (this.chars.length - 1));
        let ch = this.chars[characterIndex];


        fill(r, g, b);
        text(ch, x, y);
      }
    }
  }
}