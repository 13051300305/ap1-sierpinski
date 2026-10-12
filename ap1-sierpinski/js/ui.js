"use strict";

function setupUI(state, rebuildAndRender) {
  var $ = function (id) { return document.getElementById(id); };

  $("method-chaos").addEventListener("change", function () {
    state.method = "chaos";
    state.renderMode = "POINTS";         
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

  // 点数滑条
  $("point-count").addEventListener("input", function () {
    state.pointCount = parseInt(this.value);
    $("point-count-val").textContent = this.value;
    rebuildAndRender();
  });

  // 边数选择
  $("sides").addEventListener("change", function () {
    state.sides = parseInt(this.value);
    rebuildAndRender();
  });

  // 递归深度滑条
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
