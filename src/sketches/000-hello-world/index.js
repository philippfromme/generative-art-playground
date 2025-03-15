import P5 from "p5";

import GUI from "lil-gui";

let gui;

let shader;

let model, textureColor, textureNormal;

import frag from "./shaders/frag.glsl";

const sketch = (p) => {
  const config = {
    rotationSpeed: 1,
    radius: 1,
    tubeRadius: 1,
    detailX: 6,
    detailY: 6,
    pixelsize: 6,
  };

  gui = new GUI();

  gui.add(config, "rotationSpeed", 1, 10, 1);
  gui.add(config, "radius", 0.1, 2, 0.1);
  gui.add(config, "tubeRadius", 0.1, 2, 0.1);
  gui.add(config, "detailX", 3, 64, 1);
  gui.add(config, "detailY", 3, 64, 1);
  gui.add(config, "pixelsize", 1, 16, 1);

  p.preload = () => {
    model = p.loadModel("sketches/000-hello-world/Z2/Z2.obj");

    textureColor = p.loadImage("sketches/000-hello-world/Z2/z2_Color_s.jpg");
    textureNormal = p.loadImage("sketches/000-hello-world/Z2/z2_normal_s.jpg");
  };

  p.setup = () => {
    p.setAttributes("antialias", false);

    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);

    shader = p.createFilterShader(frag);
  };

  p.draw = () => {
    p.orbitControl();

    p.background(0);

    p.translate(0, 0, 0); // origin is at center of p

    // p.normalMaterial();
    // p.specularMaterial(255);
    p.ambientMaterial(255);
    p.shininess(50);
    p.noStroke();

    const t = p.millis() / 1000;

    p.directionalLight(255, 0, 0, p.cos(t / 2), p.sin(t), -1);
    p.directionalLight(0, 0, 255, p.sin(t / 2), p.cos(t), -1);
    // p.directionalLight(255, 255, 255, p.sin(t / 2), p.cos(t), -1);

    // add ambient light
    // p.ambientLight(10, 10, 10);

    p.ambientMaterial(255, 255, 255);
    p.sphere(1000);

    p.push();

    const rotationSpeed = p.map(config.rotationSpeed, 1, 10, 0.005, 0.1);

    p.rotateZ(p.frameCount * rotationSpeed);
    p.rotateX(p.frameCount * rotationSpeed);
    p.rotateY(p.frameCount * rotationSpeed);

    p.beginGeometry(p.TRIANGLES);

    p.torus(
      (Math.min(p.windowWidth, p.windowHeight) / 4) * config.radius,
      (Math.min(p.windowWidth, p.windowHeight) / 12) * config.tubeRadius,
      config.detailX,
      config.detailY
    );

    let torus = p.endGeometry();

    // flat shading
    torus.computeNormals(p.FLAT);
    // torus.computeNormals(p.SMOOTH);

    p.model(torus);

    p.rotateZ(p.frameCount * rotationSpeed);
    p.rotateX(p.frameCount * rotationSpeed);
    p.rotateY(p.frameCount * rotationSpeed);

    p.beginGeometry(p.TRIANGLES);

    p.torus(
      (Math.min(p.windowWidth, p.windowHeight) / 4) * config.radius * 2,
      (Math.min(p.windowWidth, p.windowHeight) / 12) * config.tubeRadius,
      config.detailX,
      config.detailY
    );

    torus = p.endGeometry();

    // flat shading
    torus.computeNormals(p.FLAT);
    // torus.computeNormals(p.SMOOTH);

    // p.model(torus);

    // rotate further
    p.rotateZ(p.frameCount * rotationSpeed);
    p.rotateX(p.frameCount * rotationSpeed);
    p.rotateY(p.frameCount * rotationSpeed);

    p.scale(250);

    // move model down
    p.translate(0, -1, 0);

    // make model flat shaded
    model.computeNormals(p.FLAT);
    p.texture(textureColor);
    // p.model(model);

    p.pop();

    shader.setUniform("width", p.width);
    shader.setUniform("height", p.height);
    shader.setUniform("pixelsize", config.pixelsize);

    p.filter(shader);
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
