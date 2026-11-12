# V2 夕照设计事务所 · 场景与动作精修

阶段交付日期：2026-11-10。版本：1.1.0。用户要求：背景更细腻、高级，人物动作更自然。本轮没有修改原《青铜之眼》入口；准时下班V1与素材完整保留。

## 统筹：改了哪里，为什么

| 文件 / 位置 | 改动与原因 |
|---|---|
| `assets/office-premium-source-v2.png`、`office-premium-v2.webp` | 使用内置image_gen重新绘制办公室：胡桃木、黄铜、书架模型、织物地毯、陶器、咖啡角、沙发、落地窗城市晚霞、细腻反射与接触阴影，回应原背景过于平面的反馈 |
| `index.html` / `drawRoom`、`desk` | 接入新绘景；家具轮廓在角色前景重新绘制，人物经过桌后会被遮挡；工作屏幕、通勤包和电梯仍由状态驱动变化 |
| `assets/hero-walk-sheet-v2.png`、`hero-walk-v2-*.webp` | 保持人物身份与制服参考，新绘八帧步态，减少四个姿态反复切换 |
| `assets/npc-walk-sheet-v2.png`、`npc-*-walk-v2-*.webp` | 三位NPC各四帧步态，替换保持同一个跨步姿态滑动的旧表现 |
| `tools/prepare-motion-v2.cjs`、`prepare-standing-v2.cjs` | 按实际Alpha范围裁切、统一等比缩放、头部锚点和脚底504基线；保留原始图，不重绘或覆盖旧素材 |
| `index.html` / `update`、`visualStep`、`actorSprite` | 起步15速率阻尼、停步30速率阻尼、0.12秒转向与0.14秒姿态过渡；用真实位移驱动脚步，碰撞停止时不原地踏步；脚底接地、轻微呼吸、技能短停驻 |
| `index.html` / `actorBuffer` | 在离屏画布按预乘像素叠加混合帧，避免将两张半透明人物直接叠在地板上而使身体变透明 |
| `artifacts/v2/` | 最终场景截图、真实动作录像、前后拖动对比页与验证记录 |
| `versions/v1-before-visual/` | 本地保留V1源码快照，通过base路径使用旧素材，可独立打开对照；此目录沿用父仓库的Git忽略规则 |
| `README.md`、`ASSETS.md`、本文件 | 更新运行入口、素材、维护位置、变更历史与验收边界 |

## 验证结果

- 完整150秒真实通关 **26项**，`artifacts/v2/test-results.json`。
- 便签、两秒停顿恢复、纠缠失败与重开 **10项**，`artifacts/v2/extra-test-results.json`。
- 新绘景、20个新步态帧、加减速、收步、转身、技能、暂停画布冻结等 **13项**，`artifacts/v2/motion-test-results.json`。
- 合计 **49项**检查通过，无脚本或资源错误。没有注入玩家坐标、计时或通关状态。
- 真实录制 `artifacts/v2/motion-demo.webm`，另转为H.264 `motion-demo.mp4`。复用已安装的Homebrew ffmpeg完成录像/转码，未安装新依赖。
- 原生Safari/iOS、真人对步态的主观评价、持续帧率仍未实机验收。该项目是二维绘景与序列帧，并非三维骨骼动画；生成帧间仍可能有细微发丝、衣褶差异。无声样片不代表音效验收。

## 修改指南

房间主图的坐标以1280×760世界为基准，原图1628×966。`desks`、`walls`、`obstacles`仍是实际碰撞几何，保留原玩法路线。若后续移动家具，应一起修改绘景、碰撞体、`desk`前景裁切、任务点与巡逻路线，不能只移动视觉图层。

`drawRoomLegacy`和`deskLegacy`作为素材尚未载入时的本地后备。主图正常载入后，只绘制精绘版本，不在上面重复叠旧方块家具。`drawRoom`包含屏幕收尾、通勤包取走和电梯开合。主角走路一周期132px，NPC一周期94px；`spriteSamples`按位移采样相邻帧。减少动态设置关闭微小呼吸、蒸汽和尘粒，保留必要移动反馈。

## 内置图像工具最终提示词

工具：内置image_gen。全部最终素材已保存到本项目assets，不依赖工具默认目录运行。

### 办公室精绘

参考：`assets/office-layout-reference.png`，由旧游戏无人物布局导出。

