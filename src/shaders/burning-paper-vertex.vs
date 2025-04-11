precision mediump float;

varying vec2 vUv;
attribute vec2 a_position;

void main() {
  vUv = a_position;
  gl_Position = vec4(a_position, 0.0, 1.0);
}