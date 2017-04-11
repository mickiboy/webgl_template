function priv_compileShader(gl, type, source) {
    var shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) return shader;

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

class Matrix2d {
    constructor(data) {
        this.data = data;
    }

    multiply(rawData) {
        var a00 = rawData[0 * 3 + 0];
        var a01 = rawData[0 * 3 + 1];
        var a02 = rawData[0 * 3 + 2];
        var a10 = rawData[1 * 3 + 0];
        var a11 = rawData[1 * 3 + 1];
        var a12 = rawData[1 * 3 + 2];
        var a20 = rawData[2 * 3 + 0];
        var a21 = rawData[2 * 3 + 1];
        var a22 = rawData[2 * 3 + 2];

        var b00 = this.data[0 * 3 + 0];
        var b01 = this.data[0 * 3 + 1];
        var b02 = this.data[0 * 3 + 2];
        var b10 = this.data[1 * 3 + 0];
        var b11 = this.data[1 * 3 + 1];
        var b12 = this.data[1 * 3 + 2];
        var b20 = this.data[2 * 3 + 0];
        var b21 = this.data[2 * 3 + 1];
        var b22 = this.data[2 * 3 + 2];

        return new Matrix2d([
            b00 * a00 + b01 * a10 + b02 * a20,
            b00 * a01 + b01 * a11 + b02 * a21,
            b00 * a02 + b01 * a12 + b02 * a22,

            b10 * a00 + b11 * a10 + b12 * a20,
            b10 * a01 + b11 * a11 + b12 * a21,
            b10 * a02 + b11 * a12 + b12 * a22,

            b20 * a00 + b21 * a10 + b22 * a20,
            b20 * a01 + b21 * a11 + b22 * a21,
            b20 * a02 + b21 * a12 + b22 * a22,
        ]);
    }
}

class Matrix3d {
    constructor(data) {
        this.data = data;
    }

    multiply(rawData) {
        var a00 = rawData[0 * 4 + 0];
        var a01 = rawData[0 * 4 + 1];
        var a02 = rawData[0 * 4 + 2];
        var a03 = rawData[0 * 4 + 3];
        var a10 = rawData[1 * 4 + 0];
        var a11 = rawData[1 * 4 + 1];
        var a12 = rawData[1 * 4 + 2];
        var a13 = rawData[1 * 4 + 3];
        var a20 = rawData[2 * 4 + 0];
        var a21 = rawData[2 * 4 + 1];
        var a22 = rawData[2 * 4 + 2];
        var a23 = rawData[2 * 4 + 3];
        var a30 = rawData[3 * 4 + 0];
        var a31 = rawData[3 * 4 + 1];
        var a32 = rawData[3 * 4 + 2];
        var a33 = rawData[3 * 4 + 3];

        var b00 = this.data[0 * 4 + 0];
        var b01 = this.data[0 * 4 + 1];
        var b02 = this.data[0 * 4 + 2];
        var b03 = this.data[0 * 4 + 3];
        var b10 = this.data[1 * 4 + 0];
        var b11 = this.data[1 * 4 + 1];
        var b12 = this.data[1 * 4 + 2];
        var b13 = this.data[1 * 4 + 3];
        var b20 = this.data[2 * 4 + 0];
        var b21 = this.data[2 * 4 + 1];
        var b22 = this.data[2 * 4 + 2];
        var b23 = this.data[2 * 4 + 3];
        var b30 = this.data[3 * 4 + 0];
        var b31 = this.data[3 * 4 + 1];
        var b32 = this.data[3 * 4 + 2];
        var b33 = this.data[3 * 4 + 3];

        return new Matrix3d([
            b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30,
            b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31,
            b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32,
            b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33,

            b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30,
            b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31,
            b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32,
            b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33,

            b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30,
            b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31,
            b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32,
            b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33,

            b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30,
            b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31,
            b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32,
            b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33,
        ]);
    }
}

/**
 * Erstellt ein Shader-Programm aus den gegebenen Quellcodes des Vertex- und
 * des Fragment-Shaders.
 *
 * @param gl WebGL-Kontext
 * @param vertexShader ID des Vertex-Shaders
 * @param fragmentShader ID des Fragment-Shaders
 * @return Programm-ID für WebGL
 */
function createShaderProgram(gl, vertexShader, fragmentShader) {
    var compiledVertexShader = priv_compileShader(gl, gl.VERTEX_SHADER, document.getElementById(vertexShader).text);
    var compiledFragmentShader = priv_compileShader(gl, gl.FRAGMENT_SHADER, document.getElementById(fragmentShader).text);
    var program = gl.createProgram();

    gl.attachShader(program, compiledVertexShader);
    gl.attachShader(program, compiledFragmentShader);
    gl.linkProgram(program);

    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) return program;

    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}

/** Canvas-Größe gleich der inneren Browser-Fläche setzen */
function resize(gl) {
    /** Erst die Größe des Canvas-Elements anpassen */
    gl.canvas.width = gl.canvas.clientWidth;
    gl.canvas.height = gl.canvas.clientHeight;

    /** Dann die neue Größe des Canvas-Elements an WebGL weitergeben */
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
}

function deg(angle) {
    return angle / 180 * Math.PI;
}
