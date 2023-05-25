var shaderProgram, vertexBuffer, colorBuffer;

main();

function main() {
  const canvas = document.getElementById("canvas");
  const gl = canvas.getContext("webgl");

  if (!gl) {
    alert("Incapaz de inicializar o WebGL.Seu navegador ou sua máquina não suporta.");
    return;
  }

  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  initBuffers(gl);
  initShaders(gl);
  drawScene(gl);
}

function initShaders(gl) {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");
  
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);
  
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Não foi possível inicializar o programa shader.");
    }
  
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;

    const vertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(vertexPosition);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);

    const vertexColor = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(vertexColor);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(vertexColor, 4, gl.FLOAT, false, 0, 0);
}

function getShader(gl, id) {
    var shaderScript, theSource, currentChild, shader;
  
    shaderScript = document.getElementById(id);
  
    if (!shaderScript) {
      return null;
    }
  
    theSource = "";
    currentChild = shaderScript.firstChild;
  
    while(currentChild) {
      if (currentChild.nodeType == currentChild.TEXT_NODE) {
        theSource += currentChild.textContent;
      }
  
      currentChild = currentChild.nextSibling;
    }

    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }
    gl.shaderSource(shader, theSource);

    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Um erro ocorreu ao compilar os shaders: " + gl.getShaderInfoLog(shader));
        return null;
    }
    
    return shader;
}

function initBuffers(gl) {
  vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  var vertices = [
    0.25,  0.25,  0.0,
    -0.25, 0.25,  0.0,
    0.25,  -0.25, 0.0,
    -0.25, -0.25, 0.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  const colors = [
    1.0, 1.0, 0.0, 1.0,
    1.0, 1.0, 0.0, 1.0,
    1.0, 1.0, 0.0, 1.0,
    1.0, 1.0, 0.0, 1.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
}

function drawScene(gl) {  
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function makeFrustum(left, right, bottom, top, near, far) {
    var X = 2 * near / (right - left);
    var Y = 2 * near / (top - bottom);
    var A = (right + left) / (right - left);
    var B = (top + bottom) / (top - bottom);
    var C = -(far + near) / (far - near);
    var D = -2 * far * near / (far - near);

    return new Matrix([
        [X, 0, A, 0],
        [0, Y, B, 0],
        [0, 0, C, D],
        [0, 0,-1, 0]
    ]);
}

function makePerspective(fov, aspect, near, far) {
    var yLimit = near * Math.tan(fov * Math.PI / 360);
    var xLimit = yLimit * aspect;
    return makeFrustum(-xLimit, xLimit, -yLimit, yLimit, near, far);
}

function loadIdentity() {
    mvMatrix = Matrix.I(4);
}

function mvTranslate(v) {
    mvMatrix = mvMatrix.x(Matrix.Translation(new Vector([v[0], v[1], v[2]])).ensure4x4());
}
