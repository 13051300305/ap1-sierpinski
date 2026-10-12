# AP1 · 交互式 2D 分形 — Sierpinski 垫片

> 教材：Angel & Shreiner, Interactive Computer Graphics, 8th ed., Ch2–Ch3
> 平台：原生 WebGL 2.0 + JavaScript，无构建步骤，任意静态服务器即可运行。

## 一、运行方式

项目为纯静态页面，无构建步骤。本地运行命令：

```bash
python3 -m http.server 8000
```

浏览器访问 http://localhost:8000/

线上地址：https://13051300305.github.io/ap1-sierpinski/ap1-sierpinski/

## 二、文件结构

```
ap1-sierpinski/
├── index.html            # 页面结构、着色器源码、参数面板
├── Common/
│   ├── initShaders.js    # 教材配套工具，编译并链接着色器
│   ├── MV.js             # 教材配套工具，向量运算与 mix 中点计算
│   └── webgl-utils.js    # 教材配套工具，获取 WebGL2 上下文
└── js/
    ├── geometry.js       # 混沌游戏与递归细分算法，配色方案
    ├── interaction.js    # 鼠标平移缩放与键盘交互
    ├── ui.js             # 参数面板控件绑定
    └── main.js           # WebGL 初始化、VBO 上传、渲染循环
```

## 三、实现要点

### 方法一：混沌游戏

大三角形三个顶点固定为 (-1,-1)、(0,1)、(1,-1)。从质心 (0,0) 出发，循环执行以下步骤：
1. 随机选择一个顶点 v；
2. 令当前点 p 等于 p 与 v 的中点；
3. 将 p 作为点输出，回到第 1 步。

默认生成 50000 个点，点自动收敛为 Sierpinski 垫片。该模式用 gl.POINTS 图元渲染。

### 方法二：递归细分

不依赖随机数。将三角形三边中点连接，分割成 4 个小三角形，移除中间的一个，对剩余 3 个三角形递归执行相同操作，深度为 0 时停止：

```js
function divide(a, b, c, count) {
  if (count === 0) { 记录三角形(a,b,c); return; }
  var ab = mix(0.5, a, b), ac = mix(0.5, a, c), bc = mix(0.5, b, c);
  divide(a, ab, ac, count-1);
  divide(c, ac, bc, count-1);
  divide(b, bc, ab, count-1);
}
```

深度为 d 时三角形数量为 3^d，深度 5 时为 243 个。同一组三角形数据可切换三种图元：
- gl.POINTS 点云模式，每个三角形的 3 个顶点按点绘制；
- gl.LINES 线框模式，每个三角形输出三条边 a-b、b-c、c-a；
- gl.TRIANGLES 实体模式，每个三角形直接填充。

### 扩展 E1：任意 n 边形混沌游戏

面板提供多边形边数选择，取值 3 至 6。默认 3 对应教材原三角形，其余边数按正 n 边形取顶点，顶点均匀分布在单位圆上，相邻顶点夹角为 2π/n。混沌游戏的迭代规则不变，仅顶点集合由固定三角形改为所选正多边形。

三角形时点收敛为 Sierpinski 垫片；边数增大后，取中点规则不再形成垫片，点逐渐铺满整个多边形内部，可以直观对比随机迭代在不同顶点数下的收敛差异。

## 四、交互说明

| 操作 | 效果 |
|---|---|
| 左键拖动 | 平移画布 |
| 滚轮 | 缩放画布，范围 0.3 至 10 |
| 键 1 / 2 / 3 | 切换点云、线框、实体模式 |
| 空格 | 暂停或继续逐点生长动画，点数从 0 增加到设定值 |
| 面板：生成方法 | 混沌游戏或递归细分 |
| 面板：多边形边数 | 3 至 6 边形，仅混沌模式生效 |
| 面板：点数滑条 | 混沌模式顶点数，范围 5k 至 200k |
| 面板：递归深度 | 细分深度 0 至 6 |
| 面板：点大小 | 设置 gl_PointSize |
| 面板：配色 | 经典暖红、彩虹渐变、暗夜霓虹 |

## 五、运行截图

![点云](<屏幕截图 2026-10-12 215053.png>)
![线框](<屏幕截图 2026-10-12 215111.png>)
![实体](<屏幕截图 2026-10-12 215117.png>)

## 六、参考

- Angel & Shreiner, Interactive Computer Graphics, 8th ed., 第 2 章 Sierpinski 垫片示例
- 课程讲义 Practice of Computer Graphics
