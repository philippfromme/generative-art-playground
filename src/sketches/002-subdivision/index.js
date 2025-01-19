import P5 from 'p5';

const WIDTH = 400,
      HEIGHT = 800,
      N_SUBDIVISIONS = 10;

let subdivisions = [];

const sketch = (p) => {
  const createSubdivisions = (n = N_SUBDIVISIONS) => {
    subdivisions = [
      {
        x: 0,
        y: 0,
        width: WIDTH,
        height: HEIGHT
      }
    ]
  };

  const drawSubdivision = (x, y, width, height) => {
    p.noFill();
    p.stroke(0);
    p.strokeWeight(1);

    p.rect(x, y, width, height);
    p.ellipse(x, y, width, height);
  };

  p.setup = () => {
    p.createCanvas(400, 800);

    createSubdivisions();
  }

  p.draw = () => {
    p.background(255);

    for (const subdivision of subdivisions) {
      drawSubdivision(subdivision);
    }
  }

  p.keyPressed = () => {

    // SPACE
    if (p.keyCode === 32) {
      createSubdivisions();
    }
  }
}

new P5(sketch);