import GUI from "lil-gui";

function render(node) {
  const DEFAULT_CONFIG = {
    canvasWidth: 256,
    squares: 32,
    color1: "#a0a0a0",
    color2: "#808080",
    borderColor: "#ffffff",
  };

  const canvas = document.createElement("canvas");

  canvas.width = DEFAULT_CONFIG.canvasWidth;
  canvas.height = DEFAULT_CONFIG.canvasHeight;

  function render(canvas, config = DEFAULT_CONFIG) {
    config = { ...DEFAULT_CONFIG, ...config };

    canvas.width = config.canvasWidth;
    canvas.height = config.canvasWidth;

    const ctx = canvas.getContext("2d");

    // draw checkerboard pattern
    const size = canvas.width / config.squares;

    for (let y = 0; y < config.squares; y++) {
      for (let x = 0; x < config.squares; x++) {
        ctx.fillStyle = (x + y) % 2 === 0 ? config.color1 : config.color2;
        ctx.fillRect(x * size, y * size, size, size);
      }
    }

    const fontSize = canvas.width / 16;

    console.log(fontSize);

    ctx.fillStyle = config.color1;
    ctx.font = `${fontSize}px monospace`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    ctx.strokeStyle = config.borderColor;
    const lineWidth = Math.floor(fontSize / 4);
    ctx.lineWidth = lineWidth;
    ctx.strokeRect(
      lineWidth / 2,
      lineWidth / 2,
      canvas.width - lineWidth,
      canvas.height - lineWidth
    );

    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    // const metrics = ctx.measureText(`${canvas.width}x${canvas.height}`);

    // const actualWidth =
    //   Math.abs(metrics.actualBoundingBoxLeft) +
    //   Math.abs(metrics.actualBoundingBoxRight);
    // const actualHeight =
    //   Math.abs(metrics.actualBoundingBoxAscent) +
    //   Math.abs(metrics.actualBoundingBoxDescent);

    // ctx.fillStyle = config.color2;
    // ctx.fillRect(0, 0, actualWidth + 8, actualHeight + 8);

    ctx.fillStyle = config.borderColor;
    ctx.fillText("PROTOTYPE", fontSize / 2, fontSize / 2);
    ctx.fillText("1 x 1 meter", fontSize / 2, fontSize / 2 + fontSize);
    ctx.fillText(
      `${canvas.width} x ${canvas.height}`,
      fontSize / 2,
      fontSize / 2 + fontSize * 2
    );
  }

  const config = { ...DEFAULT_CONFIG };

  const gui = new GUI();

  gui.add(config, "canvasWidth", [256, 512, 1024, 2048]);
  gui.add(config, "squares", [2, 4, 8, 16, 32, 64, 128, 256, 512]);
  gui.addColor(config, "color1");
  gui.addColor(config, "color2");
  gui.addColor(config, "borderColor");

  gui.onChange((event) => {
    canvas.width = config.canvasWidth;
    canvas.height = canvas.width;

    render(canvas, config);

    pre.textContent = JSON.stringify(config, null, 2);
  });

  render(canvas, config);

  node.appendChild(canvas);

  canvas.style.width = "512px";
  canvas.style.height = "512px";
  canvas.style.imageRendering = "pixelated";

  const pre = document.createElement("pre");

  node.appendChild(pre);

  pre.textContent = JSON.stringify(config, null, 2);

  pre.style.position = "relative";
  pre.style.width = "512px";
  pre.style.height = "512px";
  pre.style.fontSize = "32px";
  pre.style.display = "flex";
  pre.style.justifyContent = "center";
  pre.style.alignItems = "center";
  pre.style.backgroundColor = config.color2;
  pre.style.color = config.color1;
  pre.style.cursor = "pointer";
  pre.style.userSelect = "none";

  pre.addEventListener("click", () => {
    const type = "text/plain";

    const clipboardItemData = {
      [type]: JSON.stringify(config, null, 2),
    };

    const clipboardItem = new ClipboardItem(clipboardItemData);

    navigator.clipboard.write([clipboardItem]);

    pre.style.backgroundColor = config.color1;
    pre.style.color = config.color2;

    setTimeout(() => {
      pre.style.backgroundColor = config.color2;
      pre.style.color = config.color1;
    }, 100);
  });

  return () => {
    gui.destroy();

    node.removeChild(canvas);
    node.removeChild(pre);
  };
}

export default render;
