# V5 · 正对电脑打字与小毛坐班掩护

2026-11-12。版本1.4.0。原《青铜之眼》未改动，V4入口保存在 `versions/v4-before-front-typing/index.html`。

## 改动统筹

- `index.html`：坐班NPC替换为严格正后视，两肩同深度，头部朝向显示器；双手前方补充对应键盘。沿用桌面、座椅的遮挡顺序。
- 同文件新增 `requestSit / seatStep / standUp / heroFeet`：R自动回左下专属工位坐下，再按R或移动起身。点击自己的椅子、工位旁空格也可坐下；触屏提供回座/起身按钮。
- 坐下有0.28秒落座、0.24秒起身过渡，只绘制一个人物。小毛使用与原职业装、长卷发、发箍一致的后视打字素材。坐着发送日报，完成后继续打字。
- 坐稳0.55秒建立打字掩护，普通同事停止追逐和搭话；老板近距离38px内仍可打断。计时照常，暂停冻结。移动解除，坐姿使用Q/X先起身再发动。
- 最后关机拿包后不能重新坐下，仍可在工位站立整理材料，或到打印区、咖啡角装忙。
- 修复任务完成判定：采用实际action.duration，背包收尾时长与进度条一致。
- `assets/typing-*-v5.webp`：8张统一384×512透明精灵；`typing-sheet-v5.png`保留生成原图。
- `tools/prepare-typing-v5.cjs`：只做裁切、等比缩放及对齐；`tools/*-v5.cjs`：可重跑的真实输入验证。
- `artifacts/v5/`：实际运行截图、结果JSON与预览页面。

## 操作和修改

R回座/起身，自己的椅子可点击；E发送日报等互动；移动自动起身，Q闪身步，X哆嗦毛。手机用“回座办公/起身离席”。

工位逻辑接近点在OWN_DESK(352,605)，坐姿脚点(352,571)，避免寻路进入椅子碰撞体。座椅前景遮罩最后盖住下半身。`drawSeated`设置人物大小、手部前方键盘位置，调整时需要一起检查人物、键盘和显示器中心线。`coverDelay`设置打字掩护准备时间；普通同事豁免在`update`的typingSafe条件。

## 素材生成提示词

参考原 `hero-idle-v2.webp` 保留小毛身份与制服，`seated-sheet-v4.png`只参考同事衣着。

> Production 2D office game sprite sheet correcting a directional error. EXACTLY 4 equal columns and 2 equal rows, eight isolated SEATED TYPING figures. Image1 is heroine Xiaomao identity/uniform reference; Image2 supplies coworkers clothes/style ONLY, NOT pose or viewing angle. ALL EIGHT FIGURES MUST BE STRAIGHT BACK VIEW, PERFECTLY SQUARE TO THE CAMERA: spine vertical, BOTH shoulders at equal depth, head facing straight AWAY, back of skull centered over spine, no yaw, NO side profile, NO nose, NO visible eyes, NO face, no three-quarter rotation. Very slight elevated view. Both hands reach FORWARD/UP toward invisible keyboard, symmetrically just outside torso, fingers low and flat. Column1 Xiaomao long wavy brown hair, black beaded headband, navy fitted blazer/trousers, ivory blouse gold scarf, black pumps. Column2 female chestnut bob, cream blouse, dusty blue trousers. Column3 male short dark hair, pale blue shirt, charcoal trousers. Column4 female low bun, sage cardigan, ivory trousers. Row1 typing A. Row2 same positions/scale/orientation, tiny finger/forearm movement. NO chair/furniture/keyboard/floor/shadow/text/borders. Transparent alpha, equal cell padding. Warm soft painterly cel-shaded quality. Orthographic REAR elevation.

首张背景透明度不合格，使用图像生成工具做透明底修正，未用代码进行语义修图：

> Remove ALL white/off-white background from this sprite sheet. TRUE transparent alpha background, every pixel outside eight character silhouettes fully alpha zero. Preserve EXACTLY the eight figures, their 4 column 2 row positions, back-facing poses, colors and outfits. No white haze, no floor, no shadows, no checker pattern painted into image. Production transparent PNG sprite sheet cutouts.

## 验证边界

104项检查通过（坐班11、完整通关27、动作16、包款39、界面11）。真实键盘、鼠标、触屏输入，officeSnapshot只读采样，未注入通关或人物状态。完整标准托特模式真实150秒准点通关；其他包款验证任务、速度和掩护，不等同于全部包款通关。坐班掩护测试含普通同事实际巡逻14秒；老板38px近距离打断分支未专项实测。Chromium桌面与触屏仿真通过，原生Safari/iOS仍待实机验收。

2026-11-12用户确认“提交，并同步github”，本阶段纳入GitHub发布。
