# V4 小毛的工位与通勤包 · 1.3.0

阶段日期：2026-11-12。主角现在叫**小毛**，外形、职业制服与单实体步态保留。原《青铜之眼》没有改动。

## 新玩法

小毛的专属工位在中央四桌中的左下桌。日报在这里发，包也留在这里。先发日报、去打印区取工牌，再返回工位关机拿包。取卡前不能提前拿包；空手模式也要最后回工位关机离席。

其他三桌各有一位坐班同事，分别有两种打字/读屏姿势。她们/他们会抬头，可能注意到已经拿包的小毛，也会被狗熊哆嗦毛打断2秒，之后恢复办公。座椅继续有碰撞与前后遮挡，不把人物贴在桌子前面。

### 包款与真实差异

| 包款 | 拿包后速度 | 暴露范围系数 | 拿包后建立掩护 | 额外评分 |
|---|---:|---:|---:|---:|
| 空手出门 | 142px/s | 0.78 | 0.6秒 | 0 |
| 轻巧斜挎包 | 140px/s | 0.94 | 0.8秒 | 60 |
| 皮革托特包 | 132px/s | 1.16 | 1.15秒 | 120 |
| 大号双肩包 | 120px/s | 1.42 | 1.6秒 | 220 |

拿包前都是142px/s，掩护准备0.7秒；负担相关的减速和装忙困难在拿包后生效。空手模式的基础注意范围较宽松。包款选择与各包款最高成绩分别保存在localStorage；旧版总最高成绩保留兼容，不删除旧记录。

### 三处装忙掩护

- 小毛工位：检查工作记录。
- 打印机旁：整理打印材料，手持纸张。
- 咖啡角：端杯、看工作消息。

靠近后按空格或点「假装在忙」，停稳等待准备进度建立。掩护生效后，视野范围明显缩小、纠缠恢复加快；行走解除，近距离接触仍会被识破。掩护不会把人物变透明。打印/咖啡交互能延续已有掩护，遇到寒暄不会反复清掉取卡或喝咖啡进度；近距离仍会增加纠缠值。

## 统筹：文件、位置与原因

| 文件 / 位置 | 改动与原因 |
|---|---|
| `index.html` / 文案、`OWN_DESK`、`stations` | 主角改名小毛，专属工位位于左下桌；移走衣柜拿包任务，限制最后回工位收尾 |
| `index.html` / `LOADOUTS`、`selectLoadout`、`finish` | 空手、小斜挎、托特、大双肩4档选择，实际影响携带速度、注意范围、掩护准备和评分；按包款独立保存最好成绩 |
| `index.html` / `coverAt`、`updateCover`、`busy` | 在工位、打印和咖啡三处建立装忙掩护，支持准备进度、走动解除、近距离识破与真实纸张/杯子表现 |
| `index.html` / `updateSeated`、`drawSeated` | 3位坐班同事，独立办公姿态、抬头轻语与被技能打断后的恢复 |
| `index.html` / `drawOwnDeskProps`、`drawCarriedBag` | 精细包具动态挂在小毛工位，取走后正确消失；斜挎带、手提托特与背在身后的大包分别绘制，不用旧棕色方块冒充 |
| `assets/office-xiaomao-*-v4.*` | 专属桌面：奶油键盘、深蓝桌垫、猫咪杯、小花瓶、照片框、便签、青绿色椅子；移除衣柜烘焙包图 |
| `assets/seated-*-v4.webp`、`bag-*-v4.webp` | 内置image_gen生成真实透明通道坐姿与精细包具，原图另存 |
| `tools/prepare-props-v4.cjs` | 按Alpha边界裁切与统一基线；世界包具保留大小差异，菜单另用清晰缩略图 |
| `tools/*-v4.cjs`、`artifacts/v4/` | 新流程、4档实测、坐班/掩护、触屏与无重影回归；旧版结果不覆盖 |
| `versions/v3-before-xiaomao/` | 本地保留V3快照，可通过原素材打开 |

## 验证与边界

本轮93项检查通过：标准完整流程27项，包款/掩护/坐班39项，动作回归16项，界面/触屏11项。

- 标准托特模式真实150秒完整通关，并使用打印区掩护和技能赶上18:00电梯。
- 4档包款均实际完成新任务流程，测量拿包后的移动速度和建立掩护耗时，验证差异不是仅换文案。
- 坐班同事6张姿态实际绘制，技能打断、2秒恢复、暂停画布冻结已覆盖。
- 单实体渲染回归：走路、转向、技能不叠画主角，绘制Alpha=1。
- 真实失败重开、触屏四档选择及无横向溢出已覆盖。原生Safari/iOS和真人难度/音效评价仍未实机验收。
- 四档均完成任务与速度/掩护验证；完整18:00结局的端到端证据来自标准托特档，不把它写成四档全部通关。
- 全部使用真实鼠标、键盘与触屏模拟操作，没有注入坐标、任务或计时状态。测试记录见`artifacts/v4/*-results.json`。

