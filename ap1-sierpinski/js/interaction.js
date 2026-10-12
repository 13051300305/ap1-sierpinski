// interaction.js —— 鼠标平移/缩放 + 键盘交互
// 对应教材 Ch3：事件驱动程序、事件监听器、位置输入

"use strict";

function setupInteraction(canvas, state, rebuildAndRender) {
  // ---------- 鼠标左键拖动平移 ----------
  var dragging = false;
  var lastX = 0, lastY = 0;

  canvas.addEventListener("mousedown", function (e) {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
  });

  window.addEventListener("mouseup", function () { dragging = false; });

  canvas.addEventListener("mousemove", function (e) {
    if (!dragging) return;
    var dx = e.clientX - lastX;
    var dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;
    // 像素差 → clip 坐标差（注意 y 轴向上为正），除以 scale 保持平移量不随缩放变化
    state.panX += (dx / canvas.width) * 2.0 / state.scale;
    state.panY -= (dy / canvas.height) * 2.0 / state.scale;
  });

  // ---------- 滚轮缩放 ----------
  canvas.addEventListener("wheel", function (e) {
    e.preventDefault();
    var factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    state.scale *= factor;
    state.scale = Math.min(10.0, Math.max(0.3, state.scale));
  }, { passive: false });

  // ---------- 键盘 ----------
  window.addEventListener("keydown", function (e) {
    if (e.code === "Digit1") state.renderMode = "POINTS";
    else if (e.code === "Digit2") state.renderMode = "LINES";
    else if (e.code === "Digit3") state.renderMode = "TRIANGLES";
    else if (e.code === "Space") {
      e.preventDefault();
      state.growing = !state.growing;   // 空格：暂停/继续逐点生长
    } else {
      return;
    }
    rebuildAndRender();
  });
}
