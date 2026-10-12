# AP1 · 交互式 2D 分形 — Sierpinski 垫片

> 教材：Angel & Shreiner, *Interactive Computer Graphics*, 8th ed.（Ch2–Ch3）
> 平台：原生 WebGL 2.0 + JavaScript，无构建步骤，任意静态服务器即可运行。

## 一、运行方式

```bash
# 在本目录下起任意静态服务器，然后用浏览器打开
python3 -m http.server 8000
# 浏览器访问 http://localhost:8000/
```

> 注意：不要直接双击 index.html 用 file:// 打开（部分浏览器对本地着色器标签有限制），
> 走 http 最稳。GitHub Pages / 个人主页直接把整个文件夹传上去即可，老师点链接就能跑。

## 二、文件结构（几何 / 交互 / UI 分文件）

```
ap1-sierpinski/
├── index.html            # canvas + 内嵌顶点/片元着色器 + 参数面板
├── Common/
│   ├── initShaders.js    # 教材配套：编译链接着色器
│   ├── MV.js             # 教材配套：vec2 / vec3 / mix(中点) / flatten
│   └── webgl-utils.js    # 教材配套：获取 WebGL2 上下文
└── js/
    ├── geometry.js       # 几何：混沌游戏 + 递归细分 + 配色
    ├── interaction.js    # 交互：鼠标平移/缩放 + 键盘
    ├── ui.js             # 参数面板绑定
    └── main.js           # WebGL 初始化、VBO 上传、渲染循环
```

## 三、两种生成算法原理

### 方法一：混沌游戏（Chaos Game，对应教材 2.1）
大三角形顶点固定为 `(-1,-1)、(0,1)、(1,-1)`。从质心 `(0,0)` 出发：
1. 随机选一个顶点 `v`；
2. 令当前点 `p = (p + v) / 2`（边中点）；
3. 把 `p` 作为一个点输出，回到第 1 步。

重复 ≥5000 次后，点会自动收敛到 Sierpinski 垫片上。**用 `gl.POINTS` 图元渲染。**

### 方法二：递归细分（对应教材 `divideTriangle`）
不依赖随机数。把一个三角形三边中点连成线，切成 4 个小三角形，**挖掉中间那个**，
对剩下 3 个角的小三角形递归同样的操作，直到深度为 0：

```js
function divide(a, b, c, count) {
  if (count === 0) { 记录三角形(a,b,c); return; }
  var ab = mix(0.5, a, b), ac = mix(0.5, a, c), bc = mix(0.5, b, c);
  divide(a, ab, ac, count-1);   // 顶角
  divide(c, ac, bc, count-1);   // 右下
  divide(b, bc, ab, count-1);   // 左下
}
```

深度 d 时三角形数量 = 3^d（d=5 → 243 个）。同一组三角形可切换三种图元：
- `gl.POINTS`（点云）：每个三角形 3 个顶点当点画；
- `gl.LINES`（线框）：每个三角形输出 3 条边（a-b, b-c, c-a）；
- `gl.TRIANGLES`（实体）：每个三角形直接填充。

## 四、交互说明

| 操作 | 效果 |
|---|---|
| 左键拖动 | 平移画布（修改 `uTranslation`） |
| 滚轮 | 缩放（修改 `uScale`，范围 0.3–10） |
| 键 1 / 2 / 3 | 切换 点云 / 线框 / 实体 |
| 空格 | 暂停 / 继续"逐点生长"动画（点从 0 长到设定值） |
| 面板：生成方法 | 混沌游戏 / 递归细分 |
| 面板：点数滑条 | 混沌模式顶点数（5k–200k） |
| 面板：递归深度 | 细分深度 0–6 |
| 面板：点大小 | `gl_PointSize` |
| 面板：配色 | 经典暖红 / 彩虹渐变 / 暗夜霓虹 |

## 五、渲染截图（提交前在此处放 3 张）

- 点云（混沌游戏）：`screenshot-points.png`
- 线框（递归细分 depth=5）：`screenshot-lines.png`
- 实体（递归细分 depth=5）：`screenshot-triangles.png`

## 六、现场演示可能被抽问的点（自己先想清楚）

1. 为什么混沌游戏取中点一定会收敛到垫片？（中点把点限制在离某顶点一半距离处，迭代下去只落在被挖去三角形的补集里）
2. VBO 五步：createBuffer → bindBuffer → bufferData → vertexAttribPointer → enableVertexAttribArray。
3. `gl.drawArrays(gl.POINTS, 0, n)` 的第三个参数是**顶点数**，逐点生长就是每帧把 n 从 0 加到总数。
4. 鼠标平移/缩放为什么不重算几何？——把变换放到顶点着色器的 `uScale/uTranslation` uniform 里，几何数据一次上传、多次复用。
