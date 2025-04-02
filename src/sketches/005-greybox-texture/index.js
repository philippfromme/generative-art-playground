import GUI from "lil-gui";

import chroma from "chroma-js";

const STYLES = {
  STYLE_1: "Style 1",
  STYLE_2: "Style 2",
};

const COLORS = ["#333335", "#9d22fa", "#ff8c00", "#1bd977", "#ff0038"];

function loadFont() {
  const myFonfont = new FontFace(
    "Chakra Petch",
    "url(sketches/005-greybox-texture/Chakra_Petch/ChakraPetch-Medium.ttf)"
  );

  return myFonfont
    .load()
    .then((font) => {
      document.fonts.add(font);
    })
    .catch((error) => {
      console.error("Font loading failed:", error);
    });
}

function baseRender(canvas, config) {
  const ctx = canvas.getContext("2d");

  const fontSize = canvas.width / 16;

  ctx.fillStyle = chroma("#ffffff").darken(0.5).hex();
  ctx.font = `${fontSize}px Chakra Petch`;
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  ctx.strokeStyle = chroma("#ffffff").darken(0.5).hex();
  const lineWidth = Math.floor(fontSize / 8);
  ctx.lineWidth = lineWidth;

  ctx.beginPath();
  ctx.moveTo(canvas.width, 0);
  ctx.lineTo(0, 0);
  ctx.lineTo(0, canvas.height);
  ctx.stroke();

  ctx.fillStyle = config.borderColor;
  ctx.fillText("PROTOTYPE", fontSize / 2, fontSize / 2);
  ctx.fillText("1 x 1 meter", fontSize / 2, fontSize / 2 + fontSize);
  ctx.fillText(
    `${canvas.width} x ${canvas.height}`,
    fontSize / 2,
    fontSize / 2 + fontSize * 2
  );
}

function renderStyle1(canvas, config) {
  canvas.width = config.canvasWidth;
  canvas.height = config.canvasWidth;

  const ctx = canvas.getContext("2d");

  // draw checkerboard pattern
  const size = canvas.width / config.squares;

  const otherColor = chroma(config.color).darken(0.5).hex();

  for (let y = 0; y < config.squares; y++) {
    for (let x = 0; x < config.squares; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? config.color : otherColor;
      ctx.fillRect(x * size, y * size, size, size);
    }
  }

  baseRender(canvas, config);
}

function renderStyle2(canvas, config) {
  canvas.width = config.canvasWidth;
  canvas.height = config.canvasWidth;

  const ctx = canvas.getContext("2d");

  // draw checkerboard pattern
  const size = canvas.width / config.squares;

  const otherColor = chroma(config.color).darken(0.5).hex();

  for (let y = 0; y < config.squares; y++) {
    for (let x = 0; x < config.squares; x++) {
      ctx.fillStyle = (x + y) % 2 === 0 ? config.color : otherColor;
      ctx.fillRect(x * size, y * size, size, size);
    }
  }

  ctx.strokeStyle = chroma(config.color).brighten(0.5).hex();
  ctx.lineWidth = Math.floor(size / 64);
  ctx.beginPath();
  for (let y = 0; y < config.squares; y++) {
    for (let x = 0; x < config.squares; x++) {
      const xPos = x * size + size / 2;
      const yPos = y * size + size / 2;

      ctx.moveTo(xPos - size / 4, yPos);
      ctx.lineTo(xPos + size / 4, yPos);

      ctx.moveTo(xPos, yPos - size / 4);
      ctx.lineTo(xPos, yPos + size / 4);
    }
  }

  ctx.stroke();

  baseRender(canvas, config);
}

const renderers = {
  [STYLES.STYLE_1]: renderStyle1,
  [STYLES.STYLE_2]: renderStyle2,
};

const config = {
  canvasWidth: 1024,
  squares: 8,
  color: COLORS[0],
  style: STYLES.STYLE_1,
};

async function render(node) {
  await loadFont();

  const canvas = document.createElement("canvas");

  canvas.style.boxShadow = "0 0 20px rgba(0, 0, 0, 0.5)";

  canvas.width = config.canvasWidth;
  canvas.height = config.canvasHeight;

  const gui = new GUI();

  gui.add(config, "canvasWidth", [256, 512, 1024, 2048]);
  gui.add(config, "squares", [2, 4, 8, 16, 32, 64, 128, 256, 512]);
  gui.add(config, "style", Object.values(STYLES));
  gui.add(config, "color", COLORS);

  gui.onFinishChange((event) => {
    canvas.width = config.canvasWidth;
    canvas.height = canvas.width;

    renderers[config.style](canvas, config);
  });

  renderers[config.style](canvas, config);

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

  return () => {
    gui.destroy();

    childNode.removeChild(canvas);

    node.removeChild(childNode);
  };
}

export default render;
