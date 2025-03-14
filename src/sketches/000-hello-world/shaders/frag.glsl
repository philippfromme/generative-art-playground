precision highp float;

// x,y coordinates, given from the vertex shader
varying vec2 vTexCoord;

// the canvas contents, given from filter()
uniform sampler2D tex0;

uniform int width;
uniform int height;
uniform int pixelsize;

void main() {
  vec2 coord = vec2(floor(vTexCoord.x * float(width) / float(pixelsize)) * float(pixelsize) / float(width), floor(vTexCoord.y * float(height) / float(pixelsize)) * float(pixelsize) / float(height));

  gl_FragColor = texture2D(tex0, coord);
}