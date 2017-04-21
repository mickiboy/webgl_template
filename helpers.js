function priv_compileShader(gl, type, source) {
    var shader = gl.createShader(type);

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) return shader;

    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

/**
 * Creates a shader program from the given source code of the vertex and
 * fragment shader.
 *
 * @param gl WebGL context
 * @param vertexShader ID of the vertex shader
 * @param fragmentShader ID of the fragment shader
 * @return Program ID for WebGL
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
