import p5 from "p5";

new p5(sketch => {
  sketch.setup = () => {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight, sketch.WEBGL);
  };

  sketch.draw = () => {
    sketch.background(0);

    sketch.translate(0, 0, 0); // origin is at center of sketch
    sketch.normalMaterial();
    sketch.push();
    sketch.rotateZ(sketch.frameCount * 0.01);
    sketch.rotateX(sketch.frameCount * 0.01);
    sketch.rotateY(sketch.frameCount * 0.01);
    sketch.torus(
      Math.min(sketch.windowWidth, sketch.windowHeight) / 4,
      Math.min(sketch.windowWidth, sketch.windowHeight) / 12
    );
    sketch.pop();
  };

  sketch.windowResized = () => {
    sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
  };
});
