import P5 from "p5";

const sketch = (p) => {
  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
  };

  p.draw = () => {
    p.background(0);

    p.translate(0, 0, 0); // origin is at center of p
    p.normalMaterial();
    p.push();
    p.rotateZ(p.frameCount * 0.01);
    p.rotateX(p.frameCount * 0.01);
    p.rotateY(p.frameCount * 0.01);
    p.torus(
      Math.min(p.windowWidth, p.windowHeight) / 4,
      Math.min(p.windowWidth, p.windowHeight) / 12
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
  };
}

export default render;
