# V4 · 统一街坊人物画风

2026-11-13，使用内置 imagegen，非 CLI/API。用户要求：NPC 重新生成，与主角画风一致；狗狗不再散步，固定趴在下方。

## 参考与文件

- 主角参考：上级项目 `assets/hero/source/master.png`。匹配其绘本式 3D 动画电影人物、细腻发丝与织物、柔和皮肤和暖金侧光。
- 环境参考：`../../assets/shop-scene.png`。只参考配色与照明。
- 首轮人物图：`../../assets/npcs-v4-source.png`，保留作为生成源。
- 最终透明人物图集：`../../assets/npcs-v4.png`，1536×1024，五列。顺序为阿婆、小林、陈叔、小雨、阿远。
- 图集以 CSS 背景切片使用，未通过脚本抠图或重画；最终透明处理仍使用 imagegen。浏览器 Canvas 实测透明像素约 38.9%，四角 alpha 均为 0。

## 第一轮提示词

Use case: stylized-concept. Asset type: a single transparent-background production NPC sprite atlas for a cozy Chinese bakery management game. Input 1 is the STRICT character rendering/style reference, input 2 is ONLY the environment palette and lighting reference. Match the first reference's exquisite painterly 3D animated-film character treatment, softly painted skin, detailed individual hair strands, expressive brown eyes, volumetric facial features, beautiful fabric texture, warm golden rim lighting. NOT flat vector, NOT simple cartoon clip art. Create FIVE DISTINCT Chinese neighborhood customers, FULL BODY head to shoes visible, one horizontal row of FIVE EQUAL WIDTH CELLS in a wide landscape sheet (1536x1024). Center one character in EACH 20% width cell, isolated with generous fully transparent gap between each. All characters at same ground baseline y approximately 93% and same stylized adult proportions as reference: large expressive head but detailed natural anatomy, approximately 4 heads tall. Each occupies most of height, no figure or accessories crossing its own column boundary, no overlaps. Front view subtly facing right toward bakery, standing naturally, smiling warmly, both hands relaxed or gently holding their own small bag, no walking pose. Left to right EXACTLY: 1) '阿婆': gentle 65-year-old Chinese grandmother, silvery gray hair in neat bun, delicate round glasses, plum knit cardigan over cream blouse, charcoal skirt, comfortable brown shoes, small woven shopping basket. 2) '小林': Chinese young office woman about 28, shoulder-length dark brown bob, sage green light jacket, cream shirt, warm beige straight trousers, white shoes, small tan shoulder bag. 3) '陈叔': friendly 55-year-old Chinese man, short graying hair, tasteful glasses, muted slate blue work jacket, cream shirt, dark brown trousers, dark shoes. 4) '小雨': Chinese young student woman about 20, long dark hair in loose ponytail, muted terracotta cardigan, ivory top, pale denim trousers, sneakers, small canvas shoulder bag. 5) '阿远': cheerful Chinese young man about 25, short dark hair, dusty teal overshirt and ivory T-shirt, charcoal trousers, sneakers. Keep each figure about the same on-screen height, with grandmother slightly shorter only. This is one coherent cast in the SAME world and SAME rendering technique as the reference heroine. Constraints: genuinely transparent alpha background; NO environment, NO solid color background, NO visible checkerboard, NO text or labels, NO UI, NO borders, NO watermark. Crisp cutout silhouettes. Portrait characters arranged in 5 precise equal-width columns for direct CSS sprite extraction, no detached shadows.

## 最终图集整理提示词

Use case: background-extraction. Edit target: the supplied FIVE-character sprite sheet. Precisely preserve these same five people, their identity, clothes, exquisite painterly 3D rendering, faces, colors, pose and full bodies. REMOVE the entire brown/gray gradient backdrop and every halo from the image. Output MUST have a GENUINELY TRANSPARENT ALPHA BACKGROUND, alpha=0 everywhere outside characters, NOT a new painted backdrop, NOT a checkerboard, NOT black or brown. This is a game sprite sheet laid over an existing environment. Arrange these identical five isolated people in exactly five equal-width columns of a landscape 1536x1024 transparent image: cell0 x0..306, cell1 x307..613, cell2 x614..920, cell3 x921..1227, cell4 x1228..1535. Each person centered within its cell with at least 18px empty transparent margin on each side; resize each whole person slightly if needed to avoid any object (especially grandmother basket and men's elbows) crossing a cell border. Keep same relative full-body proportions and align shoes to y980. All five complete faces, hair, hands, bags and shoes preserved. No text. No new objects. No ground shadows or background glow. The only colored opaque pixels should be the five people and their own clothing/accessories.

## 接入方式与验证

`index.html` 中 `personArt` 输出人物切片，`.npcpaint` 使用 5 倍横向背景；`.npc-0`～`.npc-4` 对应五位街坊。人物比例按单列约 0.3 的宽高比显示，避免把整张图拉扁。队列保留入场、轻微呼吸和点击看订单。

狗狗移除 `walking` 样式、行走帧切换、路径关键帧和定时散步状态，固定 `idle.webp` 的趴姿帧。只通过极轻微亮度变化表现呼吸，位置与手机缩放不受动画影响。

实测见 `verification.json`；桌面与手机截图见同目录 PNG。Safari/iPhone 真机未验收。V3 入口与说明保留于 `../../versions/v3/`。
