import * as BABYLON from "@babylonjs/core";
import "@babylonjs/inspector";
import { NormalMaterial } from "@babylonjs/materials";

import GUI from "lil-gui";

function render(node) {
  const canvas = document.createElement("canvas");
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  node.appendChild(canvas);

  const engine = new BABYLON.Engine(canvas);

  const scene = new BABYLON.Scene(engine);

  scene.clearColor = new BABYLON.Color3(1.0, 1.0, 1.0);

  const camera = new BABYLON.ArcRotateCamera(
    "camera",
    Math.PI / 2,
    Math.PI / 2,
    5,
    BABYLON.Vector3.Zero(),
    scene
  );

  camera.setTarget(BABYLON.Vector3.Zero());
  camera.setPosition(new BABYLON.Vector3(0, 5, -10));

  camera.minZ = 0.1;
  camera.maxZ = 20;

  camera.attachControl(canvas, true);

  const light = new BABYLON.DirectionalLight(
    "light",
    new BABYLON.Vector3(-1, -1, -1),
    scene
  );
  light.position = new BABYLON.Vector3(0, 10, 0);
  light.intensity = 0.7;

  const light2 = new BABYLON.DirectionalLight(
    "light",
    new BABYLON.Vector3(1, -1, -1),
    scene
  );
  light2.position = new BABYLON.Vector3(0, 10, 0);
  light2.intensity = 0.7;

  const sphere = BABYLON.MeshBuilder.CreateSphere(
    "sphere",
    { diameter: 1, segments: 2 },
    scene
  );
  sphere.convertToFlatShadedMesh();

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
      radialSegments: 16,
      tubularSegments: 8,
      twist: 2,
      p: 2,
      q: 3,
      sideOrientation: BABYLON.Mesh.DOUBLESIDE,
    },
    scene
  );
  torus.convertToFlatShadedMesh();

  torus.position = new BABYLON.Vector3(0, 2, 0);

  const torusMaterial = new BABYLON.StandardMaterial("torusMaterial", scene);
  torusMaterial.diffuseColor = new BABYLON.Color3(0, 1, 0);
  torusMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  torus.material = torusMaterial;

  const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap(
    "gdhm",
    "sketches/006-dithering/heightMap.png",
    {
      width: 10,
      height: 10,
      subdivisions: 10,
      maxHeight: 1.5,
      onReady: (mesh) => mesh.convertToFlatShadedMesh(),
    }
  );

  const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
  groundMaterial.diffuseColor = new BABYLON.Color3(1.0, 1.0, 1.0);
  groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
  ground.material = groundMaterial;

  const shadowGenerator = new BABYLON.ShadowGenerator(1024, light);

  shadowGenerator.bias = 0.1;
  shadowGenerator.usePoissonSampling = true;

  shadowGenerator.getShadowMap().renderList.push(sphere);
  shadowGenerator.getShadowMap().renderList.push(box);
  shadowGenerator.getShadowMap().renderList.push(torus);
  shadowGenerator.getShadowMap().renderList.push(ground);

  sphere.receiveShadows = true;
  box.receiveShadows = true;
  torus.receiveShadows = true;
  ground.receiveShadows = true;

  const shadowGenerator2 = new BABYLON.ShadowGenerator(1024, light2);

  shadowGenerator2.bias = 0.1;
  shadowGenerator.usePoissonSampling = true;

  shadowGenerator2.getShadowMap().renderList.push(sphere);
  shadowGenerator2.getShadowMap().renderList.push(box);
  shadowGenerator2.getShadowMap().renderList.push(torus);
  shadowGenerator2.getShadowMap().renderList.push(ground);

  sphere.receiveShadows = true;
  box.receiveShadows = true;
  torus.receiveShadows = true;
  ground.receiveShadows = true;

  const depthTexture = scene.enableDepthRenderer().getDepthMap();

  const normalMapRenderTargetTexture = new BABYLON.RenderTargetTexture(
    "normalMapRenderTargetTexture",
    { width: engine.getRenderWidth(), height: engine.getRenderHeight() },
    scene
  );

  normalMapRenderTargetTexture.renderList = [sphere, box, torus, ground];
  normalMapRenderTargetTexture.activeCamera = camera;

  const normalMaterial = new NormalMaterial("normalMaterial", scene);
  normalMaterial.disableLighting = true;
  normalMapRenderTargetTexture.setMaterialForRendering(
    [sphere, box, torus, ground],
    normalMaterial
  );
  scene.customRenderTargets.push(normalMapRenderTargetTexture);

  BABYLON.Effect.ShadersStore["customFragmentShader"] = `
    varying vec2 vUV;

    uniform sampler2D textureSampler;
    uniform sampler2D depthSampler;
    uniform sampler2D normalSampler;
    uniform float cameraNear;
    uniform float cameraFar;

    void main(void)
    {
      float depth = texture2D(depthSampler, vUV).r;
      gl_FragColor = vec4(depth, depth, depth, 1.0);
      gl_FragColor = texture2D(normalSampler, vUV);
      // gl_FragColor = texture2D(textureSampler, vUV);
    }
    `;

  const postProcess = new BABYLON.PostProcess(
    "custom",
    "custom",
    null,
    ["depthSampler", "normalSampler", "cameraNear", "cameraFar"],
    1.0,
    camera
  );

  postProcess.onApply = function (effect) {
    effect.setFloat("cameraNear", camera.minZ);
    effect.setFloat("cameraFar", camera.maxZ);
    effect.setTexture("depthSampler", depthTexture);
    effect.setTexture("normalSampler", normalMapRenderTargetTexture);
  };

  scene.registerBeforeRender(() => {
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
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;
    sphere.rotation.z += 0.01;
    box.rotation.x += 0.01;
    box.rotation.y += 0.01;
    box.rotation.z += 0.01;

    const height = 0.5;
    const speed2 = 2;
    const angle2 = time * speed2;
    sphere.position.y = Math.sin(angle2) * height + 2;
    box.position.y = Math.cos(angle2) * height + 2;

    torus.position.y = Math.sin(angle2) * height + 3;
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.01;
    torus.rotation.z += 0.01;
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
