#version 300 es

precision highp float;

in vec2 vUV;

out vec4 fragColor;

uniform sampler2D textureSampler;
uniform vec2 resolution;

void main(void)
{
  fragColor = texture(textureSampler, vUV);
}