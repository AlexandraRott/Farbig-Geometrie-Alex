document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('glCanvas');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        console.error('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }

    const scaleFactor = 1.5; // Scale factor for the geometric figure

    const vertices = new Float32Array([
        0.0, 0.0,
        0.25 * scaleFactor, 0.45 * scaleFactor,
        -0.25 * scaleFactor, 0.45 * scaleFactor,

        0.0, 0.0,
        0.25 * scaleFactor, -0.45 * scaleFactor,
        -0.25 * scaleFactor, -0.45 * scaleFactor,

        0.25 * scaleFactor, 0.45 * scaleFactor,
        0.45 * scaleFactor, 0.0,
        0.25 * scaleFactor, -0.45 * scaleFactor,

        -0.25 * scaleFactor, 0.45 * scaleFactor,
        -0.45 * scaleFactor, 0.0,
        -0.25 * scaleFactor, -0.45 * scaleFactor
    ]);

    const colors = new Float32Array([
        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,

        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,

        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0,

        1.0, 0.0, 0.0,
        0.0, 1.0, 0.0,
        0.0, 0.0, 1.0
    ]);

    const vertexShaderSource = `
        attribute vec2 aVertexPosition;
        attribute vec3 aColor;
        varying vec3 vColor;
        void main(void) {
            gl_Position = vec4(aVertexPosition, 0.0, 1.0);
            vColor = aColor;
        }
    `;

    const fragmentShaderSource = `
        precision mediump float;
        varying vec3 vColor;
        void main(void) {
            gl_FragColor = vec4(vColor, 1.0);
        }
    `;

    const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionAttributeLocation = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

    const colorAttributeLocation = gl.getAttribLocation(shaderProgram, 'aColor');
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    function compileShader(gl, source, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('Error compiling shader:', gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        return shader;
    }

    function drawScene() {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
        requestAnimationFrame(drawScene);
    }

    drawScene();
});
