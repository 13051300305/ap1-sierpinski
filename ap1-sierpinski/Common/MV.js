function vec2(x, y) { return [x, y]; }
function vec3(x, y, z) { return [x, y, z]; }
function vec4(x, y, z, w) { return [x, y, z, w]; }

function mix(u, a, b) {
  if (b === undefined) { // 兼容 mix(a,b,0.5)
    b = a; a = u; u = 0.5;
  }
  var n = a.length;
  var out = new Array(n);
  for (var i = 0; i < n; i++) out[i] = u * a[i] + (1 - u) * b[i];
  return out;
}

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
