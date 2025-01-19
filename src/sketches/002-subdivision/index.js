import P5 from 'p5';

const WIDTH = 800,
      HEIGHT = 800,
      MIN_DEPTH = 1,
      MAX_DEPTH = 20,
      PROBABILITY = 0.7;

let subdivisions = [];

const sketch = (p) => {
  let drawn = false;

  const createSubdivisions = () => {
    drawn = false;

    const initialSubdivision = {
      x: 0,
      y: 0,
      width: WIDTH,
      height: HEIGHT
    };

    subdivisions = [
      initialSubdivision
    ];

    const createSubdivision = (subDivision, depth) => {
      if (depth > MAX_DEPTH || (depth >= MIN_DEPTH && p.random() > PROBABILITY)) {
        return;
      }

      console.log('createSubdivision', subDivision, depth);

      depth++;

      const isHorizontal = p.random([ true, false ]);
      console.log('isHorizontal', isHorizontal);

      let min, max;

      if (isHorizontal) {
        min = subDivision.x;
        max = subDivision.x + subDivision.width
      } else {
        min = subDivision.y;
        max = subDivision.y + subDivision.height
      }

      const value = p.random(min, max);

      console.log('value', value);

      const leftSubdivision = {
        ...subDivision
      };

      if (isHorizontal) {
        leftSubdivision.width = value - subDivision.x;
      } else {
        leftSubdivision.height = value - subDivision.y;
      }

      console.log('left subdivision', leftSubdivision);

      subdivisions.push(leftSubdivision);

      createSubdivision(leftSubdivision, depth);

      const rightSubdivision = {
        ...subDivision
      };

      if (isHorizontal) {
        rightSubdivision.width = rightSubdivision.x + rightSubdivision.width - value;
        rightSubdivision.x = value;
      } else {
        rightSubdivision.height = rightSubdivision.y + rightSubdivision.height - value;
        rightSubdivision.y = value;
      }

      console.log('right subdivision', rightSubdivision);

      subdivisions.push(rightSubdivision);

      createSubdivision(rightSubdivision, depth);
    }

    createSubdivision(initialSubdivision, 0);
  };

  const drawSubdivision = ({ x, y, width, height }) => {
    const isBlackRect = p.random() > 0.9;

    p.noFill();
    p.stroke(0);
    p.strokeWeight(1);

    if (isBlackRect) p.fill(0);
    p.rect(x, y, width, height);
    
    if (isBlackRect) p.fill(255);
    p.ellipse(x + width / 2, y + height / 2, width, height);

    p.text(`${x}_${y}`, x, y);
  };

  p.setup = () => {
    p.createCanvas(WIDTH, HEIGHT);

    createSubdivisions();
  }

  p.draw = () => {
    if (!drawn) {
      p.background(255);

      for (const subdivision of subdivisions) {
        drawSubdivision(subdivision);
      }

      drawn = true;
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