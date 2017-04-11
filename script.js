var gl;

var program;

var modelMatrix2dUniformLocation;
var viewMatrixUniformLocation;
var projectionMatrixUniformLocation;

var positionAttributeLocation;
var positionBuffer;

/** Initialize WebGL (only once) */
function init() {
    /** Get canvas element */
    var canvas = document.getElementById("webgl-canvas");

    /** Create a WebGL context in the canvas */
    gl = canvas.getContext("webgl");

    /** Abort if creating a context failed */
    if (!gl) return false;

    /** Set clear color */
    gl.clearColor(0.2, 0.2, 0.2, 1.0);

    /** [helpers.js] Create shader program */
    program = createShaderProgram(gl, "vertex-shader", "fragment-shader");

    /** Bind uniforms to JS variables (think of IDs) */
    modelMatrix2dUniformLocation = gl.getUniformLocation(program, "u_modelMatrix2d");
    viewMatrixUniformLocation = gl.getUniformLocation(program, "u_viewMatrix");
    projectionMatrixUniformLocation = gl.getUniformLocation(program, "u_projectionMatrix");

    /** Create a binding for the vertex data to the shader */
    positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    /** Create buffer for the vertex data */
    positionBuffer = gl.createBuffer();

    /** Create array with vertex data */
    var vertices = [
        /** x, y */
        0.0, 0.0,  /** Vertex bottom-left */
        0.0, 0.5,  /** Vertex top-left */
        0.5, 0.0,  /** Vertex bottom-right */
    ];

    /** Bind buffer to WebGL */
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    /** Fill bound buffer with array (only bound buffers can be filled with data!) */
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    return true;
}

/** Must be called when data is modified */
function render() {
    /** [helpers.js] Set canvas size */
    resize(gl);

    /** Clear back buffer with the previously set clear color */
    gl.clear(gl.COLOR_BUFFER_BIT);

    /** Activate shader program */
    gl.useProgram(program);

    /** Bind a_position for the following functions */
    gl.enableVertexAttribArray(positionAttributeLocation);

    /** Bind the vertex buffer */
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    /** Set important parameters */
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    /** Convert to world coordinates (Local -> World = Model) */
    {
        var translation = [
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0,
        ];

        var rotation = [
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0,
        ];

        var scale = [
            1.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 0.0, 1.0,
        ];

        var modelMatrix = new Matrix2d(translation).multiply(rotation).multiply(scale);

        gl.uniformMatrix3fv(modelMatrix2dUniformLocation, false, modelMatrix.data);
    }

    /** TODO Convert to camera coordinates (World -> Eye = View) */
    {
        var identity = [
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0,
        ];

        var projectionMatrix = new Matrix3d(identity);

        gl.uniformMatrix4fv(projectionMatrixUniformLocation, false, projectionMatrix.data);
    }

    /** TODO Convert to viewport coordinates (View -> Clip = Projection) */
    {
        var identity = [
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0,
        ];

        var viewMatrix = new Matrix3d(identity);

        gl.uniformMatrix4fv(viewMatrixUniformLocation, false, viewMatrix.data);
    }

    /** Submit vertices to WebGL (1 draw call) */
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    /** Repeat render function */
    requestAnimationFrame(render);
}

function main() {
    if (init()) {
        requestAnimationFrame(render);
    }
}

main();
