import P5 from "p5";

import GUI from 'lil-gui';

let gui;

const sketch = (p) => {
  const config = {
    rotationSpeed: 1,
    radius: 1,
    tubeRadius: 1
  };
  
  gui = new GUI();
  
  gui.add(config, 'rotationSpeed', 1, 10, 1);
  gui.add(config, 'radius', 0.1, 2, 0.1);
  gui.add(config, 'tubeRadius', 0.1, 2, 0.1);

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
  };

  p.draw = () => {
    p.background(0);

    p.translate(0, 0, 0); // origin is at center of p
    p.normalMaterial();
    p.push();

    const rotationSpeed = p.map(config.rotationSpeed, 1, 10, 0.005, 0.1);

    p.rotateZ(p.frameCount * rotationSpeed);
    p.rotateX(p.frameCount * rotationSpeed);
    p.rotateY(p.frameCount * rotationSpeed);

    p.torus(
      Math.min(p.windowWidth, p.windowHeight) / 4 * config.radius,
      Math.min(p.windowWidth, p.windowHeight) / 12 * config.tubeRadius
    );
    p.pop();
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};

function render(node) {
  const instance = new P5(sketch, node);

  return () => {
    instance.remove();

    gui.destroy();
  };
}

export default render;
