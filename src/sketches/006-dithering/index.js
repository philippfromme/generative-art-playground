import * as BABYLON from "@babylonjs/core";
import "@babylonjs/inspector";

import GUI from "lil-gui";

function render(node) {
  const canvas = document.createElement("canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  node.appendChild(canvas);

  const engine = new BABYLON.Engine(canvas);

  const scene = new BABYLON.Scene(engine);

  scene.clearColor = new BABYLON.Color3(0.2, 0.2, 0.2);

  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    Math.PI / 2,
    Math.PI / 2,
    5,
    BABYLON.Vector3.Zero(),
    scene
  );

  camera.setTarget(BABYLON.Vector3.Zero());

  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  light.intensity = 0.7;

  const sphere = BABYLON.MeshBuilder.CreateSphere(
    "sphere",
    { diameter: 1, segments: 32 },
    scene
  );

  sphere.position = new BABYLON.Vector3(2, 2, 2);

  const box = BABYLON.MeshBuilder.CreateBox("box", { size: 0.75 }, scene);

  box.position = new BABYLON.Vector3(-2, 2, -2);

  const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap(
    "gdhm",
    "sketches/006-dithering/heightMap.png",
    {
      width: 10,
      height: 10,
      subdivisions: 10,
      maxHeight: 1,
      onReady: (mesh) => mesh.convertToFlatShadedMesh(),
    }
  );

  scene.registerBeforeRender(() => {
    // make the sphere and box go around the scene in a circle
    const time = performance.now() * 0.001;

    const radius = 2;
    const speed = 1;
    const angle = time * speed;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    sphere.position.x = x;
    sphere.position.z = z;
    box.position.x = -x;
    box.position.z = -z;

    // make the sphere and box go up and down
    const height = 0.5;
    const speed2 = 2;
    const angle2 = time * speed2;
    sphere.position.y = Math.sin(angle2) * height + 2;
    box.position.y = Math.cos(angle2) * height + 2;
  });

  engine.runRenderLoop(function () {
    scene.render();
  });

  return () => {
    engine.stopRenderLoop();
    scene.dispose();
    engine.dispose();
    node.removeChild(canvas);
  };
}

export default render;
