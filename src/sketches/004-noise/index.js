import { createNoise2D } from "simplex-noise";

import alea from "alea";

import GUI from "lil-gui";

function render(node) {
  const DEFAULT_NOISE_CONFIG = {
    canvasWidth: 256,
    canvasHeight: 256,
    seed: 0, // Random seed for reproducible noise
    scale: 1, // Zoom level of noise (1 = full pattern)
    octaves: 5, // Number of noise layers combined
    persistence: 0.5, // Amplitude decrease per octave
    lacunarity: 2, // Frequency increase per octave
    offsetX: 0, // Horizontal shift of noise pattern
    offsetY: 0, // Vertical shift of noise pattern
    exponent: 1, // Controls contrast of the noise
    fudgeFactor: 1, // Adjusts overall noise intensity
  };

  const canvas = document.createElement("canvas");

  canvas.width = DEFAULT_NOISE_CONFIG.canvasWidth;
  canvas.height = DEFAULT_NOISE_CONFIG.canvasHeight;

  function createNoise2DData(width, height, config = DEFAULT_NOISE_CONFIG) {
    config = { ...DEFAULT_NOISE_CONFIG, ...config };

    const randomFunction = alea(config.seed);

    const noiseFunction = createNoise2D(randomFunction);

    const data = new Float32Array(width * height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const index = y * width + x;
        let value = 0;

        // Normalize coordinates to 0-1 range
        const nx = x / width; // [0-1]
        const ny = y / height; // [0-1]

        for (let i = 0; i < config.octaves; i++) {
          const frequency = Math.pow(config.lacunarity, i);
          const amplitude = Math.pow(config.persistence, i);

          value +=
            noiseFunction(
              (nx * (1 / config.scale) + config.offsetX) * frequency,
              (ny * (1 / config.scale) + config.offsetY) * frequency
            ) * amplitude;
        }

        value = Math.pow(Math.abs(value) * config.fudgeFactor, config.exponent);

        data[index] = value;
      }
    }

    console.log(data, data.length);

    return data;
  }

  function renderNoise2DDataToCanvas(canvas, config = DEFAULT_NOISE_CONFIG) {
    config = { ...DEFAULT_NOISE_CONFIG, ...config };

    canvas.width = config.canvasWidth;
    canvas.height = config.canvasHeight;

    const ctx = canvas.getContext("2d");

    const noise = createNoise2DData(canvas.width, canvas.height, config);

    const imageData = ctx.createImageData(canvas.width, canvas.height);

    for (let i = 0; i < noise.length; i++) {
      const value = noise[i];

      imageData.data[i * 4] = value * 255;
      imageData.data[i * 4 + 1] = value * 255;
      imageData.data[i * 4 + 2] = value * 255;
      imageData.data[i * 4 + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
  }

  const config = {
    canvasWidth: 256,
    canvasHeight: 256,
    seed: 0,
    scale: 1, // scale the frequency of the noise
    octaves: 6, // octaves is the number of layers of noise
    persistence: 0.5, // persistence is the amount the amplitude changes between octaves
    lacunarity: 3, // lacunarity is the frequency multiplier between octaves
    offsetX: 0, // the offset of the noise
    offsetY: 0, // the offset of the noise
    exponent: 1,
    fudgeFactor: 1.2,
  };

  const gui = new GUI();

  gui.add(config, "canvasWidth", [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024]);
  gui.add(config, "canvasHeight", [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024]);
  gui.add(config, "scale", 0.1, 10).step(0.1);
  gui.add(config, "octaves", 1, 20).step(1);
  gui.add(config, "persistence", 0.1, 2).step(0.1);
  gui.add(config, "lacunarity", 0, 10).step(1);
  gui.add(config, "offsetX", 0, 100).step(1);
  gui.add(config, "offsetY", 0, 100).step(1);
  gui.add(config, "exponent", 0.1, 10).step(0.1);
  gui.add(config, "fudgeFactor", 0.1, 2).step(0.1);

  gui.onChange((event) => {
    canvas.width = config.canvasWidth;
    canvas.height = canvas.width;

    renderNoise2DDataToCanvas(canvas, config);

    pre.textContent = JSON.stringify(config, null, 2);
  });

  renderNoise2DDataToCanvas(canvas, config);

  const childNode = document.createElement("div");

  childNode.style.width = "100%";
  childNode.style.height = "100%";
  childNode.style.position = "relative";
  childNode.style.overflow = "hidden";
  childNode.style.display = "flex";
  childNode.style.justifyContent = "center";
  childNode.style.alignItems = "center";

  node.appendChild(childNode);

  childNode.appendChild(canvas);

  canvas.style.width = "512px";
  canvas.style.height = "512px";
  canvas.style.imageRendering = "pixelated";

  const pre = document.createElement("pre");

  childNode.appendChild(pre);

  pre.textContent = JSON.stringify(config, null, 2);

  pre.style.position = "relative";
  pre.style.width = "512px";
  pre.style.height = "512px";
  pre.style.fontSize = "32px";
  pre.style.display = "flex";
  pre.style.justifyContent = "center";
  pre.style.alignItems = "center";
  pre.style.backgroundColor = "black";
  pre.style.color = "white";
  pre.style.cursor = "pointer";
  pre.style.userSelect = "none";

  pre.addEventListener("click", () => {
    const type = "text/plain";

    const clipboardItemData = {
      [type]: JSON.stringify(config, null, 2),
    };

    const clipboardItem = new ClipboardItem(clipboardItemData);

    navigator.clipboard.write([clipboardItem]);

    pre.style.backgroundColor = "white";
    pre.style.color = "black";

    setTimeout(() => {
      pre.style.backgroundColor = "black";
      pre.style.color = "white";
    }, 100);
  });

  return () => {
    gui.destroy();

    childNode.removeChild(canvas);
    childNode.removeChild(pre);

    node.removeChild(childNode);
  };
}

export default render;
