"use strict";

var gl;
var program;
var buffers = {}; 
var loc = {};
var state = {
  method: "chaos",          
  renderMode: "POINTS",     
  pointCount: 50000,
  sides: 3,                 
  depth: 5,
  pointSize: 2.0,
  colorScheme: 0,
  panX: 0.0, panY: 0.0, scale: 1.0,
  growing: true,            
  currentCount: 0,          
  totalVertices: 0          
};

window.onload = function init() {
  var canvas = document.getElementById("gl-canvas");
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) return;

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.08, 0.09, 0.12, 1.0);   

  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  loc.aPosition = gl.getAttribLocation(program, "aPosition");
  loc.aColor     = gl.getAttribLocation(program, "aColor");
  loc.uTranslation = gl.getUniformLocation(program, "uTranslation");
  loc.uScale       = gl.getUniformLocation(program, "uScale");
  loc.uPointSize    = gl.getUniformLocation(program, "uPointSize");

  buffers.position = gl.createBuffer();
  buffers.color   = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(loc.aPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(loc.aPosition);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.vertexAttribPointer(loc.aColor, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(loc.aColor);

  setupInteraction(canvas, state, rebuildGeometry);
  setupUI(state, rebuildGeometry);

  rebuildGeometry();
  render();
};

function rebuildGeometry() {
  var vertices;
  if (state.method === "chaos") {
    vertices = generateChaosPoints(state.pointCount, state.sides); 
  } else {
    var tris = generateSubdivisionTriangles(state.depth);
    vertices = trianglesToVertices(tris, state.renderMode);
  }
  var data = buildBuffers(vertices, state.colorScheme);
  state.totalVertices = vertices.length;
  state.currentCount = 0;                              

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.bufferData(gl.ARRAY_BUFFER, data.positions, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.bufferData(gl.ARRAY_BUFFER, data.colors, gl.STATIC_DRAW);
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.uniform2f(loc.uTranslation, state.panX, state.panY);
  gl.uniform1f(loc.uScale, state.scale);
  gl.uniform1f(loc.uPointSize, state.pointSize);

  var drawCount;
  if (state.renderMode === "POINTS") {
    if (state.growing && state.currentCount < state.totalVertices) {
      state.currentCount = Math.min(state.totalVertices, state.currentCount + 800);
    }
    drawCount = state.currentCount;
  } else {
    drawCount = state.totalVertices; 
  }

  if (drawCount > 0) {
    gl.drawArrays(gl[state.renderMode], 0, drawCount);
  }
  requestAnimationFrame(render);
}
