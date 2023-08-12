import P5 from 'p5';

const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(400, 400);
  }

  p.draw = () => {
    p.background(255);

    p.fill(0);

    p.ellipse(200, 200, 100);
  }
}

new P5(sketch);