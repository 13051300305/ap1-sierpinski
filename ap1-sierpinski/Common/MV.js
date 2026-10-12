// MV.js —— 教材配套矩阵/向量工具库（AP1 用到的子集：vec2 / vec3 / mix / flatten）
// 完整库还提供 mat4 等，AP2/AP3 再扩展；这里保持与教材一致的命名。

function vec2(x, y) { return [x, y]; }
function vec3(x, y, z) { return [x, y, z]; }
function vec4(x, y, z, w) { return [x, y, z, w]; }

// 线性插值（教材用它求边中点 mix(a,b,0.5)）
// 注意：教材写法 mix(0.5, a, b)，这里兼容两种参数顺序。
function mix(u, a, b) {
  if (b === undefined) { // 兼容 mix(a,b,0.5)
    b = a; a = u; u = 0.5;
  }
  var n = a.length;
  var out = new Array(n);
  for (var i = 0; i < n; i++) out[i] = u * a[i] + (1 - u) * b[i];
  return out;
}

// 把 JS 数组（vec2/vec3 列表）拍平成 Float32Array —— WebGL 只认 C 风格数组
function flatten(v) {
  if (v instanceof Float32Array) return v;
  var n = v.length;
  if (n === 0) return new Float32Array(0);
  var m = v[0].length;
  var out = new Float32Array(n * m);
  for (var i = 0; i < n; i++)
    for (var j = 0; j < m; j++)
      out[i * m + j] = v[i][j];
  return out;
}