实际试玩发现取卡被反复清进度的问题，已改为正常办公交互连续。门前等待仍有被老板追上的风险，需要利用掩护、技能和候梯时机；刷卡入梯耗时0.55秒，避免僵硬的长站定。

## 素材路径与内置图像工具提示词

工具：内置image_gen。最终素材已复制到本项目assets，运行不依赖默认生成目录。旧人物与背景资源没有覆盖。

| 内容 | 原图 | 运行图 |
|---|---|---|
| 小毛专属工位场景 | `assets/office-xiaomao-source-v4.png` | `assets/office-xiaomao-v4.webp` |
| 坐班同事 | `assets/seated-sheet-v4.png` | `assets/seated-0/1/2-0/1-v4.webp` |
| 三款包具 | `assets/bags-sheet-v4.png` | `assets/bag-mini/tote/pack-v4.webp`与各自thumb |

### 专属工位场景

```text
Precise localized edit for an office game background. Keep this EXACT camera, floor plan, object footprints, four desks, chairs, printer, coffee cabinet, glass partitions, elevator, warm walnut/brass sunset style. Modify ONLY the LOWER LEFT desk among the central four desks into the heroine Xiaomao's charming elegant personalized workstation: navy leather desk mat, thin pale-cream mechanical keyboard, refined pen tray, ceramic pale-blue cat-shaped mug, tiny glass vase with two delicate flowers, small round framed abstract art/photo without recognizable faces, tasteful lavender sticky notes, small closed ivory laptop beside existing slim monitor, a blank small brass nameplate on the FRONT edge for runtime text. Give its chair muted dusty teal leather with exquisite seams, preserving chair location and footprint. Keep the workspace tidy and believable, not crowded. Do NOT place a bag on this desk, no bag anywhere: remove the existing brown bag hanging on the LOWER LEFT storage cabinet and restore clean matching walnut panel beneath it. The game will render the chosen bag dynamically. Do not add people; seated people will be separate sprites. Add only a few fine everyday office props on the OTHER three central desks, such as paper sheets, a ruler, notebook, ceramic cup, without moving monitors or desk edges. Preserve all aisles and collision geometry. Finely crafted 3D miniature painterly game rendering, no logos, no UI, no text. Same 1280:760 aspect ratio.
```

### 坐班同事

```text
Game sprites matching the refined painted office character reference. Create three new seated coworkers, separate cutout sprites with NO chairs and NO desks and NO computers. 3 equal columns by 2 equal rows, six figures total. Column1 a female office designer with a neat shoulder-length chestnut bob, cream blouse and dusty blue trousers; column2 a male analyst with short black hair, thin glasses, pale blue shirt and charcoal trousers; column3 a female editor with loosely tied dark hair, sage cardigan and ivory trousers. All are SEATED at invisible chairs, facing UP toward invisible desks, viewed mainly from BEHIND in a slightly elevated rear three-quarter angle consistent with a front-facing office game. Show back of hair, neck, shoulders, torso, seated bent thighs and knees, shoes resting on floor. Natural elbows bent forward, hands close together reaching to an invisible keyboard in front; never facing the camera. Top row typing pose A, bottom row SAME respective character in pose B with a small hand/forearm change and head slightly tilted as if reading the screen. Stable identical body position and scale per column. Full seated silhouette with shoes visible. Actual transparent background, no scene, no floor, no chair, no furniture, no props other than tiny wristwatch. Three columns two rows, equal cells, wide layout. Highly detailed soft painterly cel shading, refined cloth folds, warm sunset rim light, navy/cream/sage sophisticated office palette. No text no logos no borders. These are NPCs to sit in existing rendered chairs; no heroine.
```

### 精细通勤包

```text
Production game inventory props, three exquisite office commute bags isolated on actual transparent alpha. EXACTLY 3 equal columns in one row. Left: small elegant ivory leather crossbody bag with a slim muted brass chain strap, neat stitching, restrained gold clasp. Center: medium structured cognac brown leather office tote, softly rounded rectangular silhouette, two handles, visible leather grain, fine edge paint, subtle brass hardware. Right: large navy fabric-and-leather commuter backpack with two padded shoulder straps visible in three-quarter view, refined zipper pulls, stitched front pocket and small leather carry handle. The three bags should visibly differ in SIZE: small crossbody approximately 60% of tote height, big backpack approximately 125% of tote height. All rest on same lower baseline, centered within their cells with generous padding. Luxury hand-painted 3D miniature game props, warm soft rim highlights, realistic crafted materials, no brand marks, no text, no floor shadow, no scenery, no borders. Wide landscape strip, one bag per column, fully visible including straps.
```

## Git与退出

尚未提交/推送，遵循用户「所有改动提交前先确认」。建议提交说明：`feat: 完善小毛专属工位坐班同事与通勤包潜行玩法`。本轮未启动HTTP服务；测试浏览器退出后清理本轮临时编码器和脚本，保留最终素材、截图、录像及旧版快照。不关闭无关项目进程。
