// ui.js —— 参数面板控件（HTML 控件直接绑定，不引入第三方库）
// 对应教材 Ch3：菜单、按钮、滑条

"use strict";

function setupUI(state, rebuildAndRender) {
  var $ = function (id) { return document.getElementById(id); };

  // 生成方法：混沌游戏 / 递归细分
  $("method-chaos").addEventListener("change", function () {
    state.method = "chaos";
    state.renderMode = "POINTS";          // 混沌结果只能当点云画
    syncEnabled(); rebuildAndRender();
  });
  $("method-sub").addEventListener("change", function () {
    state.method = "subdivision";
    syncEnabled(); rebuildAndRender();
  });

  // 渲染模式按钮
  $("mode-points").addEventListener("click", function () { state.renderMode = "POINTS"; rebuildAndRender(); });
  $("mode-lines").addEventListener("click", function () { state.renderMode = "LINES"; rebuildAndRender(); });
  $("mode-tri").addEventListener("click", function () { state.renderMode = "TRIANGLES"; rebuildAndRender(); });

  // 点数滑条（混沌模式）
  $("point-count").addEventListener("input", function () {
    state.pointCount = parseInt(this.value);
    $("point-count-val").textContent = this.value;
    rebuildAndRender();
  });

  // 边数选择（E1 扩展，仅混沌模式生效）
  $("sides").addEventListener("change", function () {
    state.sides = parseInt(this.value);
    rebuildAndRender();
  });

  // 递归深度滑条（细分模式，0–6）
  $("depth").addEventListener("input", function () {
    state.depth = parseInt(this.value);
    $("depth-val").textContent = this.value;
    rebuildAndRender();
  });

  // 点大小
  $("point-size").addEventListener("input", function () {
    state.pointSize = parseFloat(this.value);
    $("point-size-val").textContent = this.value;
  });

  // 配色方案
  $("scheme").addEventListener("change", function () {
    state.colorScheme = parseInt(this.value);
    rebuildAndRender();
  });

  // 根据当前方法，启用/禁用不适用的控件
  function syncEnabled() {
    var chaos = state.method === "chaos";
    $("point-count-row").style.display = chaos ? "" : "none";
    $("sides-row").style.display = chaos ? "" : "none";
    $("depth-row").style.display = chaos ? "none" : "";
    $("mode-lines").disabled = chaos;
    $("mode-tri").disabled = chaos;
  }
  syncEnabled();
}
