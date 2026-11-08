# 《古蜀迷踪：青铜之眼》深度解读与体验审计报告（V5 交互与角色精修版）

> **审计日期**：2026-11-07  
> **审计范围**：`index.html`、`game.js`、`hero.js` / `hero.css`、`companion.js` / `companion.css`、`style.css` / `painterly.css` 及三章完整探索解谜闭环  
> **对标基线**：`versions/v4-before-audit/`（V4 人物绘景细化版）  
> **交付目标**：消除单机探索中的“机械点击感”与角色/宠物的“各演各的、姿态僵硬”问题，做到操作必有回应、主宠目光与动作自然衔接、解谜状态连贯保留。

---

## 一、游戏深度解读：它是什么、好在哪里、差在哪一步

### 1. 核心气质与叙事结构
《古蜀迷踪：青铜之眼》是一部以虚构古蜀青铜遗迹为载体的**固定视角 2.5D 绘景悬疑解谜短篇**。全作由三幕递进的空间构成：
- **第一章 · 青铜神殿前厅（秩序之始）**：通过石碑「日出→鸟醒→衔枝」的先后顺序、残器「太阳三曜入左目」与壁画「归途逆读」，建立符号序列与跨章伏笔。
- **第二章 · 神树祭坛（节律之流）**：围绕盘绕铜枝与计数铭版（太阳 3、飞鸟 2、树枝 4），让玩家在空间中校对三座铜盘机关，同时通过树根与铜壁回声揭示“遗迹并非墓葬，而是保存声音与景象的文明记忆库”。
- **第三章 · 青铜之眼密室（记忆苏醒）**：将前两章收集的“逆序归途（枝→鸟→日）”与“左纳光（3）、右藏影（4）”汇聚于悬浮青铜面具之下，完成从考古调查到唤醒千年记忆的情感收束。

### 2. 既有基础的优势（V1–V4 积累）
- **视觉基调统一**：V2 绘景背景与 V4 手绘重制的林悦（16 帧透明 WebP，含 8 帧交替步态 + 8 帧神态/观察动作）以及 V3 粉色胸背法斗（24 帧透明图集，含 12 帧行走 + 12 帧坐卧睡眠）已奠定了柔和的东方奇幻绘景质感。
- **轻量免构建架构**：纯原生 DOM + Canvas 微尘 + Web Audio 合成音效，零外部运行时依赖，加载迅速。

### 3. 审计核心症结：为什么此前仍有一层“刻板与生硬感”？
通过代码审查（Code Review）与真实浏览器交互复现，症结并不在于缺少美术帧，而在于**状态机衔接、空间距离约束、视线朝向对齐以及场景互动层次**存在断层：
1. **主宠互动缺位“空间感”与“视线对齐”**：点击法斗时不检查距离，林悦在画面另一端也会原地低头伸手“隔空摸狗”；且抚摸时不根据法斗位置翻转林悦朝向，出现“狗在右边、人往左边伸手”的穿帮画面。
2. **现成神态帧未被充分激活**：`assets/hero/poses/` 准备了 8 个神态帧，但第 `2` 帧（`curious` 专注微倾、略抬手电）在 `hero.js` 中从未被调用；不同姿态切换缺少柔和过渡；手电筒光束在转身或做观察动作时僵死在固定角度。
3. **探索方式单一（“只点菱形标记、只读弹窗文字”）**：诺大的绘景神殿中，点击可行走石板地面毫无反应；除菱形任务点外，灯台、天光、神树金鸟、活水暗河、悬浮巨面等视觉焦点均无法互动。
4. **解谜与暂停状态断层**：暂停游戏时底层循环仍在驱动法斗走路和人物计时；青铜门与终章机关一旦关闭弹窗查看手记，已拨动的符号和目轮数字便全部重置清零。

---

## 二、问题审计清单与优先级（Audit Findings）

