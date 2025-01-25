import P5 from 'p5';

const WIDTH = 800,
      HEIGHT = 800,
      ROWS = 7,
      COLUMNS = 7;

const WIDTH_STEP = WIDTH / COLUMNS,
      HEIGHT_STEP = HEIGHT / ROWS;

const PADDING = 1;

let points = [];

const sketch = (p) => {
  let drawn = false;

  const createPoints = () => {
    drawn = false;

    points = [];

    for (let i = 0; i < ROWS; i++) {
      for (let j = 0; j < COLUMNS; j++) {
        points.push({
          x: j,
          y: i
        });
      }
    }

    // shuffle
    points.sort(() => p.random(-1, 1));

    console.log(points);
  }

  const drawPoints = () => {
    p.noStroke();
    p.fill(0);

    for (let count = 0; count < points.length; count++) {

      const j = count % ROWS;
      const i = Math.floor(count / ROWS);

      // gradient fill using rgb
      p.fill(p.map(i * j, 0, ROWS * COLUMNS, 0, 255), p.map(i * j, 0, ROWS * COLUMNS, 0, 255), 255);
      // p.fill(p.map(i * j, 0, ROWS * COLUMNS, 0, 255));

      // p.rect(j * WIDTH_STEP, i * HEIGHT_STEP, WIDTH_STEP, HEIGHT_STEP);

      p.fill(0);

      // debug
      points.forEach(({ x, y }) => {

        // draw ellipse for each point
        p.ellipse(
          j * WIDTH_STEP + x * (WIDTH_STEP / COLUMNS) + WIDTH_STEP / COLUMNS / 2,
          i * HEIGHT_STEP + y * (HEIGHT_STEP / ROWS) + HEIGHT_STEP / ROWS / 2,
          2
        );
      });

      const pointsToDraw = points.slice(0, count + 1);

      // p.text(`${i}, ${j}`, j * WIDTH_STEP + 2, i * WIDTH_STEP + 10 + 2);

      p.fill(255, 0, 255);

      // p.rect(j * WIDTH_STEP, i * HEIGHT_STEP, 4, 4);

      p.fill(0);

      pointsToDraw.forEach(({ x, y }, index) => {
        const rectX = j * WIDTH_STEP + x * (WIDTH_STEP / COLUMNS),
              rectY = i * HEIGHT_STEP + y * (HEIGHT_STEP / ROWS);

        p.fill(0);

        p.rect(
          rectX - PADDING,
          rectY - PADDING,
          WIDTH_STEP / COLUMNS + PADDING * 2,
          HEIGHT_STEP / ROWS + PADDING * 2,
          // p.map(count, 0, points.length, 0, WIDTH_STEP / COLUMNS)
          0
        );

        p.fill(255, 0, 255);

        // p.text(`${index}`, rectX + 1, rectY + 11);
      });
    }
  };

  p.setup = () => {
    p.createCanvas(WIDTH, HEIGHT);

    createPoints();
  }

  p.draw = () => {
    if (!drawn) {
      // p.background(200);
      p.background(255);

      drawPoints();

      drawn = true;
    }
  }

  p.keyPressed = () => {

    // SPACE
    if (p.keyCode === 32) {
      createPoints();
    }
  }
}

function render(node) {
  const instance = new P5(sketch, node);

  return () => {
    instance.remove();
  };
}

export default render;