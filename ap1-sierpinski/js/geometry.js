"use strict";

var TRIANGLE = [vec2(-1.0, -1.0), vec2(0.0, 1.0), vec2(1.0, -1.0)];

// 生成正 n 边形顶点（n≥4，半径 1.0）
function polygonVertices(n) {
  var vs = [];
  for (var i = 0; i < n; i++) {
    var angle = 2 * Math.PI * i / n;
    vs.push(vec2(Math.cos(angle), Math.sin(angle)));
  }
  return vs;
}

// 方法一：混沌游戏
// 初始点取质心，反复 p = (p + 随机顶点)/2
// n 为多边形边数：3 用教材原三角形，≥4 用正 n 边形
function generateChaosPoints(count, n) {
  var verts = (n === 3) ? TRIANGLE : polygonVertices(n);
  var p = vec2(0.0, 0.0); // 质心，保证落在图形内
  var pts = [];
  for (var i = 0; i < count; i++) {
    var v = verts[Math.floor(Math.random() * verts.length)];
    p = mix(0.5, p, v);          // 边中点：0.5*p + 0.5*v
    pts.push(vec2(p[0], p[1]));
  }
  return pts;
}

// 方法二：递归细分
// 返回三角形数组，每个三角形是 [a, b, c] 三个 vec2
function generateSubdivisionTriangles(depth) {
  var tris = [];
  function divide(a, b, c, count) {
    if (count === 0) { tris.push([a, b, c]); return; }
    var ab = mix(0.5, a, b);
    var ac = mix(0.5, a, c);
    var bc = mix(0.5, b, c);
    count--;
    divide(a, ab, ac, count);    // 顶角小三角
    divide(c, ac, bc, count);    // 右下小三角
    divide(b, bc, ab, count);    // 左下小三角
  }
  divide(TRIANGLE[0], TRIANGLE[1], TRIANGLE[2], depth);
  return tris;
}

// 把三角形数组按渲染模式拍平成顶点列表
// POINTS：每个三角形的 3 个顶点当点画
// LINES ：每个三角形输出 3 条边（a-b, b-c, c-a）= 6 个顶点
// TRIANGLES：每个三角形 3 个顶点直接填充
function trianglesToVertices(tris, mode) {
  var out = [];
  for (var i = 0; i < tris.length; i++) {
    var a = tris[i][0], b = tris[i][1], c = tris[i][2];
    if (mode === "LINES") {
      out.push(a, b, b, c, c, a);
    } else {
      out.push(a, b, c);
    }
  }
  return out;
}

// 三套配色方案
// 根据顶点坐标返回颜色 vec3；方案切换只在 JS 侧改，不动着色器
function colorFor(pt, scheme) {
  var x = pt[0], y = pt[1];
  if (scheme === 0) {
    // 经典暖红
    return vec3(0.92, 0.25, 0.25);
  } else if (scheme === 1) {
    // 彩虹竖向渐变：y 从 -1(蓝) 到 1(红)
    var t = (y + 1.0) / 2.0;
    return vec3(t, 0.25, 1.0 - t);
  } else {
    // 暗夜霓虹绿
    return vec3(0.2, 0.95, 0.6);
  }
}

function buildBuffers(vertices, scheme) {
  var positions = [];
  var colors = [];
  for (var i = 0; i < vertices.length; i++) {
    positions.push(vertices[i][0], vertices[i][1]);
    var c = colorFor(vertices[i], scheme);
    colors.push(c[0], c[1], c[2]);
  }
  return {
    positions: new Float32Array(positions),
    colors: new Float32Array(colors)
  };
}
