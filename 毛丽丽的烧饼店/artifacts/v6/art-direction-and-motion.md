# V6 · 动态经营场景与遮挡修复

2026-11-14。用户要求：毛丽丽前面不能被遮挡，制作与顾客出现要有动态。

## 改动

- 删除 `apron` 绿色矩形叠层，使用真实绘本围裙替代；毛丽丽以独立上半身六帧图集显示，调整人物/柜台前景层级，手和工具保持可见。
- 招牌左移，手机单独安排位置，避免遮挡头脸。柜台前景仍保留正常环境效果。
- 备面 1.3 秒内按进度展示捧面、压面、擀皮；上炉/取饼使用饼铲姿态；完整出餐使用递纸袋姿态；辅以身体重心、面粉、炉口蒸汽和工作台动作。
- 顾客节点按订单 ID 增量更新。新顾客从巷口移入并伴随步伐起伏；等候时轻微姿态变化，耐心低时催单；接餐后拿袋/茶，完整订单完成后离场 1.6 秒再删除节点。增加订单不会重建其他顾客。
- JS 经营时间控制人物动作与节点生命周期；暂停时冻结经营时间与场景/工作台的 CSS 动画、队列过渡。狗狗仍固定趴着。

## 美术资产

- 内置 imagegen 生成：`../../assets/hero-actions-v6.png`，1536×1024，3 列×2 行，单帧 512×512。
- 参考原主角 `assets/hero/source/master.png`（上级原项目）和本项目 `assets/shop-scene.png`。
- 帧顺序：0 招呼 / 1 捧面 / 2 压面 / 3 擀皮 / 4 入炉取饼 / 5 递袋。
- 浏览器实测约 38.0% 像素为全透明，四角检查包含左上 alpha=0。直接使用透明图集，不使用脚本抠图。

## 完整生成提示词

Use case: identity-preserve and stylized-concept. Asset type: an aligned 6-frame bakery shopkeeper animation sprite sheet, transparent alpha. Reference 1 is the EXACT heroine identity to preserve: warm Chinese young woman, large brown eyes, long dark wavy hair with small dark hair clip, cream collared blouse, delicate gold earrings. Reference 2 provides painterly 3D animated-film bakery environment style and warm lighting. Dress the SAME heroine in a naturally fitted sage green linen apron over her cream blouse, apron bib at chest with visible thin neck strap, no bag and no flashlight. Create one landscape 1536x1024 sheet in exactly 3 columns x 2 rows, 512x512 per cell. All six frames depict same waist-up heroine, front view subtly turned toward left, from top of hair to apron waist including complete arms and hands. All frames MUST share same head position, head size, waist baseline and body proportions for animation. Each figure wholly within its own cell with 25px empty margin, centered, no overlaps. Frame positions row-major: 0 top-left: welcoming idle, soft smile, hands naturally relaxed in front of apron at waist. 1 top-middle: kneading start, eyes looking down, both hands gently cupping a small dough ball held at waist level, elbows raised slightly. 2 top-right: kneading press, eyes down, both hands pressing and flattening the SAME dough at waist level, elbow/forearm positions clearly different from frame1, subtle forward lean. 3 bottom-left: rolling dough, both hands holding ends of a horizontal short wooden rolling pin at waist level over a flat small dough disc, focused warm expression. 4 bottom-middle: loading oven, both hands holding a small wooden baker's peel angled down to the left with one golden flatbread on it. 5 bottom-right: serving, warmly smiling with one hand extending a small kraft paper bakery bag toward the right, other hand supporting below. All dough/pin/peel/bag are in hands; NO table or counter included. Exquisite painterly 3D animated-film rendering matching heroine reference, detailed hair and linen, soft golden upper-left light, cohesive natural anatomy and expressive hands. Background must be genuinely TRANSPARENT with alpha=0 outside figures. NO white backdrop, NO checkerboard, NO environment, NO labels, NO letters, NO text, NO UI, NO detached ground shadow. This is a functioning character animation atlas, not a contact sheet of different designs.

## 实现与调整入口

- `heroAction`、`renderHeroMotion`：动作优先级与六帧切换。
- `personElement`、`renderCustomers`、`updateCustomerMotion`：入场/等候/离场状态与增量节点更新。
- `customerReceive`：收到食物的纸袋/茶杯和回应。
- `syncPause`：CSS 动画和 CSS 过渡的暂停/恢复，使用浏览器原生 Web Animations API。
- `V6: visible arms` 样式注释：柜台层级、招牌位置、人物尺寸与动态细节。

## 验证与演示

- `motion-verification.json`：15 项动态检查；实际计时验证三段备面动作、入炉、递袋、顾客进场位移、持续节点、离场后删除、暂停冻结、狗狗固定趴姿和手机布局。
- `verification.json`：原经营流程 23 项回归，前两单真实 UI/计时，容量和结算等边界采用运行时样例。
- `living-shop-demo.mp4`：运行画面的短录屏，触发同一游戏函数演示进场、备面、上炉与出餐；不是离线伪造的逐帧动画。录制帧编码后清理中间 JPG。
- 场景与动作截图：`04-living-shop-scene.png`、`05-rolling-action.png`、`06-serving-and-leaving.png`。

本版为六张绘本姿态配合位移、道具、粒子与过渡，不是骨骼动画。顾客使用现有图集的位移、步伐起伏、等候和接餐动作，尚无独立逐帧腿部走路图集。Safari/iPhone 真机未验收。
