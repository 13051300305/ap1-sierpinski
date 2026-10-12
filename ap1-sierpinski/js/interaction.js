"use strict";

function setupInteraction(canvas, state, rebuildAndRender) {
  // 鼠标左键拖动平移
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
    state.panX += (dx / canvas.width) * 2.0 / state.scale;
    state.panY -= (dy / canvas.height) * 2.0 / state.scale;
  });

  // 滚轮缩放
  canvas.addEventListener("wheel", function (e) {
    e.preventDefault();
    var factor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
    state.scale *= factor;
    state.scale = Math.min(10.0, Math.max(0.3, state.scale));
  }, { passive: false });

  // 键盘
  window.addEventListener("keydown", function (e) {
    if (e.code === "Digit1") state.renderMode = "POINTS";
    else if (e.code === "Digit2") state.renderMode = "LINES";
    else if (e.code === "Digit3") state.renderMode = "TRIANGLES";
    else if (e.code === "Space") {
      e.preventDefault();
      state.growing = !state.growing;
    } else {
      return;
    }
    rebuildAndRender();
  });
}
