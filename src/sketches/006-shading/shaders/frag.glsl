precision highp float;

varying vec2 vUV;

uniform sampler2D textureSampler;
uniform sampler2D depthSampler;
uniform sampler2D normalSampler;
uniform float cameraNear;
uniform float cameraFar;
uniform vec2 resolution;

const mat3 Sx = mat3(-1, -2, -1, 0, 0, 0, 1, 2, 1);
const mat3 Sy = mat3(-1, 0, 1, -2, 0, 2, -1, 0, 1);

float readDepth( sampler2D depthTexture, vec2 coord ) {
  float fragCoordZ = texture2D( depthTexture, coord ).x;

  return fragCoordZ;
}

void main(void)
{
  vec2 texel = vec2(1.0 / resolution.x, 1.0 / resolution.y);

  float outlineThickness = 1.0;
  vec4 outlineColor = vec4(0.0, 0.0, 0.0, 1.0);

  vec4 pixelColor = texture2D(textureSampler, vUV);

  float depth00 = readDepth(depthSampler, vUV + outlineThickness * texel * vec2(-1, 1));
  float depth01 = readDepth(depthSampler, vUV + outlineThickness * texel * vec2(-1, 0));
  float depth02 = readDepth(depthSampler, vUV + outlineThickness * texel * vec2(-1, -1));

  float depth10 = readDepth(depthSampler, vUV + outlineThickness * texel * vec2(0, -1));
  float depth11 = readDepth(depthSampler, vUV + outlineThickness * texel * vec2(0, 0));
  float depth12 = readDepth(depthSampler, vUV + outlineThickness * texel * vec2(0, 1));

  float depth20 = readDepth(depthSampler, vUV + outlineThickness * texel * vec2(1, -1));
  float depth21 = readDepth(depthSampler, vUV + outlineThickness * texel * vec2(1, 0));
  float depth22 = readDepth(depthSampler, vUV + outlineThickness * texel * vec2(1, 1));

  float xSobelValue = Sx[0][0] * depth00 + Sx[1][0] * depth01 + Sx[2][0] * depth02 +
                      Sx[0][1] * depth10 + Sx[1][1] * depth11 + Sx[2][1] * depth12 +
                      Sx[0][2] * depth20 + Sx[1][2] * depth21 + Sx[2][2] * depth22;

  float ySobelValue = Sy[0][0] * depth00 + Sy[1][0] * depth01 + Sy[2][0] * depth02 +
                      Sy[0][1] * depth10 + Sy[1][1] * depth11 + Sy[2][1] * depth12 +
                      Sy[0][2] * depth20 + Sy[1][2] * depth21 + Sy[2][2] * depth22;

  float gradientDepth = sqrt(pow(xSobelValue, 2.0) + pow(ySobelValue, 2.0));

  float outline = gradientDepth;

  vec4 color = mix(pixelColor, outlineColor, outline);

  gl_FragColor = color;

  // float depth = texture2D(depthSampler, vUV).r;
  // gl_FragColor = vec4(depth, depth, depth, 1.0);
  // gl_FragColor = texture2D(normalSampler, vUV);
  // gl_FragColor = texture2D(textureSampler, vUV);
}