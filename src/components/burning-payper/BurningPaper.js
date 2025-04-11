import React, { useRef, useEffect } from 'react';

// import shader sources as strings
import vertexShaderSource from '!!raw-loader!../../shaders/burning-paper-vertex.vs';
import fragmentShaderSource from '!!raw-loader!../../shaders/burning-paper-framgment.fs';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./burning-paper.css";

gsap.registerPlugin(ScrollTrigger);

export default function BurningPaper() {
    const canvasRef = useRef(null);
    const scrollMsgRef = useRef(null);

    useEffect(() => {
        const canvasEl = canvasRef.current;
        const scrollMsgEl = scrollMsgRef.current;
        const devicePixelRatio = Math.min(window.devicePixelRatio, 2);
        // const devicePixelRatio = 1;

        const params = {
            fireTime: .35,
            fireTimeAddition: 0
        }

        let st, uniforms;
        const gl = initShader();

        st = gsap.timeline({
            scrollTrigger: {
                trigger: ".page",
                start: "0% 0%",
                end: "100% 100%",
                // markers: true,
                scrub: true,
                onLeaveBack: () => {
                    params.fireTimeAddition = Math.min(params.fireTimeAddition, .3);
                    gsap.to(params, {
                        duration: .75,
                        fireTimeAddition: 0
                    })
                },
            },
        })
            .to(scrollMsgEl, {
                duration: .1,
                opacity: 0
            }, 0)
            .to(params, {
                fireTime: .63
            }, 0)


        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        gsap.set(".page", {
            opacity: 1
        })


        function initShader() {
            const gl = canvasEl.getContext("webgl") || canvasEl.getContext("experimental-webgl");

            if (!gl) {
                alert("WebGL is not supported by your browser.");
            }

            function createShader(gl, sourceCode, type) {
                const shader = gl.createShader(type);
                gl.shaderSource(shader, sourceCode);
                gl.compileShader(shader);

                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    console.error("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));
                    gl.deleteShader(shader);
                    return null;
                }

                return shader;
            }

            const vertexShader = createShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
            const fragmentShader = createShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

            function createShaderProgram(gl, vertexShader, fragmentShader) {
                const program = gl.createProgram();
                gl.attachShader(program, vertexShader);
                gl.attachShader(program, fragmentShader);
                gl.linkProgram(program);

                if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                    console.error("Unable to initialize the shader program: " + gl.getProgramInfoLog(program));
                    return null;
                }

                return program;
            }

            const shaderProgram = createShaderProgram(gl, vertexShader, fragmentShader);
            uniforms = getUniforms(shaderProgram);

            function getUniforms(program) {
                let uniforms = [];
                let uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
                for (let i = 0; i < uniformCount; i++) {
                    let uniformName = gl.getActiveUniform(program, i).name;
                    uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
                }
                return uniforms;
            }

            const vertices = new Float32Array([-1., -1., 1., -1., -1., 1., 1., 1.]);

            const vertexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

            gl.useProgram(shaderProgram);

            const positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
            gl.enableVertexAttribArray(positionLocation);

            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

            return gl;
        }

        function render() {
            const currentTime = performance.now();
            gl.uniform1f(uniforms.u_time, currentTime);

            if (st.scrollTrigger.isActive && st.scrollTrigger.direction === 1) {
                params.fireTimeAddition += .001;
            }

            gl.uniform1f(uniforms.u_progress, params.fireTime + params.fireTimeAddition);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            requestAnimationFrame(render);
        }

        function resizeCanvas() {
            canvasEl.width = window.innerWidth * devicePixelRatio;
            canvasEl.height = window.innerHeight * devicePixelRatio;
            gl.viewport(0, 0, canvasEl.width, canvasEl.height);
            gl.uniform2f(uniforms.u_resolution, canvasEl.width, canvasEl.height);
            render();
        }

        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    return (
        <>
            <div className="page">
                <div className="header">
                    How it's done
                </div>
                <div className="content">
                    <p>
                        The HTML content you're reading right now is overlaid with a full-screen <b>&lt;canvas&gt;</b> element.
                        There is a fragment shader that defines opacity and color for each pixel of the <b>&lt;canvas&gt;</b>.
                        Shader input values are <b>animation progress</b>, <b>time</b>, and <b>resolution</b>.
                    </p>
                    <p>
                        While <b>time</b> and <b>window size (resolution)</b> are super easy to gather, for <b>animation
                            progress</b> I use <a href="https://gsap.com/docs/v3/Plugins/ScrollTrigger/" target="_blank">GSAP
                                ScrollTrigger</a> plugin.
                    </p>
                    <p>
                        Once the inputs are prepared, we pass them as uniforms to the shader.
                        The WebGL part of this demo is a basic JS boilerplate to render a fragment shader on the single
                        full-screen plane. No extra libraries here.
                    </p>
                    <p>
                        The fragment shader is based on <a href="https://thebookofshaders.com/13/" target="_blank">Fractal
                            Brownian Motion (fBm)</a> noise.
                    </p>
                    <p>
                        First, we create a semi-transparent mask to define a contour of burning paper. It is basically a
                        low-scale fBm noise with <b>animation progress</b> value used as a threshold.
                        Taking the same fBm noise with different thresholds we can
                        <br />
                        (a) darken parts of the paper so each pixel gets darker before turning transparent
                        <br />
                        (b) define the stripe along the paper edge for fire.
                    </p>
                    <p>
                        The fire is done as another two fBm based functions, one for shape and one for color. Both have a higher
                        scale and both are animated with <b>time</b> value instead of <b>animation progress</b>.
                    </p>

                    <p className="last-line">
                        <a href="https://www.linkedin.com/in/ksenia-kondrashova/" target="_blank">linkedIn</a> |
                        <a href="https://codepen.io/ksenia-k" target="_blank">codepen</a> |
                        <a href="https://twitter.com/uuuuuulala" target="_blank">twitter (X)</a>
                    </p>
                </div>
            </div>
            <canvas id="fire-overlay" ref={canvasRef}></canvas>
            <div className="scroll-msg" ref={scrollMsgRef}>
                <div>Hello 👋</div>
                <div>scroll me</div>
                <div className="arrow-animated">&darr;</div>
            </div>
        </>
    );
}
