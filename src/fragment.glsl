// src/core/shaders/fragment.glsl
#version 300 es
precision highp float;

uniform sampler2D u_image;
uniform sampler3D u_lut;
uniform float u_lutSize;
uniform float u_exposure;
uniform float u_contrast;
uniform float u_saturation;
uniform float u_lutStrength;

in vec2 v_texCoord;
out vec4 fragColor;

vec3 applyExposure(vec3 color, float exposure) {
  return color * pow(2.0, exposure);
}

vec3 applyContrast(vec3 color, float contrast) {
  return (color - 0.5) * (1.0 + contrast) + 0.5;
}

vec3 applySaturation(vec3 color, float saturation) {
  float luma = dot(color, vec3(0.2126, 0.7152, 0.0722));
  return mix(vec3(luma), color, 1.0 + saturation);
}

vec3 applyLut(vec3 color) {
  float scale = (u_lutSize - 1.0) / u_lutSize;
  float offset = 0.5 / u_lutSize;
  return texture(u_lut, color * scale + offset).rgb;
}

void main() {
  vec3 color = texture(u_image, v_texCoord).rgb;
  color = clamp(color, 0.0, 1.0);

  // LUT first
  vec3 graded = applyLut(color);
  graded = mix(color, graded, u_lutStrength);

  // user adjustments on top
  graded = applyExposure(graded, u_exposure);
  graded = applyContrast(graded, u_contrast);
  graded = applySaturation(graded, u_saturation);

  fragColor = vec4(graded, 1.0);
}