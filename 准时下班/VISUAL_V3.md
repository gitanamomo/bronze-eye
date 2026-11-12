# V3 单实体动作与空间精修 · 1.2.0

日期：2026-11-10。用户反馈：走动时有幻影，场景要更立体精致，动作应贴合人物。

## 原因与改动

V2虽然修正了叠帧导致身体透明的问题，但仍把相邻步态、前后姿势和镜像转身同时绘制，轮廓不同的位置会出现双臂、双腿与人影；闪身还额外复制人物。**这是上一版渲染方式造成的问题。V3取消所有这些人物叠画。**

| 文件 / 位置 | 改动与原因 |
|---|---|
| `index.html` / `bodyFrame`、`actorSprite` | 每次只选择一张人物帧，直接以Alpha=1绘制；移除相邻帧、姿态、镜像的混合及离屏叠加 |
| `index.html` / `drawHero`、`update` | 移除闪身人物残像，只保留细短速度线；普通走路不产生任何副本人影 |
| `index.html` / `visualStep`、`bodyDepth` | 短促收步、单实体轻微重心变化、脚底接触阴影与朝夕阳反向投影；人物随场景远近在0.91–1.04范围缩放，脚底位置保持在地面 |
| `index.html` / `WALK_SPEED`、`HERO_STRIDE` | 普通移动由185调整为142px/s，一轮步态由132调整为112px；短步快走匹配职业制服与低跟鞋，脚步声间隔55px接近半轮步距 |
| `assets/office-premium-source-v3.png`、`office-premium-v3.webp` | 基于V2房间再精绘：桌板圆角与厚度、圆柱桌脚、厚实椅背、皮革缝线、地毯绒面、柔软沙发体积、窗框挤出与方向一致的接触阴影 |
| `index.html` / `chairs`、`chairForeground`、`desk` | 椅子加入真实碰撞，椅背/座面/椅脚与桌面分层遮挡；增加桌脚前景厚度，调整闲聊同事的巡逻路线以避免卡在新增碰撞体上 |
| `artifacts/v3/`、`tools/*-v3.cjs` | 独立保留本轮测试、截图与H.264/WebM动作样片，不覆盖V2验证记录 |
| `versions/v2-before-solid-motion/` | 本地V2快照保留，可直接打开；使用旧资源，不随新版场景切换 |

## 验证

- 完整真实150秒准点通关：26项。
- 便签、停顿恢复、失败与重开：10项。
- 动作与重影回归：16项。直接拦截真实画布绘制调用，确认每帧仅有一个主角实体，所有人物绘制Alpha均为1；实际使用八张独立步态，起步、收步、转向、技能和暂停均覆盖。
- 合计 **52项通过**，记录位于`artifacts/v3/`。没有注入坐标、计时或通关状态。
- `motion-demo.mp4`与`motion-demo.webm`为真实键盘操作录像；默认无声。复用已安装的Homebrew ffmpeg，未安装依赖。
- 本质仍是二维序列帧，转身没有新增完整三维角度；生成帧可能有细微衣褶/发丝差异。原生Safari/iOS、真人动画评价和持续帧率未实机验收。

## 维护

后续不要恢复人物交叉淡化来掩盖帧间差异。如需更平滑，应制作身份和关节位置一致的中间帧。当前每帧只绘制一个人物图像，以免再出现副本轮廓。

家具调整必须同步`obstacles`、`chairs`、前景遮挡、任务点与巡逻路径。V3保留四工位、打印、衣柜、咖啡与电梯的大布局，细化物体体积与接触关系。

## 场景素材与最终提示词

使用内置 **image_gen**，编辑参考为`assets/office-premium-v2.webp`。最终原图保存`assets/office-premium-source-v3.png`，运行文件为`assets/office-premium-v3.webp`。人物继续使用原身份/制服与已有八帧、NPC四帧素材，修正其播放和合成方式，未更换主角。

```text
Precise-object and lighting refinement of this exact office game background. Keep the EXACT camera, composition, floor plan, object positions, number of desks, and open aisles. Preserve four desks, same upper-left personal desk, printer, right glass partitions, sofa, lower-left lockers and lower-right bronze elevator. DO NOT add furniture to walking paths or move any object. No characters, no text, no logos. Upgrade the dimensionality and material craftsmanship noticeably: render as an exquisite physical 3D miniature architectural studio with substantial walnut desk slab thickness, gently rounded bevels catching light, visible sculpted chair seats and curved backs, weighty desk legs with convincing contact shadows, carpet pile and stitched border, deep walnut cabinet relief and brass handles, fine leather seams, layered upholstered sofa cushions with real volume and crisp occlusion in creases. Strengthen coherent directional late-afternoon light from upper-right windows, subtle cool ambient fill on left-facing surfaces, richer contact shadow at each furniture/floor junction, layered penumbra under tables and shelves. Window frames and glass partitions need visible bronze extrusion, realistic subtle refraction and spatial edge highlights, not flat billboards. Tactile stone tile pores and restrained softer reflections instead of mirror gloss. Books and architectural models have little paper/page/bevel detail. Bring foreground a little darker and clearer, middle ground richly modeled, skyline gently atmospheric. Retain warm sophisticated walnut/cream/brass palette, tasteful lush plants, painterly high-end indie game aesthetic matching existing characters. No depth-of-field blur on playable floor, every interactable object stays sharply readable. Preserve 1280:760 aspect and all normalized gameplay footprints exactly. Result must feel more solid, three-dimensional and delicately crafted than input while staying the same room.
```

场景是艺术绘景与代码动态层，不是实时三维光照。原版素材、V1/V2快照和录像均保留。

## 提交与退出

当前新项目整体尚未提交，继续遵循用户「提交前先确认」规范。拟提交：`feat: 新增准时下班游戏并完善实体动作与立体场景`。本轮测试未启动HTTP服务；完成后关闭测试浏览器并清理本轮临时编码器，保留最终素材与记录。不改动原青铜游戏。
