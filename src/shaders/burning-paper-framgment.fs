precision mediump float;

varying vec2 vUv;
uniform vec2 u_resolution;
uniform float u_progress;
uniform float u_time;

float rand(vec2 n) {
    return fract(cos(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}
float noise(vec2 n) {
    const vec2 d = vec2(0., 1.);
    vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
    return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}
float fbm(vec2 n) {
    float total = 0.0, amplitude = .4;
    for (int i = 0; i < 4; i++) {
        total += noise(n) * amplitude;
        n += n;
        amplitude *= 0.6;
    }
    return total;
}

void main() {
    vec2 uv = vUv;
    uv.x *= min(1., u_resolution.x / u_resolution.y);
    uv.y *= min(1., u_resolution.y / u_resolution.x);

    float t = u_progress;
    vec3 color = vec3(1., 1., .95);

    float main_noise = 1. - fbm(.75 * uv + 10. - vec2(.3, .9 * t));

    float paper_darkness = smoothstep(main_noise - .1, main_noise, t);
    color -= vec3(.99, .95, .99) * paper_darkness;

    vec3 fire_color = fbm(6. * uv - vec2(0., .005 * u_time)) * vec3(6., 1.4, .0);
    float show_fire = smoothstep(.4, .9, fbm(10. * uv + 2. - vec2(0., .005 * u_time)));
    show_fire += smoothstep(.7, .8, fbm(.5 * uv + 5. - vec2(0., .001 * u_time)));

    float fire_border = .02 * show_fire;
    float fire_edge = smoothstep(main_noise - fire_border, main_noise - .5 * fire_border, t);
    fire_edge *= (1. - smoothstep(main_noise - .5 * fire_border, main_noise, t));
    color += fire_color * fire_edge;

    float opacity = 1. - smoothstep(main_noise - .0005, main_noise, t);

    gl_FragColor = vec4(color, opacity);
}
