var gl;

var program;

var modelMatrix2dUniformLocation;
var viewMatrixUniformLocation;
var projectionMatrixUniformLocation;

var positionAttributeLocation;
var positionBuffer;

/** WebGL initialisieren (wird nur einmal gemacht) */
function init() {
    /** Canvas-Element abrufen */
    var canvas = document.getElementById("webgl-canvas");

    /** WebGL-Kontext im Canvas erstellen */
    gl = canvas.getContext("webgl");

    /** Abbrechen, falls WebGL-Kontext nicht geladen werden konnte */
    if (!gl) return false;

    /** Löschfarbe setzen */
    gl.clearColor(0.2, 0.2, 0.2, 1.0);

    /** [helpers.js] Shader-Programm erstellen */
    program = createShaderProgram(gl, "vertex-shader", "fragment-shader");

    /** Binde die Uniforms an die JavaScript-Variablen (es sind im Prinzip IDs) */
    modelMatrix2dUniformLocation = gl.getUniformLocation(program, "u_modelMatrix2d");
    viewMatrixUniformLocation = gl.getUniformLocation(program, "u_viewMatrix");
    projectionMatrixUniformLocation = gl.getUniformLocation(program, "u_projectionMatrix");

    /** Eine Anbindung für die Daten an den Vertex-Shader erstellen */
    positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    /** Puffer für Vertex-Daten erstellen */
    positionBuffer = gl.createBuffer();

    /** Array mit Vertex-Daten erstellen */
    var vertices = [
        /** x, y */
        0.0, 0.0,  /** Vertex links unten */
        0.0, 0.5,  /** Vertex links oben */
        0.5, 0.0,  /** Vertex rechts unten */
    ];

    /** Den Puffer an WebGL anbinden */
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    /** Den angebundenen Buffer mit dem Array füllen (Hinweis: nur angebundene Puffer können mit Daten gefüllt werden!) */
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    return true;
}

/** Muss aufgerufen werden, sobald sich Daten ändern */
function render() {
    /** [helpers.js] Canvas-Größe setzen */
    resize(gl);

    /** Den Backbuffer mit der gesetzten Löschfarbe füllen */
    gl.clear(gl.COLOR_BUFFER_BIT);

    /** Shader-Programm aktivieren */
    gl.useProgram(program);

    /** a_position für die folgenden Funktionen anbinden */
    gl.enableVertexAttribArray(positionAttributeLocation);

    /** Den Puffer anbinden */
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    /** Wichtige Parameter an den Vertex-Shader übergeben */
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    /** In Weltkoordinaten umwandeln (Local -> World = Model) */
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

    /** TODO In Kamerakoordinaten umwandeln (World -> Eye = View) */
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

    /** TODO In Fensterkoordinaten umwandeln (View -> Clip = Projection) */
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

    /** Vertizen an WebGL übergeben (1 Draw call) */
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    /** Bei Bedarf neu rendern */
    requestAnimationFrame(render);
}

function main() {
    if (init()) {
        requestAnimationFrame(render);
    }
}

main();
