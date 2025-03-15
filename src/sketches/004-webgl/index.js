const vertexShaderSource = `#version 300 es

uniform vec2 uPosition;
uniform float uPointSize;

void main() {
  gl_Position = vec4(uPosition, 0.0, 1.0);

  gl_PointSize = uPointSize;
}`;

const fragmentShaderSource = `#version 300 es

precision mediump float;

uniform vec4 uColor;

out vec4 fragColor;

void main() {
  fragColor = uColor;
}`;

function render(node) {
  const canvas = document.createElement("canvas");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  node.appendChild(canvas);

  const gl = canvas.getContext("webgl2");

  const program = gl.createProgram();

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);
  gl.attachShader(program, vertexShader);

  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(
      "Error linking program",
      gl.getShaderInfoLog(vertexShader),
      gl.getShaderInfoLog(fragmentShader),
      gl.getProgramInfoLog(program)
    );
    return;
  }

  gl.useProgram(program);

  const uPositionLocation = gl.getUniformLocation(program, "uPosition");
  const uPointSizeLocation = gl.getUniformLocation(program, "uPointSize");

  const uColorLocation = gl.getUniformLocation(program, "uColor");

  let time = 0;

  function renderLoop() {
    time += 0.01;

    gl.uniform1f(uPointSizeLocation, Math.abs(Math.sin(time)) * 100);

    gl.uniform2fv(uPositionLocation, [
      Math.sin(time) * 0.5,
      Math.cos(time) * 0.5,
    ]);

    const red = Math.abs(Math.sin(time * 2));
    const green = Math.abs(Math.sin(time * 3));
    const blue = Math.abs(Math.sin(time * 4));

    gl.uniform4f(uColorLocation, red, green, blue, 1);

    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 1);

    requestAnimationFrame(renderLoop);
  }

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);

  renderLoop();

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  return () => {};
}

export default render;
