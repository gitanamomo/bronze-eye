# V5 · 工作台材质与食物表现

2026-11-13～14。使用内置 imagegen，保持与街景相同的暖色绘本/动画电影方向。用户要求：做饼工作台更精细、有质感。

## 交付文件

- `../../assets/kitchen-v5.png`：1536×1024 透明厨具图集，4 列×3 行；案板、炉、竹篮、托盘、面团、芝麻饼、茶壶、茶杯、葱碗、菜肉碗、豆沙碗、辣椒碗。
- `../../assets/kitchen-v5-source.png`：保留第一轮生成源。
- `../../assets/plain-bread-v5.png`：独立生成的无芝麻酥饼底，保证未选芝麻时不出现芝麻。选中芝麻后叠加独立可见芝麻层，夹馅、葱、辣同样有独立状态层。
- `../../index.html`：新增木台与纸面材质、立体按钮、图片道具、蒸汽与面团动效。经营参数与操作流程保持 V3/V4。
- `03-workbench-detail.png`：实际工作台细节截图。

图集通过每个道具自己的 SVG 视口与 clipPath 裁切，避免宽容器中露出相邻道具。素材透明处理也由 imagegen 完成，没有脚本抠图。浏览器检查 `kitchen-v5.png` 透明像素比例约 46.5%，左上角 alpha=0。

## 提示词：厨具图集生成

Use case: stylized-concept. Asset type: a production kitchen-prop sprite atlas for a beautiful Chinese sesame flatbread cooking game. Reference image defines exact painterly 3D animated-film storybook aesthetic, lighting and material quality. Generate one transparent-background landscape 1536x1024 image arranged in EXACTLY FOUR columns and THREE rows (12 equal cells, each 384x341). One separate isolated prop centered in each cell; keep ALL pixels of each prop within its own cell, leaving at least 20px empty margin from boundaries. All objects in consistent gentle top-down three-quarter front view, warm sunlight from top left. Extremely refined tactile rendering: visible aged wood grain, scattered flour powder, cracked fired clay, woven bamboo fibers, translucent celadon glaze, flaky pastry layers and realistic sesame seeds. Sophisticated warm sage / honey / umber palette matching reference. Genuine transparent alpha outside objects, no environment, no cast-shadow rectangles, no text, no labels, no borders, no UI. Read order left-to-right top-to-bottom: CELL 0 row0col0: wide rectangular worn honey-colored solid wood kneading board, softly rounded edges, lightly flour dusted, a wooden rolling pin resting diagonally near upper left; leave center clear for overlaying dough. CELL 1 row0col1: a short handsome domed traditional clay charcoal bakery oven, arch-shaped brick-edged dark open mouth facing viewer, red embers and tiny golden glow at bottom of cavity, beautifully cracked beige terracotta shell, empty mouth interior for overlaying bread. CELL 2 row0col2: empty shallow oval woven bamboo basket rack, braided rim, bamboo slats, view inside, fine woven detail. CELL 3 row0col3: empty rectangular dark walnut serving tray, thick raised polished wood rim, pale natural linen napkin folded at left edge, empty center for food. CELL 4 row1col0: a single fresh pale soft dough ball, delicately flour-dusted, soft folds, no bowl. CELL 5 row1col1: a single golden sesame flatbread with crisp flaky layered edge, appetizing browned blistered surface, visible individual toasted white sesame seeds, no plate. CELL 6 row1col2: a squat beautiful celadon green Chinese teapot with handle, short spout and lid, fine ceramic glaze, no steam. CELL 7 row1col3: one small celadon glazed tea cup with amber jasmine tea inside, circular top, subtle ceramic foot, no saucer, no steam. CELL 8 row2col0: rustic celadon bowl generously filled with freshly chopped green scallions, individual ring shapes and small wooden spoon. CELL 9 row2col1: rustic cream-glazed bowl filled with cooked chopped pork and dark preserved mustard greens, glistening rich texture, small wooden spoon. CELL 10 row2col2: rustic warm cream-glazed bowl of rich red bean paste with subtle swirls and small wooden spoon. CELL 11 row2col3: small celadon bowl of bright red chili flakes and chili oil, gleaming texture, small wooden spoon. Every prop feels like a high-quality collectible miniature from the exact same bakery world. No people, no animals.

## 提示词：透明整理

Use case: background-extraction. Precisely preserve the supplied 4-column, 3-row kitchen sprite atlas, same 12 objects, same exact positions, same rendering, same 1536x1024 canvas. Remove ALL of the pale white/checkerboard background visible between and around objects, yielding alpha=0 in every empty area, including cell boundaries and image corners. IMPORTANT this is an actual game sprite atlas: partially translucent white pixels are NOT transparent enough, the background must have ZERO ALPHA. No white backdrop, no checkerboard backdrop, no semitransparent white matte. Preserve object interiors as fully opaque, including the flour, porcelain, pale dough, wood and food. Preserve exact grid placement, material texture, colors, silhouette, cell order, and all object shapes. Do not redraw or redesign. No text or new items. Genuinely transparent PNG cutout atlas only.

## 提示词：无芝麻饼

Use case: stylized-concept. Create ONE isolated plain golden Chinese flaky flatbread as a transparent-background game sprite. Style reference: the golden flatbread in row2 column2 of the supplied kitchen atlas. Reproduce the same exquisite painterly 3D storybook rendering, warm upper-left light, browned blistered surface, many fine flaky pastry layers at the edge, appetizing golden texture. IMPORTANT: this new bread has ABSOLUTELY NO SESAME SEEDS and no other garnish, no scallions, no filling, no cut. This plain bread is needed so players can add sesame as a separate overlay when requested. A single complete round flatbread seen in gentle top-down three-quarter front view, centered with a transparent margin of 12% on every side in a square image; the bread appears an oval in perspective with width about 80% of the image and height about 58% of the image. Real transparent alpha background, no plate, no basket, no scene, no extra bread, no text, no checkerboard, no solid color background, no detached ground shadow. Match the reference material quality and golden hue precisely.

## 验证范围

`verify.cjs` 回归并行备面/烤炉/泡茶、夹馅、芝麻显示、错单拦截、分次交付、防重复收款、库存容量、暂停、升级、结算和重载存档。`capture.cjs` 以构造经营状态检查桌面/手机显示。具体结果见 `verification.json`；Safari/iPhone 真机未验收。
