import P5 from 'p5';

import GUI from 'lil-gui'; 

const config = {
  rows: 7,
  columns: 7,
  padding: 1
};

const gui = new GUI();

gui.add(config, 'rows', 1, 10, 1);
gui.add(config, 'columns', 1, 10, 1);
gui.add(config, 'padding', 0, 10, 1);

const WIDTH = 800,
      HEIGHT = 800;

let points = [];

const sketch = (p) => {
  let drawn = false;

  const createPoints = () => {
    drawn = false;

    points = [];

    for (let i = 0; i < config.rows; i++) {
      for (let j = 0; j < config.columns; j++) {
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
    const WIDTH_STEP = WIDTH / config.columns,
          HEIGHT_STEP = HEIGHT / config.rows;

    console.log('width step', WIDTH_STEP);
    console.log('height step', HEIGHT_STEP);

    p.noStroke();
    p.fill(0);

    for (let count = 0; count < points.length; count++) {
      const j = count % config.rows;
      const i = Math.floor(count / config.rows);

      // gradient fill using rgb
      p.fill(p.map(i * j, 0, config.rows * config.columns, 0, 255), p.map(i * j, 0, config.rows * config.columns, 0, 255), 255);
      // p.fill(p.map(i * j, 0, config.rows * config.columns, 0, 255));

      // p.rect(i * WIDTH_STEP, j * HEIGHT_STEP, WIDTH_STEP, HEIGHT_STEP);

      p.fill(0);

      // debug
      points.forEach(({ x, y }) => {

        // draw ellipse for each point
        p.ellipse(
          i * WIDTH_STEP + x * (WIDTH_STEP / config.columns) + WIDTH_STEP / config.columns / 2,
          j * HEIGHT_STEP + y * (HEIGHT_STEP / config.rows) + HEIGHT_STEP / config.rows / 2,
          2
        );
      });

      const pointsToDraw = points.slice(0, count + 1);

      // p.text(`${i}, ${j}`, j * WIDTH_STEP + 2, i * WIDTH_STEP + 10 + 2);

      p.fill(255, 0, 255);

      // p.rect(j * WIDTH_STEP, i * HEIGHT_STEP, 4, 4);

      p.fill(0);

      pointsToDraw.forEach(({ x, y }, index) => {
        const rectX = i * WIDTH_STEP + x * (WIDTH_STEP / config.columns),
              rectY = j * HEIGHT_STEP + y * (HEIGHT_STEP / config.rows);

        p.fill(0);

        p.rect(
          rectX - config.padding,
          rectY - config.padding,
          WIDTH_STEP / config.columns + config.padding * 2,
          HEIGHT_STEP / config.rows + config.padding * 2,
          // p.map(count, 0, points.length, 0, WIDTH_STEP / config.columns)
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

    gui.onFinishChange(event => {
      // event.object     // object that was modified
      // event.property   // string, name of property
      // event.value      // new value of controller
      // event.controller // controller that was modified

      createPoints();
    });
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