```text
Precise environment redesign / premium 2.5D office game background. Image 1 is the exact GAMEPLAY LAYOUT REFERENCE, not an aesthetic reference. Completely repaint it into a highly detailed exquisite boutique architectural-design studio at sunset. Preserve the shallow elevated FRONT-FACING ORTHOGRAPHIC camera, all major object footprints and open walking aisles in the same normalized positions. Do NOT rotate into diagonal isometric perspective. Wide 1280:760 landscape composition, no people no characters no text no UI no icons. Eight tall windows across back 4%-96% width top 4%-29% height with refined bronze mullions, layered real city skyline and warm peach sunset; walnut/cream wall paneling with subtle architectural lighting. Personal workstation upper-left centered at (13%,25%). Printer upper-right of central space centered (65%,24%). EXACTLY FOUR freestanding walnut work desks in two rows / two columns: desks at x22%-33%, x42%-53%, top surfaces around y37%-43% and y61%-67%; leather swivel chairs immediately south. Give desks beautiful real wood grain, ultra-thin monitors, fabric pinboards, stacked design books, little ceramic mug, brass lamp, pencil cup, paper, fine realistic bevels and shadows. Leave the walking cross-aisles at y32%-36%, y50%-59%, y76%-94% and x35%-40%, x56%-60% clear and unobstructed. Central desk island rests on warm woven textured desaturated sage carpet with brass edge. Right 25% is a director room / lounge separated by thin bronze ribbed-glass panels at x73%-75% and y20%-47%, plus y60%-70%, with an OPEN doorway at y48%-59%. Director desk upper right at (87%,26%); low upholstered sofa at (85%,62%). Coffee cabinet at (65%,77%) with elegant espresso machine and tiny cup. Left lower lockers at (12%,80%), beautifully paneled walnut with brass handles and a brown bag. Elevator is a FRONT-FACING VERTICAL bronze door integrated into the lower-right small wall at x84%-95% y72%-87%, warm inner light, no text, no overhead table or floor hatch. Foreground floor stays open, warm pale stone tiles with delicate seams and gentle reflections. Add tasteful indoor plants in existing perimeter positions, bookshelves ONLY along back wall, soft fabric cushions, crafted material detail, subtle dust in sunlight, long translucent window shadows toward lower left. Rich painterly cinematic cel-shaded interior, sophisticated muted warm palette, physically convincing soft ambient occlusion, intricate but tasteful decor. No extra desks in aisles, no text, no logos. Whole floor plan must stay fully visible, no foreground objects blocking play. This must feel like a beautifully rendered indie game environment, not a flat diagram.
```

### 主角八帧步态

参考：`assets/uniform-sheet.png`。

```text
Identity-preserve production sprite sheet. Reference is the SAME office game's heroine and uniform, do not redesign her. Exactly preserve face, age, body proportions, long wavy dark brown hair with black beaded hairband, gold earrings, navy blazer and trousers, ivory blouse, small gold scarf, employee badge, black low-heel pumps. Create a TRUE eight-frame WALK CYCLE to the RIGHT, 4 equal columns x 2 equal rows, chronological left to right then next row. ALL eight cells must show this ONE same woman from the same right-facing three-quarter side angle, same head height and scale. Frames: 1 left foot contact right foot back, 2 left leg weight acceptance, 3 right foot passes left, 4 right knee leads while left heel lifts, 5 right foot contact left foot back, 6 right leg weight acceptance, 7 left foot passes right, 8 left knee leads while right heel lifts. Natural restrained professional walking, NOT marching or running: short heel-to-toe steps, bent elbows gently swinging opposite legs, upper torso stable, subtle hair lag. Keep mouth neutral and eyes consistent in every frame. No idle/gesture panels. Full body feet visible, feet on same floor baseline per row, identical scale. Actual transparent alpha background, no scenery, no shadows, no cell borders, no labels, no text. Generous transparent padding to prevent any cell touching. Soft highly detailed hand painted cel shading matching reference. Four columns two rows, wide landscape.
```

### NPC连续步态

参考：`assets/npc-sheet.png`。

```text
Production game sprite animation, identity-preserving. Input is the three existing office NPC identities, all must stay exactly the same faces, outfits and painterly/chibi adult scale. Create a 3-column by 4-row sheet, exactly 12 full-body isolated figures. Column1 SAME silver-haired glasses male boss navy suit orange tie; column2 SAME chestnut bob female colleague beige pantsuit coffee cup; column3 SAME dark-haired round-glasses young man blue shirt navy trousers notebook. All face RIGHT, same three-quarter side angle throughout. Each COLUMN is one character's FOUR chronological WALK frames, row1 left-foot contact, row2 right foot passing, row3 right-foot contact, row4 left foot passing. Every character full body visible in each equal cell. Natural small office walking steps, restrained opposite arm swing, stable head, knee flex, realistic heel contact; woman keeps cup stable, younger man keeps notebook. Consistent scale with shoes aligned on same baseline within each row. Actual transparent background, no text no borders no scenery no floor shadow. Generous padding. Original high quality soft painterly cel shading. Exactly 3 columns and 4 rows, vertical sheet.
```

提示词是生成意图，不构成每个关节姿态都精确达成的证明；实际表现以运行样片为准。

## Git与退出

本项目整体仍未提交，沿用用户「提交前先确认」要求。拟提交说明：`feat: 新增准时下班精绘办公室与连续角色动作`；推送位置仍待确认。未修改父目录青铜游戏。完成本轮后退出测试浏览器、清理本轮临时编码器和脚本，保留最终素材、截图与录像；不关闭无关项目服务。
