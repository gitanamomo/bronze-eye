# 素材与创作记录

## 人物来源与保存

- 女主人公身份参考：原项目 `assets/hero/source/master.png` 的林悦。长深棕发、黑色串珠发饰、金色耳饰、面部特征及绘景比例作为固定参考。
- 使用内置 **image_gen** 进行职业制服改绘：深蓝合体西装、象牙白衬衫、金色小领巾、职业长裤、黑色低跟鞋和工牌；移除探险手电与斜挎包。原人物参考及青铜游戏素材均未覆盖。
- 使用同一画风生成老板、闲聊同事、需求同事，保存在新项目 `assets/npc-sheet.png`。
- 两张动作表具有真正的Alpha透明通道；工具仅将规则单元切成WebP。没有通过CSS给原探险服换色冒充制服。
- 游戏中的办公室、夕阳窗景、城市天际线、桌椅、打印机、咖啡机、绿植、玻璃隔墙和电梯均由本项目Canvas代码绘制。
- 音效为本地Web Audio实时合成。没有运行时远端素材请求，没有使用第三方影视片段或歌曲。

### 最终文件

| 原图 | 单元 | 运行文件 |
|---|---|---|
| `assets/uniform-sheet.png` | 4列×2行，1536×1024 | `hero-idle`、`hero-alert`、`hero-walk0`–`hero-walk3`、`hero-dash`、`hero-bear`，均为WebP |
| `assets/npc-sheet.png` | 3列×2行，1536×1024 | `npc-boss`、`npc-chat`、`npc-request`，每人idle/walk各一帧 |

主角4帧步态按位移推进；左右镜像会带来发饰和徽章方向变化。NPC为站立/行走两种姿态配合轻微位移，不是新增骨骼或完整逐帧步态。

## 内置图像工具最终提示词

### 主角职业装动作表

```text
Use case: identity-preserve. Asset type: production 2D game character sprite sheet for an office escape game. Use the attached original character as the exact identity reference: same young adult woman's face, large brown eyes, soft painted facial features, long wavy dark brown hair, black beaded hair accessory, gold dangling earrings, same chibi/semi-realistic painted proportions. Change ONLY outfit and action/props. Dress her in elegant professional office uniform: tailored midnight navy blazer, crisp ivory collared blouse, small muted gold neck scarf, fitted navy trousers, black low office pumps, slim employee badge. Remove flashlight and crossbody adventure satchel. Transparent background, actual alpha, no scenery no text no cell borders no shadows beneath the feet. Create a clean sprite sheet with EXACTLY 4 equal columns and 2 equal rows, eight equally spaced full-body figures, each entirely within its cell, feet on matching baselines, consistent same scale and identity throughout. Top row left to right: front three-quarter relaxed standing facing right; front three-quarter alert standing facing right; side three-quarter walking right left leg forward; side three-quarter walking right passing step. Bottom row left to right: side three-quarter walking right right leg forward; side three-quarter walking right passing opposite step; humorous fast sidestep pose leaning right; humorous startled shoulder-shivering bear impression pose both arms bent up. Keep whole head, hair, hands and feet visible with clear transparent padding in every cell, no cropping, no duplication within cells, no white matte. Detailed silky hair, tailored fabric, painterly cel-shaded rendering matching reference exactly. Wide landscape sprite sheet, 4 columns by 2 rows.
```

### 老板与同事动作表

```text
Use case: stylized-concept. Production sprite sheet for the SAME office escape game as the reference. Match exactly the reference's detailed soft painterly cel shading, warm highlights, charming slightly chibi adult proportions, natural painted cloth and hair. Create three DISTINCT office NPC characters, not the heroine. Precisely 3 equal columns and 2 equal rows, 6 full-body characters with generous transparent padding and identical baseline per row; NO backgrounds, no text, no labels, no grid lines. Top row: column1 middle-aged male boss with salt-and-pepper short hair, rectangular glasses, dark blue formal suit, burnt orange tie and dress shoes; column2 female chatty colleague with chestnut bob hair, beige pantsuit and cream blouse, holds a small coffee cup; column3 young male product colleague with dark swept hair, thin round glasses, muted slate blue shirt, navy trousers, employee lanyard, holding a notebook. All top-row poses standing facing three-quarter left. Bottom row: the SAME three characters in the SAME columns, identical faces/outfits/scale, walking left in a relaxed mid-stride pose. Entire head, hair, limbs, props and shoes inside each cell. Actual transparent alpha background, no cast shadow, no environment, no matte, no halos. Painted detailed faces and cloth rendering consistent with the supplied uniform woman, who is only a style reference and must NOT appear in this sheet. Wide landscape 3 by 2 sprite sheet.
```

说明：实际生成姿态主要朝右，运行时据行走方向镜像；保留原输出，未声称每个提示细节都严格达成。

## 网络梗参考

2026-11-09核实动作表现时，agent-reach的Exa入口命令`mcporter`在本机不可用，使用内置网页搜索作为回退。

- [北京青年报 / 京报网： “闪身步”“狗熊哆嗦毛”为什么这么火？（2026-10-13）](https://news.bjd.com.cn/2026/10/13/11993124.shtml)：用于了解两种动作的错身滑移、肩臂抖动等表现。
- [中国青年网转载](https://qnzs.youth.cn/tsxq/202610/t20261013_16911557.htm)：交叉核对动作描述与民间舞背景。

本游戏仅将动作意象改编为喜剧技能。「同事停顿2秒」「老板0.8秒」「4/9秒冷却」是游戏原创规则，不是现实舞蹈的效果。未下载或使用原视频、人物肖像、原声与教学素材。


## V2素材更新 · 2026-11-10

当前运行版本使用`office-premium-v2.webp`精绘场景、`hero-walk-v2-0..7.webp`与`npc-*-walk-v2-0..3.webp`连续步态，以及统一基线的站立/技能姿态。来源均为内置image_gen，原文件另存未覆盖。完整提示词、保存路径、合成方式及验收边界见[VISUAL_V2.md](VISUAL_V2.md)。

旧版“办公室完全由Canvas绘制”描述仅对应V1；V2使用精绘背景与Canvas动态/遮挡层。新绘景为艺术渲染，不是实时三维物理光照。


## V3素材与播放修正 · 2026-11-10

当前背景为`office-premium-v3.webp`，由内置image_gen基于V2细化生成，原图另存。人物身份、制服与现有步态素材保留，已取消人物叠帧、镜像混合及闪身人影。最新提示词和维护说明见[VISUAL_V3.md](VISUAL_V3.md)。V2的混合渲染说明仅为历史记录，当前每帧只画一个人物。

## V4 小毛的工位与通勤包 · 2026-11-12

当前游戏主角名字为**小毛**，原人物的身份外形参考与职业制服保留。历史记录中的林悦仅说明原参考来源，不是当前游戏称呼。

使用内置image_gen新增：小毛专属工位背景、三位坐班同事的六张姿态、三款精细通勤包。原图和切帧均保存在assets，完整最终提示词、路径、玩法规则和边界见[GAMEPLAY_V4.md](GAMEPLAY_V4.md)。坐班同事为独立透明图层；包具为动态道具，没有烘焙在背景上，拿起后会从工位消失。仍坚持人物单帧实体绘制。

## V5 正后视打字素材

`typing-sheet-v5.png`及8张`typing-*-v5.webp`由图像生成工具根据原人物参考生成并修正透明底，提示词与修改位置见[TYPING_V5.md](TYPING_V5.md)。小毛职业装与身份保留，旧坐姿保留作历史版本。
