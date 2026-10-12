// main.js —— 主程序：WebGL 初始化、VBO 上传、渲染循环
// 对应 PPT 1.3 的 triangle.js 结构 + 博客里"缓冲区对象五步"流程

"use strict";

var gl;
var program;
var buffers = {};          // position / color 两个 VBO
var loc = {};               // attribute / uniform 位置
var state = {
  method: "chaos",          // "chaos" | "subdivision"
  renderMode: "POINTS",     // "POINTS" | "LINES" | "TRIANGLES"
  pointCount: 50000,
  depth: 5,
  pointSize: 2.0,
  colorScheme: 0,
  panX: 0.0, panY: 0.0, scale: 1.0,
  growing: true,            // 逐点生长动画开关
  currentCount: 0,          // 生长动画：当前已绘制顶点数
  totalVertices: 0          // 当前几何总顶点数
};

window.onload = function init() {
  var canvas = document.getElementById("gl-canvas");
  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) return;

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.08, 0.09, 0.12, 1.0);   // 深蓝灰背景

  // 链接着色器（对应 PPT：initShaders(gl, "vertex-shader", "fragment-shader")）
  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  // 取 attribute / uniform 位置
  loc.aPosition = gl.getAttribLocation(program, "aPosition");
  loc.aColor     = gl.getAttribLocation(program, "aColor");
  loc.uTranslation = gl.getUniformLocation(program, "uTranslation");
  loc.uScale       = gl.getUniformLocation(program, "uScale");
  loc.uPointSize    = gl.getUniformLocation(program, "uPointSize");

  // 建两个 VBO：位置、颜色（博客里"创建→绑定→写数据→分配给 attribute→启用"）
  buffers.position = gl.createBuffer();
  buffers.color   = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(loc.aPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(loc.aPosition);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.vertexAttribPointer(loc.aColor, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(loc.aColor);

  // 交互与 UI
  setupInteraction(canvas, state, rebuildGeometry);
  setupUI(state, rebuildGeometry);

  rebuildGeometry();
  render();
};

// 根据 state 重新生成几何并上传到 GPU
function rebuildGeometry() {
  var vertices;
  if (state.method === "chaos") {
    vertices = generateChaosPoints(state.pointCount);   // 点云
  } else {
    var tris = generateSubdivisionTriangles(state.depth);
    vertices = trianglesToVertices(tris, state.renderMode);
  }
  var data = buildBuffers(vertices, state.colorScheme);
  state.totalVertices = vertices.length;
  state.currentCount = 0;                               // 重新生长

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.bufferData(gl.ARRAY_BUFFER, data.positions, gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.bufferData(gl.ARRAY_BUFFER, data.colors, gl.STATIC_DRAW);
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  // 把平移/缩放/点大小传给着色器
  gl.uniform2f(loc.uTranslation, state.panX, state.panY);
  gl.uniform1f(loc.uScale, state.scale);
  gl.uniform1f(loc.uPointSize, state.pointSize);

  // 决定这次画多少个顶点
  var drawCount;
  if (state.renderMode === "POINTS") {
    if (state.growing && state.currentCount < state.totalVertices) {
      state.currentCount = Math.min(state.totalVertices, state.currentCount + 800); // 每帧多画 800 个点
    }
    drawCount = state.currentCount;
  } else {
    drawCount = state.totalVertices;   // 线框/实体整批画
  }

  if (drawCount > 0) {
    gl.drawArrays(gl[state.renderMode], 0, drawCount);
  }
  requestAnimationFrame(render);
}
