import * as BABYLON from "@babylonjs/core";
import "@babylonjs/inspector";
import { NormalMaterial } from "@babylonjs/materials";

import GUI from "lil-gui";

import kuwaharaFrag from "./shaders/kuwahara-frag.glsl";

function render(node) {
  const canvas = document.createElement("canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  node.appendChild(canvas);

  const engine = new BABYLON.Engine(canvas);

  const scene = new BABYLON.Scene(engine);

  scene.clearColor = new BABYLON.Color3(1.0, 1.0, 1.0);

  // const camera = new BABYLON.ArcRotateCamera(
  //   "camera",
  //   Math.PI / 2,
  //   Math.PI / 2,
  //   5,
  //   BABYLON.Vector3.Zero(),
  //   scene
  // );

  // camera.setTarget(BABYLON.Vector3.Zero());
  // camera.setPosition(new BABYLON.Vector3(0, 5, -10));

  // camera.minZ = 0.1;
  // camera.maxZ = 100;

  // camera.lowerBetaLimit = 0.1;
  // camera.upperBetaLimit = Math.PI / 2 - 0.2;

  // camera.attachControl(canvas, true);

  // camera.wheelPrecision = 50;

  const camera = createFPSCamera(canvas, scene);
  camera.position = new BABYLON.Vector3(0, 10, 10);
  camera.target = new BABYLON.Vector3(0, 0, 0);
  camera.minZ = 0.1;
  camera.maxZ = 100;

  const light = new BABYLON.DirectionalLight(
    "light",
    new BABYLON.Vector3(-1, -1, -1),
    scene
  );
  light.position = new BABYLON.Vector3(0, 10, 0);
  light.intensity = 0.5;

  // const light2 = new BABYLON.DirectionalLight(
  //   "light",
  //   new BABYLON.Vector3(1, -1, -1),
  //   scene
  // );
  // light2.position = new BABYLON.Vector3(0, 10, 0);
  // light2.intensity = 0.5;

  const hemisphericLight = new BABYLON.HemisphericLight(
    "hemisphericLight",
    new BABYLON.Vector3(0, 1, 0),
    scene
  );

  hemisphericLight.intensity = 0.1;

  const sphere = BABYLON.MeshBuilder.CreateSphere(
    "sphere",
    { diameter: 1, segments: 16 },
    scene
  );
  // sphere.convertToFlatShadedMesh();

  sphere.position = new BABYLON.Vector3(2, 2, 2);

  const sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", scene);
  sphereMaterial.diffuseColor = new BABYLON.Color3(0, 0, 1);
  sphereMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  sphere.material = sphereMaterial;

  const box = BABYLON.MeshBuilder.CreateBox("box", { size: 0.75 }, scene);
  box.convertToFlatShadedMesh();

  box.position = new BABYLON.Vector3(-2, 2, -2);

  const boxMaterial = new BABYLON.StandardMaterial("boxMaterial", scene);
  boxMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
  boxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  box.material = boxMaterial;

  const torus = BABYLON.MeshBuilder.CreateTorusKnot(
    "torusKnot",
    {
      radius: 0.5,
      tube: 0.2,
      radialSegments: 64,
      tubularSegments: 32,
      twist: 2,
      p: 2,
      q: 3,
      sideOrientation: BABYLON.Mesh.DOUBLESIDE,
    },
    scene
  );
  // torus.convertToFlatShadedMesh();

  torus.position = new BABYLON.Vector3(0, 2, 0);

  const torusMaterial = new BABYLON.StandardMaterial("torusMaterial", scene);
  torusMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
  torusMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  torus.material = torusMaterial;

  const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap(
    "gdhm",
    "sketches/008-kuwahara/crater.ppm",
    {
      width: 10,
      height: 10,
      subdivisions: 32,
      maxHeight: 1,
      onReady: (mesh) => mesh.convertToFlatShadedMesh(),
    }
  );

  const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
  groundMaterial.diffuseColor = new BABYLON.Color3(1.0, 1.0, 1.0);
  groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  ground.material = groundMaterial;

  const groundPlane = BABYLON.MeshBuilder.CreateGround(
    "ground",
    { width: 1000, height: 1000 },
    scene
  );
  groundPlane.material = groundMaterial;

  const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);

  shadowGenerator.bias = 0.01;
  shadowGenerator.usePoissonSampling = true;

  shadowGenerator.getShadowMap().renderList.push(sphere);
  shadowGenerator.getShadowMap().renderList.push(box);
  shadowGenerator.getShadowMap().renderList.push(torus);
  shadowGenerator.getShadowMap().renderList.push(ground);

  sphere.receiveShadows = true;
  box.receiveShadows = true;
  torus.receiveShadows = true;
  ground.receiveShadows = true;

  // const shadowGenerator2 = new BABYLON.ShadowGenerator(1024, light2);

  // shadowGenerator2.bias = 0.1;
  // shadowGenerator.usePoissonSampling = true;

  // shadowGenerator2.getShadowMap().renderList.push(sphere);
  // shadowGenerator2.getShadowMap().renderList.push(box);
  // shadowGenerator2.getShadowMap().renderList.push(torus);
  // shadowGenerator2.getShadowMap().renderList.push(ground);

  // sphere.receiveShadows = true;
  // box.receiveShadows = true;
  // torus.receiveShadows = true;
  // ground.receiveShadows = true;

  const depthTexture = scene.enableDepthRenderer().getDepthMap();

  BABYLON.Effect.ShadersStore["customFragmentShader"] = kuwaharaFrag;

  const postProcess = new BABYLON.PostProcess(
    "custom",
    "custom",
    null,
    ["resolution", "kernelSize", "radius", "depthSampler"],
    1.0,
    camera
  );

  postProcess.onApply = function (effect) {
    effect.setVector2(
      "resolution",
      new BABYLON.Vector2(engine.getRenderWidth(), engine.getRenderHeight())
    );
    effect.setInt("kernelSize", 6);
    effect.setInt("radius", 10);
    effect.setTexture("depthSampler", depthTexture);
  };

  let apollo;

  BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "sketches/008-kuwahara/apollo.glb",
    "",
    scene
  ).then((result) => {
    console.log(result);

    result.meshes.forEach((mesh) => {
      if (mesh.id === "__root__") {
        apollo = mesh;

        mesh.scaling.scaleInPlace(0.75);
      }

      // mesh.convertToFlatShadedMesh();

      mesh.receiveShadows = true;

      shadowGenerator.getShadowMap().renderList.push(mesh);
      // shadowGenerator2.getShadowMap().renderList.push(mesh);
    });
  });

  BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "sketches/008-kuwahara/antenna.glb",
    "",
    scene
  ).then((result) => {
    console.log(result);

    result.meshes.forEach((mesh) => {
      if (mesh.id === "__root__") {
        mesh.scaling.scaleInPlace(0.75);

        mesh.position.x = 50;
      }

      // mesh.convertToFlatShadedMesh();

      mesh.receiveShadows = true;

      shadowGenerator.getShadowMap().renderList.push(mesh);
      // shadowGenerator2.getShadowMap().renderList.push(mesh);
    });
  });

  BABYLON.SceneLoader.ImportMeshAsync(
    "",
    "sketches/008-kuwahara/suit.glb",
    "",
    scene
  ).then((result) => {
    console.log(result);

    result.meshes.forEach((mesh) => {
      if (mesh.id === "__root__") {
        mesh.scaling.scaleInPlace(1);

        mesh.position.x = 10;
      }

      // mesh.convertToFlatShadedMesh();

      mesh.receiveShadows = true;

      shadowGenerator.getShadowMap().renderList.push(mesh);
      // shadowGenerator2.getShadowMap().renderList.push(mesh);
    });
  });

  scene.registerBeforeRender(() => {
    const time = performance.now() * 0.001;

    const radius = 4;
    const speed = 1;
    const angle = time * speed;

    sphere.position.x = radius * Math.cos(angle);
    sphere.position.z = radius * Math.sin(angle);

    box.position.x = radius * Math.cos(angle + (2 * Math.PI) / 3);
    box.position.z = radius * Math.sin(angle + (2 * Math.PI) / 3);

    torus.position.x = radius * Math.cos(angle + (4 * Math.PI) / 3);
    torus.position.z = radius * Math.sin(angle + (4 * Math.PI) / 3);

    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;
    sphere.rotation.z += 0.01;
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;
    box.rotation.z += 0.01;
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.01;
    torus.rotation.z += 0.01;

    const height = 0.5;
    const speed2 = 2;

    const angle2 = time * speed2;
    sphere.position.y = Math.sin(angle2) * height + 2;
    box.position.y = Math.cos(angle + (2 * Math.PI) / 3) * height + 2;
    torus.position.y = Math.sin(angle + (4 * Math.PI) / 3) * height + 2;

    light.direction.x = Math.cos(angle) * 2;
    light.direction.z = Math.sin(angle) * 2;

    // light2.direction.x = Math.cos(angle + (2 * Math.PI) / 3) * 2;
    // light2.direction.z = Math.sin(angle + (2 * Math.PI) / 3) * 2;

    if (apollo) {
      apollo.position.y = Math.sin(angle) * 0.2 + 1;
    }
  });

  engine.runRenderLoop(function () {
    scene.render();
  });

  window.addEventListener("resize", () => {
    engine.resize();
  });

  window.addEventListener("keydown", (ev) => {
    if (ev.key === "I" || ev.key === "i") {
      if (scene.debugLayer.isVisible()) {
        scene.debugLayer.hide();
      } else {
        scene.debugLayer.show();
      }
    }
  });

  return () => {
    engine.stopRenderLoop();
    scene.dispose();
    engine.dispose();
    node.removeChild(canvas);
  };
}

export default render;

export function createFPSCamera(canvas, scene) {
  const camera = new BABYLON.UniversalCamera(
    "FPSCamera",
    new BABYLON.Vector3(0, 10, 0),
    scene
  );

  camera.attachControl(canvas, true);

  // make slower
  camera.speed = 0.2;
  camera.inertia = 0.95;
  camera.angularSensibility = 10000;

  camera.keysUp.push(87);
  camera.keysDown.push(83);
  camera.keysRight.push(68);
  camera.keysLeft.push(65);
  camera.keysUpward.push(32);

  canvas.addEventListener("click", async () => {
    await canvas.requestPointerLock();
  });

  return camera;
}