| 编号 | 维度 | 严重度 | 问题描述与代码根因 | 基线复现 (`v4-before-audit`) | V5 状态 |
| :--- | :--- | :---: | :--- | :---: | :---: |
| **A01** | 暂停与生命周期 | **High** | 点击 `#pauseBtn` 仅设 `mode='modal'`，`frame()` 仍每帧调用 `hero.update(dt)` 与 `companion.update(dt)`，暂停期间法斗继续位移（实测 650ms 移动约 60px）、人物计时与微尘未冻结。 | 复现 (`dx=60.0px`) | **已修复** (`dx=0px`) |
| **A02** | 机关输入持久化 | **High** | `sequencePuzzle()` 每次调用均初始化局部 `values=[null,null,null]`、`eyes=[1,1]`，关闭机关弹窗翻看手记后再打开，玩家已调好的符号与目轮全部丢失。 | 复现 (`☀` 变回 `?`) | **已修复** (状态保留) |
| **A03** | 抚摸距离与朝向 | **High** | `companion.el.onclick` 直接调用 `pat()`，不检查主宠距离（`>105px` 仍隔空触发 `hero.react('pet')`）；且不更新主角朝向 `turn`，导致背对宠物伸手。 | 复现 (`dist>105` 仍触发) | **已修复** (走近+双向对视) |
| **A04** | 地面点击行走 | **High** | 仅 `#hotspots` 绑定点击事件，点击可行走石板地面（如 `1220, 792`）无任何位移或视觉反馈，违背直觉式单机探索体验。 | 复现 (`oldX===newX`) | **已修复** (步印涟漪+行走) |
| **A05** | 存档校验与覆盖 | **Medium** | 读取 `localStorage` 未过滤非法线索键，若混入未知 ID 打开手记会抛出 `TypeError`；且 `blur`/`visibilitychange` 在主菜单阶段也会执行保存，存在覆盖有效存档的隐患。 | 复现 (潜在报错/覆盖) | **已修复** (`sanitizeSave`) |
| **A06** | 角色微表演与手电 | **Medium** | `poses/2.webp`（`curious`）闲置未用；同图集大姿态切换缺少 `ghost` 柔和过渡；手电光束未随 `investigate`/`curious`/`wonder` 姿态及原地转身动态调整倾角。 | 存在 | **已完善** |
| **A07** | 环境轻交互与机关概览 | **Medium** | 探索局限于“点菱形弹窗”；第二章三座铜盘机关需逐一点开才能确认各自刻度，缺少场景内与弹窗内的全局刻度概览。 | 存在 | **已完善** |
| **C01 & C02** | **建议 1 · 法斗共情协作** | **Feature** | 宠物此前仅被动随行，未参与核心解谜或暗处探索。 | 缺位 | **已实装验证** (副铜环驻守共鸣 + 暗场嗅探 3 秘宝) |
| **S02** | **建议 2 · 镜头聚焦与光学暗刻** | **Feature** | 机关弹窗遮挡场景缺乏空间聚焦感；手电筒仅作明暗开关，缺少指向照射与光学显影解谜用途。 | 缺位 | **已实装验证** (`#world.puzzle-focus` + `#opticalGlyph`) |
| **S03** | **建议 3 · 2.5D 视差与水面倒影** | **Feature** | 单层背景缺少前景植物/石柱遮挡与多层视差；神树水渠与密室镜池无角色/面具实时波纹倒影。 | 缺位 | **已实装验证** (`--px/--py` 视差 + Canvas 实时波纹倒影) |
| **S04** | **建议 4 · 编钟音景与拓片手记** | **Feature** | 基础双正弦波缺少古蜀青铜编钟泛音与石殿混响；手记仅为纯文字列表，缺少考古拓片图谱与伙伴签章。 | 缺位 | **已实装验证** (三泛音编钟混响 + 双页拓片手记本) |

---

## 三、本轮完善详情（V5 Implementation）

### 1. 人物与法斗伙伴的精细化互动（拒绝刻板与僵硬）
- **走近抚摸与双向目光对齐（[`game.js`](file:///Users/gitana/Desktop/Doc/codex/bronze-eye/game.js)、[`companion.js`](file:///Users/gitana/Desktop/Doc/codex/bronze-eye/companion.js)）**：
  - 点击法斗时，若主宠距离 `> 105px`，林悦不再隔空伸手，而是将目标点设为法斗身旁（`pending = 'companion'`），地面浮现步印涟漪并自然走过去；同时法斗调用 `prepareGreet()` 苏醒/抬头、朝向林悦并主动迎上两步。
  - 当双方距离拉近至 `<= 98px`（或原本就在身边 `<= 105px`）时，林悦自动转向法斗所在一侧（`turn = companion.x < state.x ? -1 : 1`），垂眸温柔伸手（`poses/6.webp`）；法斗也同步转向林悦，伴随亲昵的轻晃（`nuzzleLift` / `tilt`）与 `♡` 回应。
- **激活全部 8 帧人物姿态与柔和过渡（[`hero.js`](file:///Users/gitana/Desktop/Doc/codex/bronze-eye/hero.js)）**：
  - 完整启用 `poses/2.webp`（`curious` 专注观察帧）：当林悦走近尚未收集的线索或未解开的机关并停步时，自动微倾身体、略抬手电筒审视目标；久立待机（`> 5.6s`）时，除了自然眨眼（`frame 1`），还会根据法斗是否在身边交替展现出低头看狗（`frame 6`）、审视遗迹（`frame 2`）与仰望天光（`frame 7`）。
  - 在 `poses` 图集不同姿态切换间（排除眨眼 `frame 1` 与细微手指变化 `4 <-> 5`）启用 `0.09s` 残影叠化过渡（`hero-ghost`），消除切帧跳跃。
  - 手电筒光束（`#lightbeam`）随 `investigate`、`curious`、`wonder` 姿态实时调整高度与旋转倾角，原地转身时立即同步。
- **法斗寻迹联动与跟随间距优化（[`companion.js`](file:///Users/gitana/Desktop/Doc/codex/bronze-eye/companion.js)）**：
  - 将日常跟随停步间距从 `123px` 收紧至更亲昵自然的 `95px`（实际脚底距离约 `96–98px`）。
  - 按 `P` 键或点击顶部「伙伴」按钮呼唤时，若当前章节仍有未收集的线索，法斗跑来蹭手后会主动朝向最近未收集线索的方向竖起耳朵提醒（如*“法斗跑来蹭了蹭你，又朝「古老石碑」方向竖起耳朵”*）。

### 2. 场景探索与机关体验升级（超越“点标记、读文字”）
- **地面点击直达与青铜步印涟漪（[`game.js`](file:///Users/gitana/Desktop/Doc/codex/bronze-eye/game.js)、[`painterly.css`](file:///Users/gitana/Desktop/Doc/codex/bronze-eye/painterly.css)）**：
  - 支持直接点击场景任意地面位置（自动换算 `#stage` 等比缩放坐标并约束至可行走边界 `x: 245..1355, y: 690..812`），在点击落点生成 `#walkMark` 青铜微光涟漪，林悦随即迈步前往。
- **三章绘景环境轻交互（`#envSpots`）**：
  - 在不干扰核心谜题菱形标记的前提下，为三幕场景增设 6 处现场环境观察点：
    - **前厅**：`青铜灯台`（青铜芯微光共鸣）、`天光裂隙`（仰望岩缝天光与浮尘）
    - **神树祭坛**：`枝梢金鸟`（铜枝细铃清音与能量脉动）、`地下活水`（倾听铜槽暗河水声）
    - **青铜之眼密室**：`青铜巨面`（悬浮面具双目微光呼吸）、`镜池莲影`（静水倒影涟漪）
  - 点击这些环境细节不会弹出阻断式长文窗口，而是让林悦走近驻足、做出仰望或细察姿态，触发场景光效脉动（`data-pulse`）、定制合成音效（铜铃 `bell` / 活水 `water`）与法斗回应。
- **机关状态持久化与全局刻度概览（[`game.js`](file:///Users/gitana/Desktop/Doc/codex/bronze-eye/game.js)）**：
  - 第一章 `doorSlots`、第三章 `finalSlots` 与 `eyes` 完整写入 `state` 与 `localStorage`，关闭弹窗查阅手记后重开机关，已选符号与数字原样保留。
  - 第二章「神树祭坛」三座机关的场景标签直接显示当前刻度（如 `太阳机关 · 3`），并在机关弹窗顶部新增三盘全局刻度概览条（`太阳：3 · 飞鸟：2 · 树枝：4`），一目了然。

### 3. 暂停冻结与存档防损（[`game.js`](file:///Users/gitana/Desktop/Doc/codex/bronze-eye/game.js)）
- **独立 `pause` 模式**：点击暂停按钮进入 `mode = 'pause'`，完全冻结 `state.elapsed`、`hero.update`、`companion.update` 与 `dust` 微尘渲染，恢复后无缝继续。
- **`sanitizeSave()` 存档清洗**：严格校验 `scene`、`x/y` 边界、过滤非法 `clues` ID 并去重、校验 `dials`/`doorSlots`/`finalSlots`/`eyes`/`relics`；主菜单阶段（`mode === 'menu'`）禁止执行自动保存，防止意外覆盖玩家存档。

### 4. 法斗共情的双人协作玩法（C01 & C02）
- **C01 · 双人同心环驻守与机关共鸣校准（[`companion.js`](file:///Users/gitana/Desktop/Doc/codex/bronze-eye/companion.js)、[`game.js`](file:///Users/gitana/Desktop/Doc/codex/bronze-eye/game.js)）**：
  - 三章场景地面各设有一枚发光青铜同心压感环（`#coopPad`：前厅「前厅同心环」、祭坛「神树共鸣环」、密室「祭坛守望环」）。
  - 点击同心环或走近按 `P`，法斗会小跑前往环心端坐守望（`guard` 状态，保持警觉坐姿并始终朝向林悦所在方向），脚下展开金色共鸣回路（`#coopPath`）直连当前章节的主机关。
  - 当法斗驻守同心环、林悦前往操作青铜门、三座祭坛铜盘或终章苏醒机关时，机关界面顶部点亮「法斗正驻守同心环 · 青铜音脉已连通」提示条，对应正确符号格或刻度数字泛起金色共鸣呼吸光效（`.resonating`），并提供 **「🐾 伙伴共鸣校准」** 协作按钮一键对齐当前刻度/首格符号。
- **C02 · 暗场微光嗅探与三件隐藏秘宝（[`companion.js`](file:///Users/gitana/Desktop/Doc/codex/bronze-eye/companion.js)、[`game.js`](file:///Users/gitana/Desktop/Doc/codex/bronze-eye/game.js)）**：
  - 当玩家按 `F` 键或点击「手电」关掉强光手电进入暗场（`!state.flash`）时，肉眼难辨的苔衣荧光气味粒子与嗅探轨迹（`#scentPath`）浮现，法斗自动竖起耳朵进入暗场嗅探模式（`scent-track` -> `scent`），主动小跑到隐藏秘宝位置低头嗅闻提醒。
  - 点击发光嗅探点（`#scentSpot`）即可由林悦与法斗共同发掘三章专属隐藏古蜀秘宝：
    - 第一章：**「松脂袖珍铜铃」**（`amberBell`）
    - 第二章：**「金箔神树坠叶」**（`jadeLeaf`）
    - 第三章：**「微缩羽人共鸣哨」**（`bronzeEcho`）
  - 发掘秘宝不仅收录于手记底部的 **「🐾 伙伴嗅探发现（3/3）」** 专栏，还会直接与本场景机关产生共鸣，自动帮林悦校准首格符号或第一座铜盘刻度。

### 5. 场景镜头聚焦圆环拨盘与手电筒光学显影（S02）
- **场景镜头平滑推进与半透青铜圆环拨盘（`#world.puzzle-focus` & `#modal.tactile-mode`）**：
  - 打开第一章青铜门、第二章三座祭坛铜盘（左 `27%` / 中 `50%` / 右 `72%`）或第三章记忆中枢时，场景镜头（`#world`）按目标锚点（`--focus-x`, `--focus-y`）平滑推进放大（`scale(1.16)`），机关界面化作半透古蜀青铜圆环拨盘，每次点击旋转均带物理阻尼动效。
- **手电光束鼠标指向与三章金文光学显影（`#opticalGlyph` & `#flashSpot`）**：
  - 开启手电（`state.flash === true`）移动鼠标时，林悦手中的光束倾角与体积光斑（`#flashSpot`）实时追随光标方向。
  - 当光束掠过或点击三章隐藏的光学暗刻（`#opticalGlyph`）时，显影出古蜀工匠暗藏的金文：
    - 第一章门楣：**「☀ ▸ 羽 ▸ 枝」**（日轮居首 · 飞羽承中 · 神木归末）
    - 第二章神树铜干：**「叁 · 贰 · 肆」**（太阳叁 · 飞鸟贰 · 树枝肆）
    - 第三章巨面下方：**「枝▸羽▸☀ ｜ 3·4」**（逆旋归源 · 左纳三曜 · 右藏四影）

### 6. 2.5D 多层视差、前景遮挡与水面实时波纹倒影（S03）
- **三层 2.5D 景深视差与前景石柱/蕨丛遮挡（[`index.html`](file:///Users/gitana/Desktop/Doc/codex/bronze-eye/index.html)、[`painterly.css`](file:///Users/gitana/Desktop/Doc/codex/bronze-eye/painterly.css)）**：
  - 随林悦横向/纵向移动与鼠标微移，实时计算 `--px` 与 `--py`：远景底图（`#backdrop`）、中景悬浮面具与神树铭版（`#floatingMask` / `#ritualPlate` / `#treeFlow`）、以及新增的 `z-index: 8` 前景古蜀石础与蕨类藤蔓剪影层（`.fg-silhouettes`）以不同速率反向位移，角色走过画面两侧边缘时自然穿过前景植物后方，彻底消除“贴纸感”。
- **Canvas 水面实时正弦波纹倒影（`drawWaterReflections(t)`）**：
  - 在 `#dust` 画布底层实时采样林悦当前手绘动作帧（`hero.cache`）、法斗位置以及第三章悬浮青铜巨面（`#floatingMask`），以 5 层正弦相位切片（`Math.sin(t * 0.0038 + slice * 1.3)`）绘制垂直翻转的半透明水面波纹倒影。

### 7. 古蜀编钟泛音混响音景与双页手绘拓片《田野手记》（S04）
- **Web Audio 古蜀青铜编钟泛音与石殿混响合成器（`sound()`）**：
  - 环境底噪升级为双低音青铜共鸣（`55Hz` + `82.41Hz`）叠加 LFO 调制的洞穴穿堂风（`BiquadFilterNode` 带通滤波）。
  - 机关解开、伙伴共鸣、铜铃与光学显影采用非谐波青铜编钟三泛音列（`1 : 2.76 : 4.72`），并通过 `0.19s` 反馈延迟与 `1350Hz` 低通滤波构建石殿空间混响（`reverbBus`），使脚步声、滴水声与钟鸣具备幽深的空间回响。
- **双页摊开式《古蜀青铜拓片与田野手记》（`.journal-book`）**：
  - 按 `Tab` 打开手记时呈现左右双页速写本：左页（`.journal-sketch-page`）动态绘制三章青铜拓片与星图连线（`.rubbing-svg`）、光学显影金文汇总（`.optical-summary`）以及 **「🐾 伙伴随行签章（已盖爪印）」**（`.paw-seal`）；右页（`.journal-notes-page`）完整展示 8 份田野调查记录与 3 件伙伴嗅探秘宝。

---

## 四、验证结果与证据文件

- **基线复现与修复对比**：[`artifacts/v5/audit-baseline.json`](file:///Users/gitana/Desktop/Doc/codex/bronze-eye/artifacts/v5/audit-baseline.json) 与 [`artifacts/v5/audit-test-results.json`](file:///Users/gitana/Desktop/Doc/codex/bronze-eye/artifacts/v5/audit-test-results.json)
- **人物专项回归（13 项全通过）**：[`artifacts/v5/hero-test-results.json`](file:///Users/gitana/Desktop/Doc/codex/bronze-eye/artifacts/v5/hero-test-results.json)
- **宠物专项回归（15 项全通过）**：[`artifacts/v5/companion-test-results.json`](file:///Users/gitana/Desktop/Doc/codex/bronze-eye/artifacts/v5/companion-test-results.json)
- **三章完整通关回归（28 项全通过）**：[`artifacts/v5/full-game/test-results.json`](file:///Users/gitana/Desktop/Doc/codex/bronze-eye/artifacts/v5/full-game/test-results.json)
- **V5 审计与视觉图集页**：[`artifacts/v5/index.html`](file:///Users/gitana/Desktop/Doc/codex/bronze-eye/artifacts/v5/index.html)
