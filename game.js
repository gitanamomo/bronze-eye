'use strict';
const $=s=>document.querySelector(s),KEY='bronze-eye-save-v1';
const symbols=['☀','羽','枝'], names=['太阳','飞鸟','树枝'];
const clues={
 stele:{title:'石碑 · 日出之序',tag:'前厅 / 石刻拓记',text:'石碑的刻痕被水汽磨平，只有靠近光源的部分还清晰可辨。',quote:'「日出，鸟醒；鸟衔枝，归于神木。」',note:'林悦：从日出到归巢……这是三个符号的先后顺序。',record:'日出 → 鸟醒 → 衔枝。青铜门按太阳、飞鸟、树枝排列。'},
 vessel:{title:'残器 · 太阳的刻记',tag:'前厅 / 青铜残片',text:'破损器腹上，一轮太阳下排列着三枚圆点。器底有一道向内的箭痕。',quote:'「三曜同生，光入左目。」',note:'林悦：太阳对应三。左眼的数值，也许就是它。',record:'太阳 = 3。光入左目：最终机关左眼取太阳数。'},
 mural:{title:'壁画 · 归巢',tag:'前厅 / 壁画摹本',text:'飞鸟衔着枝条，在日光中飞向一株树。青铜树的每一根枝条末端都悬着微小铃铛。',quote:'「来时循光，归时溯源。」',note:'林悦：如果“来时”是太阳、鸟、树，那么归途就要反过来读。',record:'归时溯源：最终符号逆序，由树枝 → 飞鸟 → 太阳。'},
 relief:{title:'祭坛铭版 · 神树的节律',tag:'神树祭坛 / 计数铭版',text:'三种纹样右侧的圆点并非装饰。石屑下的机关铭文仍然清楚。',quote:'「太阳三曜，双鸟相望，四枝承露。」',note:'林悦：太阳三、飞鸟二、树枝四。机关应当逐一对应。',record:'祭坛三个机关：太阳 3 / 飞鸟 2 / 树枝 4。'},
 roots:{title:'树根 · 记忆之流',tag:'神树祭坛 / 根部记录',text:'树根并未扎入泥土，而是向地底伸进一条条刻满符号的铜槽。隐约有耳语沿铜槽流动。',quote:'「枝藏万象，影入右目。」',note:'林悦：树枝的数量是四。右眼应该接收四道记忆。',record:'影入右目：最终机关右眼取树枝数 4。'},
 echo:{title:'余响 · 并非墓葬',tag:'神树祭坛 / 声学观察',text:'林悦轻叩铜壁。传回来的不是空洞回声，而是风吹树叶、鸟翼掠过水面的声音。',quote:'「以声为舟，以铜为岸。」',note:'林悦：这里保存的……可能是记忆。',record:'这座遗迹保存声音与景象，或许是一座文明的记忆库。'},
 return:{title:'逆读铭文 · 来路与归途',tag:'青铜之眼 / 环形铭文',text:'祭坛边缘的文字向内旋回。三个符号恰好与入口石碑相反。',quote:'「归时溯源：枝、鸟、日。左纳光，右藏影。」',note:'林悦：把树与日放回各自的眼睛，这里就会醒来。',record:'最终符号：树枝、飞鸟、太阳；左纳光（太阳3），右藏影（树枝4）。'},
 eyes:{title:'双眼 · 记忆的容器',tag:'青铜之眼 / 面具观察',text:'面具双眼里映出的不是林悦，而是两种不同的景象：左边是太阳，右边是树的剪影。',quote:'「光与影交汇之时，往昔便有了形状。」',note:'林悦：把前厅的太阳刻记与祭坛的树枝数量对应过来。',record:'左眼映太阳，右眼映树枝。需要前两章的数字线索。'},
 chimeStele:{title:'潮音古碑 · 宫角羽',tag:'星璇长廊 / 声学刻石',text:'石碑刻着潮涌之纹与三枚大钟悬挂的形制，水汽在其上凝聚成露。',quote:'「击日钟为宫，击鸟钟为羽，击枝钟为商；三音共振，星桥乃通。」',note:'林悦：日钟对应宫（3），鸟钟对应羽（5），枝钟对应商（2）。',record:'潮音古碑：星璇编钟分别调整为 日钟 3 / 鸟钟 5 / 枝钟 2。'},
 astrolabe:{title:'浑天铜仪 · 星野之纪',tag:'星璇长廊 / 浑天星仪',text:'浑天环上的星点逆时针旋转，中轴正对深壑对面破晓的方位。',quote:'「循声渡虚，见日初升；相携相伴，归途不孤。」',note:'林悦：星桥通向的是破晓的云海。千年前的守望者跨过这里，走向晨光。',record:'浑天铜仪：编钟调谐后虚空成桥，通向最后的破晓观星台。'},
 dawnMemorial:{title:'守望者之碑 · 破晓之盟',tag:'观星圣台 / 终章铭文',text:'石碑沐浴在金色的朝阳下，上面刻着古蜀守望者对大地的誓约与同行灵犬的剪影。',quote:'「天地长存，灵犬相伴；日月星汉，尽归此心。」',note:'林悦抱起法斗：我们终于走到了阳光下。这段千年的记忆，由我们一起带回世间。',record:'守望者之碑：古蜀文明将对天地的敬畏与对伙伴的深情留在破晓圣台。'},
 houndRelief:{title:'忠犬浮雕 · 千年不离',tag:'观星圣台 / 忠犬浮雕',text:'巍峨古蜀守护者身旁，蹲坐着一只仰望主人的小犬，姿态与身边的小法斗如出一辙。',quote:'「千载虽逝，其温犹存。」',note:'林悦摸了摸法斗的脑袋，小家伙开心地摇着小尾巴。',record:'忠犬浮雕：记录了从远古到今日，人与伙伴从未改变的信任与相守。'}
};
const relics={
 amberBell:{scene:0,x:985,y:742,title:'铜铃犬牌 · 守望之伴',tag:'前厅暗处 / 伙伴嗅探发现',text:'在关闭手电后的幽暗石缝间，法斗用鼻尖拱出了一枚沾着微光铜锈的小巧犬牌。犬牌内侧刻着太阳纹与一只蹲坐的小兽。',quote:'「凡循光入殿者，必有灵犬同行；初门之首，始于烈日。」',note:'林悦摸了摸小家伙的脑袋：原来千年前的守望者，也带着自己的毛孩子。犬牌上的太阳纹已与青铜门首位产生共鸣。',record:'伙伴在暗处嗅出「铜铃犬牌」：古蜀守望者亦有灵犬相伴，印证青铜门首位为「太阳」。'},
 jadeLeaf:{scene:1,x:562,y:736,title:'衔露玉叶 · 树根回响',tag:'神树祭坛 / 伙伴嗅探发现',text:'法斗顺着神树根部的幽蓝气味停在一枚半埋的玉叶前。玉叶背面刻着三道清晰的日轮刻痕，在暗处泛着温润微光。',quote:'「三曜暖根，灵兽知音；踏环而坐，神木乃鸣。」',note:'林悦：小家伙对铜槽里的声波比我更敏感。让它坐上祭坛中央的副铜环，我们就能听清铜盘共鸣的节点。',record:'伙伴嗅出「衔露玉叶」：印证太阳机关刻度为 3，且提示伙伴驻守地面副铜环可导通音律共鸣。'},
 bronzeEcho:{scene:2,x:1045,y:740,title:'守望兽印 · 千年同行',tag:'青铜之眼 / 伙伴嗅探发现',text:'镜池石阶的暗影里，法斗对着一枚青铜兽印轻轻呜咽。印纽上是一只仰望面具的小犬，底座刻着左三右四的星点。',quote:'「人记其言，犬记其温；光三影四，岁岁相守。」',note:'林悦把兽印收进掌心，法斗安静地贴着她的脚踝。千年前被保存下来的不只是文明的恢弘，还有这样平凡而长久的陪伴。',record:'伙伴嗅出「守望兽印」：印证左目纳光为 3、右目藏影为 4，记录了古蜀人与伙伴跨越千年的相守。'},
 cloudWhistle:{scene:3,x:1120,y:740,title:'星陨骨哨 · 唤风之信',tag:'星璇长廊 / 伙伴嗅探发现',text:'在浑天仪石阶隙缝中，法斗用小爪子刨出了一枚微缩白玉骨哨，吹响时发出如夜莺般的清鸣。',quote:'「骨哨清音，灵犬知心；驻守铜环，钟鸣相合。」',note:'林悦：骨哨印证了鸟钟为羽音（刻度5）。让法斗驻守长廊副铜环，编钟的音律共振会更加明晰。',record:'伙伴嗅出「星陨骨哨」：印证飞鸟编钟刻度为 5，提示法斗驻守可辅助调音。'},
 dawnSunPendant:{scene:4,x:520,y:745,title:'四鸟金箔 · 破晓圣印',tag:'观星圣台 / 伙伴嗅探发现',text:'晨光透射的石阶裂隙间，法斗兴奋地嗅出了一枚完整的古蜀四鸟绕日纯金箔片。',quote:'「负日而飞，与光同在。」',note:'林悦将金箔轻轻贴在法斗胸背上：这是古蜀守望者赠予我们最好的破晓礼物。',record:'伙伴嗅出「四鸟金箔」：集齐全部五大秘宝，达成真正圆满破晓！'}
};
const scenes=[
 {name:'青铜神殿前厅',goal:'调查石碑、残器与壁画，开启青铜之门',desc:'一扇门，在等待被读懂。',points:[['stele',381,559,'古老石碑'],['vessel',525,615,'青铜残器'],['mural',1240,480,'神秘壁画'],['door',800,573,'青铜之门']],env:[['lantern',575,555,'青铜灯台','curious','bell','lantern','林悦：灯台里的青铜芯仍在微光中轻轻共鸣。'],['sunbeam',1135,310,'天光裂隙','wonder','look','sunbeam','林悦：天光从岩缝倾泻而下，浮尘像千年前的微星。']],pad:{x:648,y:766,label:'迎光副铜环',path:'M648 766 Q735 715 800 573'},relic:'amberBell',optical:{x:800,y:392,sym:'☀ ▸ 羽 ▸ 枝',label:'门楣暗刻 · ☀▸羽▸枝',text:'手电光束穿透门楣铜锈，显影出古蜀金文：「日轮居首 · 飞羽承中 · 神木归末」。'}},
 {name:'神树祭坛',goal:'读取铭版，调整三处机关的节律',desc:'风没有经过这里，树却在轻轻作响。',points:[['relief',1380,495,'计数铭版'],['roots',655,657,'神树根部'],['echo',263,515,'铜壁余响'],['sunDial',435,571,'太阳机关'],['birdDial',800,569,'飞鸟机关'],['branchDial',1145,571,'树枝机关'],['passage',1002,695,'地下通道'],['back',180,722,'返回前厅']],env:[['canopy',795,255,'枝梢金鸟','wonder','bell','tree','林悦：铜枝上的金鸟迎着天光，梢头细铃在无风自鸣。'],['stream',160,625,'地下活水','curious','water','stream','林悦：活水顺着铜槽环绕祭坛，将水声化作平稳的节拍。']],pad:{x:800,y:774,label:'神树副铜环',path:'M435 571 Q618 710 800 774 M800 774 L800 569 M800 774 Q972 710 1145 571'},relic:'jadeLeaf',optical:{x:945,y:410,sym:'叁 · 贰 · 肆',label:'铜干暗刻 · 叁·贰·肆',text:'手电斜照神树铜干，折射出磷光节律：「太阳叁 · 飞鸟贰 · 树枝肆」。'}},
 {name:'青铜之眼密室',goal:'结合手记，让青铜之眼苏醒以开启长廊',desc:'它注视的，并不是闯入者。',points:[['return',404,519,'逆读铭文'],['eyes',1190,530,'双眼刻痕'],['final',800,686,'记忆中枢'],['back',180,722,'返回祭坛']],env:[['maskGaze',800,285,'青铜巨面','wonder','bell','mask','林悦：悬浮的青铜巨面内部似乎有微光随呼吸起伏。'],['lotusPool',1310,685,'镜池莲影','curious','water','stream','林悦：静水映出面具与天光，像一面封存时间的铜镜。']],pad:{x:635,y:764,label:'溯源副铜环',path:'M635 764 Q718 730 800 686'},relic:'bronzeEcho',optical:{x:800,y:438,sym:'枝▸羽▸☀ ｜ 3·4',label:'面具暗铭 · 逆旋3·4',text:'光束穿透面具下方水雾，显影出终章秘铭：「逆旋归源（枝·羽·日），左纳三曜、右藏四影」。'}},
 {name:'星璇编钟长廊',goal:'聆听潮音古铭，调谐三枚青铜大钟，导通星桥',desc:'音律所至，虚空成桥。',points:[['chimeStele',242,540,'潮音石碑'],['astrolabe',1260,535,'星璇浑天仪'],['chimeBells',800,442,'青铜编钟架'],['bridgeDais',800,695,'星桥基台'],['back',180,722,'返回密室']],env:[['chimeEcho',800,320,'编钟余韵','wonder','bell','chime','林悦：编钟铜梁微微震颤，空气中回荡着古老的泛音。'],['starChasm',800,610,'星光深壑','curious','look','star','林悦：深壑下浮动着漫天青金色星尘，像倒悬的银河。']],pad:{x:642,y:764,label:'宫律副铜环',path:'M642 764 Q720 720 800 695'},relic:'cloudWhistle',optical:{x:800,y:442,sym:'宫3 · 羽5 · 枝2',label:'编钟暗刻 · 宫3羽5枝2',text:'手电照亮中钟铭文，显影出五音古律：「日钟宫三 · 鸟钟羽五 · 枝钟商二，星桥乃通」。'}},
 {name:'破晓观星台',goal:'踏上日轮圣坛，与伙伴相拥见证破晓破雾',desc:'第一缕曙光，照亮了千年的归途。',points:[['dawnMemorial',235,550,'守望者之碑'],['houndRelief',1240,545,'忠犬守望浮雕'],['dawnAltar',800,720,'日轮结算圣坛'],['back',180,722,'返回长廊']],env:[['cloudSea',800,360,'晨光云海','wonder','look','dawn','林悦：金色的朝阳漫过翻滚的云海，群峰如出水芙蓉！'],['dawnSunGate',800,240,'破晓金门','wonder','bell','gate','林悦：千年的石门向天际敞开，飞鸟迎着红日翱翔。']],pad:{x:635,y:765,label:'同心归宿环',path:'M635 765 Q718 738 800 720'},relic:'dawnSunPendant',optical:{x:800,y:360,sym:'四鸟绕日 · 万物向阳',label:'天门神铭 · 万物向阳',text:'朝阳穿透门拱，在石台上投下古蜀最神圣的金光符印：「四鸟绕日 · 万物向阳 · 守望长青」。'}}
];
function defaultState(muted=false){return{scene:0,x:675,y:755,clues:[],relics:[],optical:[],solved:[false,false,false,false,false],dials:[1,1,1],chimes:[1,1,1],doorSlots:[null,null,null],finalSlots:[null,null,null],eyes:[1,1],flash:true,muted:Boolean(muted),started:Date.now(),elapsed:0,ended:false}}
function sanitizeSave(raw){
 if(!raw||raw.version!==1||!Number.isInteger(raw.scene)||raw.scene<0||raw.scene>=scenes.length||!Array.isArray(raw.clues)||!Array.isArray(raw.solved)||!Array.isArray(raw.dials))return null;
 return{
  scene:raw.scene,
  x:Number.isFinite(raw.x)?Math.max(245,Math.min(1355,raw.x)):675,
  y:Number.isFinite(raw.y)?Math.max(690,Math.min(812,raw.y)):755,
  clues:[...new Set(raw.clues.filter(id=>Object.prototype.hasOwnProperty.call(clues,id)))],
  relics:Array.isArray(raw.relics)?[...new Set(raw.relics.filter(id=>Object.prototype.hasOwnProperty.call(relics,id)))]:[],
  optical:Array.isArray(raw.optical)?[...new Set(raw.optical.filter(n=>[0,1,2,3,4].includes(n)))]:[],
  solved:[0,1,2,3,4].map(i=>Boolean(raw.solved[i])),
  dials:[0,1,2].map(i=>Number.isInteger(raw.dials[i])&&raw.dials[i]>=1&&raw.dials[i]<=5?raw.dials[i]:1),
  chimes:Array.isArray(raw.chimes)?[0,1,2].map(i=>Number.isInteger(raw.chimes[i])&&raw.chimes[i]>=1&&raw.chimes[i]<=5?raw.chimes[i]:1):[1,1,1],
  doorSlots:Array.isArray(raw.doorSlots)?[0,1,2].map(i=>[0,1,2].includes(raw.doorSlots[i])?raw.doorSlots[i]:null):[null,null,null],
  finalSlots:Array.isArray(raw.finalSlots)?[0,1,2].map(i=>[0,1,2].includes(raw.finalSlots[i])?raw.finalSlots[i]:null):[null,null,null],
  eyes:Array.isArray(raw.eyes)?[0,1].map(i=>Number.isInteger(raw.eyes[i])&&raw.eyes[i]>=1&&raw.eyes[i]<=5?raw.eyes[i]:1):[1,1],
  flash:typeof raw.flash==='boolean'?raw.flash:true,
  muted:typeof raw.muted==='boolean'?raw.muted:false,
  started:Number.isFinite(raw.started)?raw.started:Date.now(),
  elapsed:Number.isFinite(raw.elapsed)&&raw.elapsed>=0?raw.elapsed:0,
  ended:Boolean(raw.ended)
 };
}
function readSave(){try{return sanitizeSave(JSON.parse(localStorage.getItem(KEY)))}catch{return null}}
let state=defaultState();
let mode='menu',target=null,pending=null,keys=new Set(),last=0,stepClock=0,saveClock=0,darkClock=0,opticalClock=0,chimeClock=0,pointerX=860,pointerY=540,aimAngle=0,ctxAudio=null,ambient=null,ambientNodes=null,reverbBus=null,toastTimer,walkMarkTimer,pulseTimer,heroBubbleTimer,petBubbleTimer,turn=1,hintLevel=0,awakeningStart=0,previewTrueEnding=false;
const stepRipples=[],padPrevButtons=[];
window.__audioStats={count:0,lastType:'',hasReverb:false,partials:3,melodyNotes:0,surface:'stone',chapterProfile:0};
window.__reflectionStats={framesRendered:0,lastScene:0,awakeningFrames:0,terrainLift:0,stepRipplesRendered:0};
window.__bubbleStats={heroCount:0,petCount:0,lastHero:'',lastPet:''};
window.__gamepadStats={connected:false,lastButton:'',rumbleCount:0};
function sayBubble(who,text,ms=3100){
 const el=$(who==='pet'?'#petBubble':'#heroBubble');
 if(!el||!text)return;
 el.textContent=text;el.hidden=false;
 if(who==='pet'){window.__bubbleStats.petCount++;window.__bubbleStats.lastPet=text;clearTimeout(petBubbleTimer);petBubbleTimer=setTimeout(()=>{el.hidden=true},ms)}
 else{window.__bubbleStats.heroCount++;window.__bubbleStats.lastHero=text;clearTimeout(heroBubbleTimer);heroBubbleTimer=setTimeout(()=>{el.hidden=true},ms)}
}
function vibrateGamepad(duration=140,weak=.25,strong=.45){
 window.__gamepadStats.rumbleCount++;
 try{
  const pads=navigator.getGamepads?navigator.getGamepads():[];
  for(const gp of pads){
   if(gp&&gp.connected&&gp.vibrationActuator?.playEffect){
    gp.vibrationActuator.playEffect('dual-rumble',{startDelay:0,duration,weakMagnitude:weak,strongMagnitude:strong}).catch(()=>{});
   }
  }
 }catch{}
}
function terrainLift(scene,x,y=755){
 const centerDais=Math.exp(-Math.pow((x-800)/225,2));
 if(scene===0)return -11.5*centerDais+Math.sin((x-245)/180)*1.8;
 if(scene===1){
  const streamDip=x<455?Math.min(6.5,(455-x)*.032):0;
  return -14.5*centerDais+streamDip;
 }
 if(scene===2){
  const poolCurve=(x<525||x>1075)?3.8:0;
  return -15.5*centerDais+poolCurve+(y>782?2.2:0);
 }
 if(scene===3){
  const poolDip=(x<480||x>1120)?4.2:0;
  return -13.8*centerDais+poolDip;
 }
 return -12.5*centerDais;
}
function getSurfaceMaterial(scene,x,y=755){
 if((scene===1&&x<455)||(scene===2&&(x<525||x>1075||y>784))||(scene===3&&(x<480||x>1120)))return 'water';
 if(Math.abs(x-800)<195)return 'bronze';
 return 'stone';
}
function syncChapterAudio(){
 window.__audioStats.chapterProfile=state.scene;
 if(!ctxAudio||!ambientNodes)return;
 try{
  const now=ctxAudio.currentTime;
  const profiles=[
   {f1:55,f2:82.41,f3:110,filt:250,lfo:.13,delay:.18,fb:.24},
   {f1:65.41,f2:98.00,f3:130.81,filt:395,lfo:.25,delay:.21,fb:.33},
   {f1:49.00,f2:73.42,f3:98.00,filt:210,lfo:.10,delay:.26,fb:.42},
   {f1:58.27,f2:87.31,f3:116.54,filt:320,lfo:.18,delay:.24,fb:.38},
   {f1:73.42,f2:110.00,f3:146.83,filt:480,lfo:.08,delay:.14,fb:.18}
  ];
  const p=profiles[state.scene]||profiles[0];
  ambientNodes.a.frequency.setTargetAtTime(p.f1,now,.35);
  ambientNodes.b.frequency.setTargetAtTime(p.f2,now,.35);
  ambientNodes.c.frequency.setTargetAtTime(p.f3,now,.35);
  ambientNodes.filt.frequency.setTargetAtTime(p.filt,now,.35);
  ambientNodes.lfo.frequency.setTargetAtTime(p.lfo,now,.35);
  ambientNodes.delay.delayTime.setTargetAtTime(p.delay,now,.25);
  ambientNodes.fb.gain.setTargetAtTime(p.fb,now,.35);
 }catch{}
}
let loaded=readSave();if(loaded)$('#continueBtn').hidden=false;
const player=$('#player');
const hero=new PaintedHero(player);
function showWalkMark(x,y){const m=$('#walkMark');if(!m)return;m.hidden=true;void m.offsetWidth;m.style.left=`${x}px`;m.style.top=`${y}px`;m.hidden=false;clearTimeout(walkMarkTimer);walkMarkTimer=setTimeout(()=>{m.hidden=true},680)}
 const companion=new BronzeCompanion({
 world:$('#world'),
 player,
 onPat:()=>{hero.react('pet');sound('pet');sayBubble('pet','呼噜… ♡',2400);sayBubble('hero','真乖，别怕。',2400);vibrateGamepad(85,.15,.25);toast('小家伙蹭了蹭你的手，安心地陪在身边。')},
 onRequestPat:()=>{
  if(mode!=='play')return;
  const dist=Math.hypot(state.x-companion.x,state.y-companion.y);
  if(dist>105){
   const side=state.x<companion.x?-1:1;
   target={x:Math.max(245,Math.min(1355,companion.x+side*64)),y:Math.max(690,Math.min(812,companion.y-18))};
   pending='companion';
   companion.prepareGreet(state);
   showWalkMark(target.x,target.y);
   return;
  }
  if(Math.abs(companion.x-state.x)>6){turn=companion.x<state.x?-1:1;player.classList.toggle('facing-left',turn<0)}
  companion.pat(state);
  placePlayer();
 },
 onGuardChange:active=>{
  $('#coopPad')?.classList.toggle('active',Boolean(active));
  $('#world')?.classList.toggle('coop-active',Boolean(active));
  const label=$('#coopPad .pad-label');
  if(label)label.textContent=active?'🐾 伙伴驻守共鸣中 · 点击唤回':'共生副铜环 · 让伙伴驻守共鸣';
  if(active&&mode==='play'){sound('coop');sayBubble('pet','汪！♪（守好铜环）',3000);vibrateGamepad(140,.25,.45);toast('法斗端坐在副铜环上，青铜音脉已导通！现在去拨动机关会获得共鸣提示。')}
 },
 onScentReached:()=>{
  const rId=scenes[state.scene]?.relic;
  if(rId&&!state.relics.includes(rId)&&mode==='play'){
   sound('pet');
   sayBubble('pet','嗅嗅… ✦ 这里有微光！',3200);
   toast('法斗在暗处嗅到了「'+relics[rId].title.split(' · ')[0]+'」！点击微光处前往调查。');
  }
 }
});
function resize(){const scale=Math.min(innerWidth/1600,innerHeight/900);$('#stage').style.transform=`scale(${scale})`}
addEventListener('resize',resize);resize();
function save(){if(mode==='menu')return;try{localStorage.setItem(KEY,JSON.stringify({...state,version:1}))}catch{toast('浏览器未允许保存；本次仍可继续游玩。')}}
function sound(type){
 window.__audioStats.count++;window.__audioStats.lastType=type;
 if(state.muted)return;
 try{
  if(!ctxAudio){
   ctxAudio=new (window.AudioContext||window.webkitAudioContext)();
   const a=ctxAudio.createOscillator(),b=ctxAudio.createOscillator(),c=ctxAudio.createOscillator(),lfo=ctxAudio.createOscillator(),lfoGain=ctxAudio.createGain(),filt=ctxAudio.createBiquadFilter(),gain=ctxAudio.createGain();
   a.type='sine';b.type='sine';c.type='triangle';
   a.frequency.value=55;b.frequency.value=82.41;c.frequency.value=110;
   filt.type='bandpass';filt.frequency.value=260;filt.Q.value=3.2;
   lfo.frequency.value=.14;lfoGain.gain.value=95;lfo.connect(filt.frequency);
   gain.gain.value=.008;
   a.connect(gain);b.connect(gain);c.connect(filt);filt.connect(gain);gain.connect(ctxAudio.destination);
   a.start();b.start();c.start();lfo.start();
   const delay=ctxAudio.createDelay(.6),fb=ctxAudio.createGain(),wet=ctxAudio.createBiquadFilter();
   delay.delayTime.value=.19;fb.gain.value=.26;wet.type='lowpass';wet.frequency.value=1350;
   delay.connect(wet);wet.connect(fb);fb.connect(delay);wet.connect(ctxAudio.destination);
   ambient=gain;reverbBus=delay;ambientNodes={a,b,c,filt,lfo,delay,fb,wet};window.__audioStats.hasReverb=true;syncChapterAudio();
  }
  ctxAudio.resume();
  const now=ctxAudio.currentTime;
  if(type==='step'){
   const surf=getSurfaceMaterial(state.scene,state.x,state.y);
   window.__audioStats.surface=surf;
   if(surf==='water'){
    [[140,82,.11,.022,'sine'],[265,410,.15,.014,'sine']].forEach(([f0,f1,dur,amp,wType],idx)=>{
     const o=ctxAudio.createOscillator(),v=ctxAudio.createGain();
     o.type=wType;o.frequency.setValueAtTime(f0,now+idx*.022);
     o.frequency.exponentialRampToValueAtTime(f1,now+idx*.022+dur);
     v.gain.setValueAtTime(.0001,now+idx*.022);
     v.gain.linearRampToValueAtTime(amp,now+idx*.022+.012);
     v.gain.exponentialRampToValueAtTime(.0001,now+idx*.022+dur);
     o.connect(v);v.connect(ctxAudio.destination);if(reverbBus)v.connect(reverbBus);
     o.start(now+idx*.022);o.stop(now+idx*.022+dur+.02);
    });
    return;
   }
   if(surf==='bronze'){
    [[122,74,.11,.024,'triangle'],[366,348,.16,.009,'sine']].forEach(([f0,f1,dur,amp,wType])=>{
     const o=ctxAudio.createOscillator(),v=ctxAudio.createGain();
     o.type=wType;o.frequency.setValueAtTime(f0,now);
     o.frequency.exponentialRampToValueAtTime(f1,now+dur);
     v.gain.setValueAtTime(.0001,now);
     v.gain.linearRampToValueAtTime(amp,now+.01);
     v.gain.exponentialRampToValueAtTime(.0001,now+dur);
     o.connect(v);v.connect(ctxAudio.destination);if(reverbBus)v.connect(reverbBus);
     o.start(now);o.stop(now+dur+.02);
    });
    return;
   }
  }
  const config={pet:[300,.19,.018],step:[105,.09,.024],look:[520,.3,.024],coop:[587.33,.52,.026],optical:[659.25,.58,.025],bell:[660,.62,.022],chimeMicro:[880,.75,.011],water:[248,.38,.02],turn:[196,.18,.034],solve:[440,1.25,.042],door:[64,1.4,.052],end:[330,3,.038]};
  const [f,d,g]=config[type]||config.look;
  const isChime=['coop','bell','chimeMicro','optical','solve','end'].includes(type);
  const partials=isChime?[1,2.76,4.72]:[1];
  partials.forEach((ratio,idx)=>{
   const o=ctxAudio.createOscillator(),v=ctxAudio.createGain();
   o.type=type==='door'?'triangle':'sine';
   const freq=f*ratio,amp=g/(idx===0?1:idx===1?2.8:5.5),dur=d/(idx===0?1:1.35);
   o.frequency.setValueAtTime(freq,now);
   o.frequency.exponentialRampToValueAtTime(isChime?freq*(idx===0?1.25:1.02):freq*.58,now+dur);
   v.gain.setValueAtTime(0,now);
   v.gain.linearRampToValueAtTime(amp,now+.014);
   v.gain.exponentialRampToValueAtTime(.0001,now+dur);
   o.connect(v);v.connect(ctxAudio.destination);
   if(reverbBus&&(isChime||type==='step'||type==='water'))v.connect(reverbBus);
   o.start(now);o.stop(now+dur+.03);
  });
  if(type==='end'){
   const notes=[[261.63,0,.95],[293.66,.38,.95],[329.63,.76,1.05],[392.00,1.18,1.15],[440.00,1.62,1.25],[523.25,2.10,2.2]];
   window.__audioStats.melodyNotes=notes.length;
   notes.forEach(([nf,offset,nd])=>{
    [1,2.76,4.72].forEach((r,idx)=>{
     const o=ctxAudio.createOscillator(),v=ctxAudio.createGain(),t0=now+offset;
     o.type='sine';o.frequency.setValueAtTime(nf*r,t0);
     o.frequency.exponentialRampToValueAtTime(nf*r*1.008,t0+nd);
     const amp=.022/(idx===0?1:idx===1?2.9:5.8);
     v.gain.setValueAtTime(.0001,t0);
     v.gain.linearRampToValueAtTime(amp,t0+.018);
     v.gain.exponentialRampToValueAtTime(.0001,t0+nd);
     o.connect(v);v.connect(ctxAudio.destination);
     if(reverbBus)v.connect(reverbBus);
     o.start(t0);o.stop(t0+nd+.04);
    });
   });
  }
 }catch{}
}
function toast(msg){$('#toast').textContent=msg;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3800)}
function updateButtons(){$('#bagCount').textContent=state.clues.length;$('#muteBtn').innerHTML=`${state.muted?'♫':'♪'} <span>${state.muted?'已静音':'声音开'}</span>`;$('#flashBtn').innerHTML=`◉ <span>${state.flash?'手电开':'手电关'}</span>`;player.classList.toggle('flash-off',!state.flash);$('#world').classList.toggle('flash-off',!state.flash);$('#lightbeam').hidden=!state.flash;if(ambient)ambient.gain.value=state.muted?0:.008;updateCoopElements()}
function updateCoopElements(){
 const s=scenes[state.scene];if(!s)return;
 const padEl=$('#coopPad'),scentEl=$('#scentSpot'),linkEl=$('#coopLink'),coopPath=$('#coopPath'),scentPath=$('#scentPath'),optEl=$('#opticalGlyph');
 const showPad=Boolean(s.pad&&!state.solved[state.scene]);
 if(padEl){
  padEl.hidden=!showPad;
  if(showPad){padEl.style.left=`${s.pad.x}px`;padEl.style.top=`${s.pad.y}px`;padEl.classList.toggle('active',Boolean(companion.guardTarget&&companion.guardSettled))}
 }
 const rId=s.relic,rel=rId?relics[rId]:null;
 const showScent=Boolean(rel&&!state.relics.includes(rId)&&(!state.flash||companion.scentTarget||companion.scentReached));
 if(scentEl){
  scentEl.hidden=!showScent;
  if(showScent){scentEl.style.left=`${rel.x}px`;scentEl.style.top=`${rel.y}px`}
 }
 if(optEl&&s.optical){
  const revealed=(state.optical||[]).includes(state.scene);
  optEl.hidden=!state.flash&&!revealed;
  optEl.style.left=`${s.optical.x}px`;optEl.style.top=`${s.optical.y}px`;
  optEl.classList.toggle('revealed',revealed);
  const sym=optEl.querySelector('.glyph-symbol'),txt=optEl.querySelector('.glyph-text');
  if(sym)sym.textContent=s.optical.sym;
  if(txt)txt.textContent=revealed?s.optical.label:'手电照射 · 光学暗刻';
 }
 if(linkEl){
  linkEl.hidden=!(showPad||showScent);
  if(coopPath)coopPath.setAttribute('d',showPad?s.pad.path:'');
  if(scentPath&&rel)scentPath.setAttribute('d',showScent?`M${Math.round(companion.x)} ${Math.round(companion.y)} Q${Math.round((companion.x+rel.x)/2)} ${Math.round(Math.min(companion.y,rel.y)-28)} ${rel.x} ${rel.y}`:'');
 }
 $('#world')?.classList.toggle('scent-active',showScent);
}
function revealOptical(sceneIdx){
 const s=scenes[sceneIdx];if(!s||!s.optical)return;
 if(!Array.isArray(state.optical))state.optical=[];
 const isNew=!state.optical.includes(sceneIdx);
 if(isNew){
  state.optical.push(sceneIdx);
  hero.react('curious');companion.react('curious');
  sound('optical');save();updateCoopElements();
 }else sound('look');
 toast(s.optical.text);
}
function setPuzzleFocus(fx,fy){
 const w=$('#world');if(!w)return;
 w.style.setProperty('--focus-x',`${fx}%`);
 w.style.setProperty('--focus-y',`${fy}%`);
 w.classList.add('puzzle-focus');
 $('#modal')?.classList.add('tactile-mode');
}
function updateTreeBranches(){
 const targets=[3,2,4];
 [0,1,2].forEach(idx=>{
  const el=$(`#treeBranch${idx}`);
  if(el)el.classList.toggle('lit',Boolean(state.solved[1]||state.dials[idx]===targets[idx]));
 });
}
function updateChimeFlow(){
 const targets=[3,5,2];
 const solved=Boolean(state.solved[3]);
 [0,1,2].forEach(idx=>{
  const el=$(`#chimeBell${idx}`);
  if(el)el.classList.toggle('lit',Boolean(solved||state.chimes[idx]===targets[idx]));
 });
 const arc=$('#starBridgeArc');
 if(arc)arc.classList.toggle('lit',solved);
 $('#chimeFlow')?.classList.toggle('bridge-ready',solved);
}
function wheelInner(main,sub,spokes=3){
 const ticks=Array.from({length:spokes},(_,k)=>{const a=(k*360/spokes)*Math.PI/180,x1=(68+Math.sin(a)*46).toFixed(1),y1=(68-Math.cos(a)*46).toFixed(1),x2=(68+Math.sin(a)*58).toFixed(1),y2=(68-Math.cos(a)*58).toFixed(1),cx=(68+Math.sin(a)*52).toFixed(1),cy=(68-Math.cos(a)*52).toFixed(1);return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#e7d9a4" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="3.2" fill="#9ef0c8"/>`}).join('');
 return `<svg class="wheel-svg" viewBox="0 0 136 136" aria-hidden="true"><circle cx="68" cy="68" r="63" fill="none" stroke="#c9bc8855" stroke-width="1.5" stroke-dasharray="4 6"/><g class="wheel-rotor"><circle cx="68" cy="68" r="52" fill="none" stroke="#d8ca9688" stroke-width="6" stroke-dasharray="16 10"/><circle cx="68" cy="68" r="41" fill="none" stroke="#8de8be44" stroke-width="1.5"/>${ticks}</g></svg><span class="wheel-core"><span class="wheel-sym">${main}</span><small>${sub}</small></span>`;
}
function renderScene(){
 companion.syncScene(state.scene,{x:state.x,y:state.y,facing:turn});
 syncChapterAudio();
 const s=scenes[state.scene];
 $('#backdrop').src=['assets/painterly/hall.webp','assets/painterly/tree.webp','assets/painterly/vault-clean.webp','assets/painterly/chime.webp','assets/painterly/dawn.webp'][state.scene];
 $('#backdrop').alt=s.name;
 $('#ritualPlate').hidden=state.scene!==1;
 $('#treeFlow').hidden=state.scene!==1;
 updateTreeBranches();
 $('#chimeFlow').hidden=state.scene!==3;
 updateChimeFlow();
 $('#floatingMask').hidden=state.scene!==2;
 $('#eyeLight').hidden=state.scene!==2;
 const hug=$('#celebrationHug');
 if(hug){
  hug.hidden=state.scene!==4;
  hug.style.left='800px';
  hug.style.top='738px';
 }
 $('#chapterNo').textContent=`FIELD RECORD / 0${state.scene+1}`;
 $('#chapterName').textContent=s.name;
 $('#goal').textContent=state.solved[state.scene]?(state.scene===4?'与伙伴在朝阳云海中庆祝通关！':state.scene===3?'星桥已构筑，可前往破晓观星台':state.scene===2?'青铜之眼已唤醒，可深入星璇长廊':'机关已解开，继续深入遗迹'):s.goal;
 const dialIds=['sunDial','birdDial','branchDial'];
 $('#hotspots').innerHTML=s.points.map(([id,x,y,label])=>{
  const dIdx=dialIds.indexOf(id);
  const text=dIdx>=0?`${label} · ${state.dials[dIdx]}`:label;
  return `<button class="hotspot ${state.clues.includes(id)?'seen':''} ${['door','final','passage','bridgeDais','dawnAltar'].includes(id)?'gate':''}" data-id="${id}" aria-label="调查${label}" style="left:${x}px;top:${y}px"><span class="diamond"></span><span class="label">${text}</span></button>`;
 }).join('');
 $('#envSpots').innerHTML=(s.env||[]).map(([id,x,y,label])=>`<button type="button" class="env-spot" data-env="${id}" aria-label="观察${label}" style="left:${x}px;top:${y}px"><span class="ring"></span><span class="env-label">观察 · ${label}</span></button>`).join('');
 $('#world').classList.toggle('awake',state.solved[state.scene]);
 updateButtons();
 placePlayer();
}
function placePlayer(){const lift=terrainLift(state.scene,state.x,state.y);window.__reflectionStats.terrainLift=Number(lift.toFixed(2));const scale=.68+(state.y-660)/700;player.style.left=`${state.x-78}px`;player.style.top=`${state.y-305+lift}px`;player.style.transform=`scale(${scale})`;const petLift=terrainLift(state.scene,companion.x,companion.y);if(companion?.el)companion.el.style.top=`${companion.y-132.125+petLift}px`;const hb=$('#heroBubble'),pb=$('#petBubble');if(hb){hb.style.left=`${state.x}px`;hb.style.top=`${state.y-295+lift}px`}if(pb){pb.style.left=`${companion.x}px`;pb.style.top=`${companion.y-135+petLift}px`}const pose=player.dataset.heroAction||'idle';const beamY=pose==='investigate'?-262:pose==='curious'?-276:pose==='wonder'?-284:-270;const baseAngle=pose==='investigate'?7*turn:pose==='curious'?-4*turn:pose==='wonder'?-9*turn:0;const totalAngle=Math.max(-26,Math.min(26,baseAngle+aimAngle));const torchX=state.x+45*turn,torchY=state.y+beamY+lift;$('#lightbeam').style.left=`${torchX}px`;$('#lightbeam').style.top=`${torchY}px`;$('#lightbeam').style.transform=`scaleX(${turn}) rotate(${totalAngle}deg)`;const spot=$('#flashSpot');if(spot){spot.style.left=`${pointerX}px`;spot.style.top=`${pointerY}px`}const w=$('#world');if(w){w.style.setProperty('--torch-x',`${Math.round(torchX)}px`);w.style.setProperty('--torch-y',`${Math.round(state.y-165+lift)}px`);w.style.setProperty('--aim-x',`${Math.round(pointerX)}px`);w.style.setProperty('--aim-y',`${Math.round(pointerY)}px`);w.style.setProperty('--pet-x',`${Math.round(companion.x)}px`);w.style.setProperty('--pet-y',`${Math.round(companion.y-35+petLift)}px`)}}
function start(continuing=false){const fresh=continuing?(readSave()||loaded):null;if(fresh)state={...defaultState(state.muted),...fresh};else state=defaultState(state.muted);turn=1;darkClock=0;opticalClock=0;awakeningStart=0;previewTrueEnding=false;hero.reset(state.x,state.y,state.scene);companion.reset(state.scene,{x:state.x,y:state.y,facing:turn});player.classList.remove('facing-left');mode='play';$('#menu').hidden=true;$('#ending').hidden=true;renderScene();sound('look');save();if(state.ended){finish(true);return}sayBubble('hero','信号就在门后，先四处看看。',2800);sayBubble('pet','汪！（竖起耳朵）',2800);toast(continuing?'已恢复田野记录。':'林悦：信号就在门后。先看看这里留下了什么。')}
$('#startBtn').onclick=()=>start();$('#continueBtn').onclick=()=>start(true);
function openModal(tag,title,content,modalMode='modal'){mode=modalMode;keys.clear();target=null;pending=null;player.classList.remove('walking');$('#modal').classList.remove('tactile-mode','journal-mode');$('#world')?.classList.remove('puzzle-focus');$('#modalTag').textContent=tag;$('#modalTitle').textContent=title;$('#modalContent').innerHTML=content;$('#modal').hidden=false;$('#closeModal').focus();}
function closeModal(){$('#modal').hidden=true;$('#modal').classList.remove('tactile-mode','journal-mode');$('#world')?.classList.remove('puzzle-focus');mode=$('#ending').hidden?'play':'ending';player.classList.remove('investigating');keys.clear();save()}
$('#closeModal').onclick=closeModal;
function discover(id){const c=clues[id];if(!c)return;if(!state.clues.includes(id)){state.clues.push(id);hero.react('discovery');companion.react('curious');sayBubble('hero','记进田野手记了。',2600);player.classList.remove('discover');void player.offsetWidth;player.classList.add('discover');sound('look');save();renderScene()}player.classList.add('investigating');placePlayer();openModal(c.tag,c.title,`<p>${c.text}</p><p class="inscription">${c.quote}</p><p>${c.note}</p><p class="note">✦ 已收录田野手记 · 随时按 Tab 查看</p><button class="action" id="leaveNote">收好记录，继续调查 →</button>`);$('#leaveNote').onclick=closeModal}
function discoverRelic(id){const r=relics[id];if(!r)return;if(!state.relics.includes(id)){state.relics.push(id);if(id==='amberBell'&&state.doorSlots[0]===null)state.doorSlots[0]=0;if(id==='jadeLeaf'&&!state.solved[1])state.dials[0]=3;if(id==='bronzeEcho'&&!state.solved[2])state.eyes[0]=3;companion.clearScent();hero.react('discovery');companion.react('happy');sayBubble('hero','干得漂亮，小家伙！',2800);sayBubble('pet','汪呜～ ★',2800);vibrateGamepad(180,.3,.55);player.classList.remove('discover');void player.offsetWidth;player.classList.add('discover');sound('coop');save();renderScene()}player.classList.add('investigating');placePlayer();openModal(r.tag,r.title,`<p>${r.text}</p><p class="inscription">${r.quote}</p><p>${r.note}</p><p class="note">🐾 已载入「伙伴共情发现」· 机关首项刻度已产生共鸣</p><button class="action" id="leaveNote">摸摸伙伴，收好遗物 →</button>`);$('#leaveNote').onclick=closeModal}
function journal(){
 const valid=state.clues.filter(id=>clues[id]);if(valid.length!==state.clues.length){state.clues=valid;save()}
 const validRelics=(state.relics||[]).filter(id=>relics[id]);
 const optList=(state.optical||[]).filter(n=>scenes[n]?.optical);
 const c1=valid.includes('stele')||optList.includes(0),c2=valid.includes('relief')||optList.includes(1),c3=valid.includes('return')||valid.includes('eyes')||optList.includes(2);
 const c4=valid.includes('chimeStele')||valid.includes('astrolabe')||optList.includes(3),c5=valid.includes('dawnMemorial')||valid.includes('houndRelief')||optList.includes(4);
 const rubbingSvg=`<svg class="rubbing-svg" viewBox="0 0 360 210" aria-label="古蜀青铜拓片与推理图谱"><rect width="360" height="210" fill="#08181a"/><g stroke="#c8bc8a33" stroke-width="1" fill="none"><circle cx="48" cy="62" r="28"/><circle cx="114" cy="62" r="28"/><circle cx="180" cy="62" r="28"/><circle cx="246" cy="62" r="28"/><circle cx="312" cy="62" r="28"/><path d="M16 148H344"/></g><g opacity="${c1?1:.32}" stroke="#ecdca4" fill="none" stroke-width="1.5"><circle cx="48" cy="52" r="8"/><path d="M34 66Q48 56 62 66M40 76L56 76"/><text x="48" y="108" fill="#e9dbb0" font-size="8.5" text-anchor="middle" stroke="none">I. ☀→羽→枝</text></g><g opacity="${c2?1:.32}" stroke="#9ef0ca" fill="none" stroke-width="1.5"><path d="M114 40V82M100 52Q114 44 128 52M96 68Q114 58 132 68"/><text x="114" y="108" fill="#b8ebd4" font-size="8.5" text-anchor="middle" stroke="none">II. 日3·鸟2·枝4</text></g><g opacity="${c3?1:.32}" stroke="#f3d89c" fill="none" stroke-width="1.5"><path d="M162 58Q171 46 180 58Q189 46 198 58Q189 74 180 74Q171 74 162 58Z"/><circle cx="172" cy="58" r="2.2" fill="#f3d89c"/><circle cx="188" cy="58" r="2.2" fill="#f3d89c"/><text x="180" y="108" fill="#f3e1b6" font-size="8.5" text-anchor="middle" stroke="none">III. 逆3·4</text></g><g opacity="${c4?1:.32}" stroke="#a8e6ff" fill="none" stroke-width="1.5"><path d="M236 44H256M246 44V76M238 72Q246 80 254 72"/><circle cx="246" cy="58" r="3" fill="#a8e6ff"/><text x="246" y="108" fill="#c4efff" font-size="8.5" text-anchor="middle" stroke="none">IV. 宫3·羽5·商2</text></g><g opacity="${c5?1:.32}" stroke="#ffdf94" fill="none" stroke-width="1.5"><circle cx="312" cy="58" r="12"/><path d="M312 40V46M312 70V76M294 58H300M324 58H330"/><text x="312" y="108" fill="#ffe9b8" font-size="8.5" text-anchor="middle" stroke="none">V. 破晓相守</text></g><text x="20" y="172" fill="#d8cca0" font-size="11">✦ 拓片复原度：${Math.round((valid.length/12)*100)}%（线索 ${valid.length}/12 · 秘宝 ${validRelics.length}/5）</text><text x="20" y="192" fill="#9ecab8" font-size="10">◉ 光学显影：${optList.length ? optList.map(n=>scenes[n].optical.sym).join(' ／ ') : '手电照射门楣、铜干、巨面、编钟与破晓金门可显影暗刻'}</text></svg>`;
 const relicHtml=validRelics.length?`<div class="coop-journal"><p class="note">🐾 伙伴嗅探发现（${validRelics.length} / 5）</p>${validRelics.map(id=>`<div class="coop-banner active"><strong>${relics[id].title}</strong><br>${relics[id].record}</div>`).join('')}</div>`:`<p class="note">🐾 伙伴协作提示：关闭手电（F）可让法斗在暗处嗅探隐藏遗物；点击地面「共生副铜环」可让它驻守导通机关共鸣。</p>`;
 const notesHtml=(valid.length?`<div class="evidence">${valid.map(id=>`<section><h3>${clues[id].title}</h3><p>${clues[id].record}</p></section>`).join('')}</div>`:'<p>手记还是空白。走近物品按 E，或直接点击场景中的调查标记。</p>')+relicHtml;
 openModal('FIELD JOURNAL / 林悦的考古拓片与手记','被青铜保存的线索',`<div class="journal-book"><div class="journal-sketch-page"><h4>古蜀青铜拓片与星图手绘页</h4>${rubbingSvg}<div class="optical-summary">手电光学金文（${optList.length} / 5）：${optList.length?optList.map(n=>scenes[n].optical.label).join(' · '):'尚未用光束显影石壁暗刻'}</div><div class="paw-seal"><span>林悦田野速写本 · 编号 SC-05</span><b>🐾 伙伴随行签章（已盖爪印）</b></div></div><div class="journal-notes-page">${notesHtml}</div></div>`);
 $('#modal')?.classList.add('journal-mode');
}
function feedback(msg){$('#puzzleResult').textContent=msg;sound('turn')}
function evidenceBrief(ids){return `<p class="note">手记摘录：${ids.filter(id=>state.clues.includes(id)&&clues[id]).map(id=>clues[id].record).join(' ')||'暂未找到相关线索，可关闭机关继续探索。'}</p>`}
function hints(arr){hintLevel=0;$('#hintBtn').onclick=()=>{sound('look');$('#hintText').textContent=arr[Math.min(hintLevel++,arr.length-1)]}}
function sequencePuzzle(final=false){
 const s=final?2:0,slotKey=final?'finalSlots':'doorSlots',expected=final?[2,1,0]:[0,1,2];
 if(state.solved[s]){if(final)changeScene(3);else changeScene(1);return}
 const values=Array.isArray(state[slotKey])?[...state[slotKey]]:[null,null,null],eyes=Array.isArray(state.eyes)?[...state.eyes]:[1,1];
 const degs=values.map(v=>v===null?0:(v+1)*120);
 const coopOn=Boolean(companion.guardTarget);
 const banner=coopOn?`<p class="coop-banner active">🐾 伙伴正在副铜环驻守导通音律 · 拨至正确刻度时将泛起金鸣共鸣光环</p>`:`<p class="coop-banner">◌ 协作提示：若点击地面「${scenes[s].pad.label}」让伙伴驻守，可在拨动时实时听音辨位</p>`;
 const renderDots=(val,shadow=false)=>`<div class="astrolabe-dots ${shadow?'shadow-dots':''}" aria-hidden="true">${[1,2,3,4,5].map(k=>`<i class="${k<=val?'on':''}"></i>`).join('')}</div>`;
 openModal(final?'CHAPTER III / 文明的记忆':'CHAPTER I / 青铜之门',final?'以光与影，唤醒记忆':'重排三个青铜符号',`<p>${final?'镜头已推进至记忆中枢。祭坛符号向内旋回，两枚目轮分别承接光与影。':'镜头已推进至青铜门环。三枚可转动铜环对应石碑记载的日出之序。'}</p>${banner}<p class="note">拟物青铜棘轮：点击圆盘顺时针拨动内环浮雕（太阳 → 飞鸟 → 树枝，刻度自动保留）</p><div class="slots">${[0,1,2].map(i=>`<button class="seq bronze-wheel ${coopOn&&values[i]===expected[i]?'resonating':''}" data-slot="${i}" style="--wheel-deg:${degs[i]}deg" aria-label="第${i+1}位符号">${values[i]===null?wheelInner('?',`第 ${i+1} 位`,3):wheelInner(symbols[values[i]],names[values[i]],3)}</button>`).join('')}</div>${final?`<div class="slots"><div class="eye-astrolabe"><p class="note">左目 · 光（太阳曜数）</p><div id="dots0">${renderDots(eyes[0],false)}</div><div class="stepper"><button data-eye="0" data-delta="-1" aria-label="左眼减一">−</button><b id="eye0" class="${coopOn&&eyes[0]===3?'resonating':''}">${eyes[0]}</b><button data-eye="0" data-delta="1" aria-label="左眼加一">+</button></div></div><div class="eye-astrolabe"><p class="note">右目 · 影（神木枝数）</p><div id="dots1">${renderDots(eyes[1],true)}</div><div class="stepper"><button data-eye="1" data-delta="-1" aria-label="右眼减一">−</button><b id="eye1" class="${coopOn&&eyes[1]===4?'resonating':''}">${eyes[1]}</b><button data-eye="1" data-delta="1" aria-label="右眼加一">+</button></div></div></div>`:''}${evidenceBrief(final?['mural','vessel','roots','return']:['stele'])}<p id="puzzleResult" class="result" role="status"></p><div class="puzzle-actions"><button id="submitPuzzle" class="action">${final?'唤醒青铜之眼':'叩响青铜之门'}</button><button id="hintBtn" class="hint">林悦的思考</button>${coopOn?'<button id="coopAssistBtn" class="hint">🐾 伙伴共鸣校准</button>':''}</div><p id="hintText" class="hint-text"></p>`);
 setPuzzleFocus(50,final?66:58);
 const syncResonance=()=>{
  if(final){$('#dots0').innerHTML=renderDots(eyes[0],false);$('#dots1').innerHTML=renderDots(eyes[1],true)}
  if(!companion.guardTarget)return;
  document.querySelectorAll('.seq').forEach((b,idx)=>b.classList.toggle('resonating',values[idx]===expected[idx]));
  if(final){$('#eye0')?.classList.toggle('resonating',eyes[0]===3);$('#eye1')?.classList.toggle('resonating',eyes[1]===4)}
 };
 document.querySelectorAll('.seq').forEach(b=>b.onclick=()=>{const i=+b.dataset.slot;values[i]=values[i]===null?0:(values[i]+1)%3;degs[i]+=120;state[slotKey]=[...values];b.innerHTML=wheelInner(symbols[values[i]],names[values[i]],3);b.style.setProperty('--wheel-deg',`${degs[i]}deg`);syncResonance();sound(coopOn&&values[i]===expected[i]?'coop':'turn');save()});
 document.querySelectorAll('[data-eye]').forEach(b=>b.onclick=()=>{const i=+b.dataset.eye;eyes[i]=(eyes[i]-1+Number(b.dataset.delta)+5)%5+1;state.eyes=[...eyes];$('#eye'+i).textContent=eyes[i];syncResonance();sound(coopOn&&eyes[i]===(i===0?3:4)?'coop':'turn');save()});
 if($('#coopAssistBtn'))$('#coopAssistBtn').onclick=()=>{
  const idx=expected.findIndex((exp,i)=>values[i]!==exp);
  if(idx>=0){values[idx]=expected[idx];degs[idx]+=120;state[slotKey]=[...values];const btn=document.querySelector(`[data-slot="${idx}"]`);if(btn){btn.innerHTML=wheelInner(symbols[values[idx]],names[values[idx]],3);btn.style.setProperty('--wheel-deg',`${degs[idx]}deg`)}}
  else if(final&&eyes[0]!==3){eyes[0]=3;state.eyes=[...eyes];$('#eye0').textContent='3';}
  else if(final&&eyes[1]!==4){eyes[1]=4;state.eyes=[...eyes];$('#eye1').textContent='4';}
  syncResonance();companion.react('happy');sound('coop');save();
  $('#puzzleResult').textContent='副铜环传来清越共鸣，法斗帮你校准了一处机关节点！';
 };
 hints(final?['归途需要逆读入口的顺序；双眼的数来自前两章。','左边映太阳，右边映树影。回看残器与树根记录。','符号：树枝、飞鸟、太阳。左眼 3，右眼 4。']:['读读前厅石碑，注意“日出、鸟醒、衔枝”的先后。','从光开始，再到天空，最后到生长之物。','依次选择：太阳 → 飞鸟 → 树枝。']);
 $('#submitPuzzle').onclick=()=>{const needed=final?['vessel','roots','return']:['stele','vessel','mural'];if(!needed.every(id=>state.clues.includes(id))){feedback('还缺少实地记录。先调查'+needed.filter(id=>!state.clues.includes(id)).map(id=>clues[id].title.split(' · ')[0]).join('、')+'。');return}const correct=expected.every((n,i)=>values[i]===n)&&(!final||eyes[0]===3&&eyes[1]===4);if(!correct){feedback('符号轻轻一震，又归于沉寂。顺序或目轮尚未对应。');return}state.solved[s]=true;companion.releaseGuard(true);hero.react('discovery');companion.react('happy');vibrateGamepad(260,.4,.75);sayBubble('hero',final?'青铜之眼苏醒了！':'青铜门打开了！',3200);sayBubble('pet','汪汪！✦',3200);sound('solve');save();closeModal();renderScene();if(final){toast('青铜之眼苏醒！星璇长廊之门已开启，调查长廊入口即可前往第四章。');sound('door')}else{toast('青铜门已开启。法斗欢快地迎上来，准备与你一同深入神树祭坛。');sound('door')}}
}
function dial(i){
 const targets=[3,2,4],targetVal=targets[i],coopOn=Boolean(companion.guardTarget);
 let deg=(state.dials[i]-1)*72;
 const banner=coopOn?`<p class="coop-banner active">🐾 伙伴正在祭坛副铜环驻守 · 转至正确节律（${targetVal}）时铜盘与神树枝脉将同步共鸣点亮</p>`:`<p class="coop-banner">◌ 协作提示：每调对一座铜盘，背景神树对应的铜枝能量流将立即点亮</p>`;
 openModal('CHAPTER II / 神树的节律',names[i]+'机关',`<p>镜头已聚焦至${names[i]}铜盘。每转过一格，石台便传来一次古蜀编钟泛音（刻度 1–5）。</p>${banner}<div class="dial-overview">${names.map((n,idx)=>`<span class="${idx===i?'active':''} ${state.dials[idx]===targets[idx]?'matched':''}">${n}：<b>${state.dials[idx]}</b> ${state.dials[idx]===targets[idx]?'✦':''}</span>`).join('')}</div><div class="slots"><button id="dialTurn" class="bronze-wheel ${state.dials[i]===targetVal?'matched':''} ${coopOn&&state.dials[i]===targetVal?'resonating':''}" style="--wheel-deg:${deg}deg" aria-label="转动${names[i]}机关">${wheelInner(state.dials[i],`点击转动 · ${names[i]}`,5)}</button></div>${evidenceBrief(['relief'])}<p id="puzzleResult" class="result" role="status"></p><p class="note">三处机关分别对应神树左脉、主干与右脉；全部点亮后神树将开启通道。</p><div class="puzzle-actions"><button id="dialDone" class="action">确定刻度，返回祭坛</button>${coopOn?'<button id="coopAssistBtn" class="hint">🐾 伙伴共鸣校准</button>':''}</div>`);
 setPuzzleFocus([27,50,72][i],61);
 const updateDialUi=()=>{
  const btn=$('#dialTurn');
  if(btn){
   btn.innerHTML=wheelInner(state.dials[i],`点击转动 · ${names[i]}`,5);
   btn.style.setProperty('--wheel-deg',`${deg}deg`);
   btn.classList.toggle('matched',state.dials[i]===targetVal);
   btn.classList.toggle('resonating',coopOn&&state.dials[i]===targetVal);
  }
  const spans=document.querySelectorAll('.dial-overview span');
  spans.forEach((sp,idx)=>{
   const matched=state.dials[idx]===targets[idx];
   sp.classList.toggle('matched',matched);
   sp.innerHTML=`${names[idx]}：<b>${state.dials[idx]}</b> ${matched?'✦':''}`;
  });
  renderScene();save();
 };
 $('#dialTurn').onclick=()=>{state.dials[i]=state.dials[i]%5+1;deg+=72;updateDialUi();sound(state.dials[i]===targetVal?'coop':'turn')};
 if($('#coopAssistBtn'))$('#coopAssistBtn').onclick=()=>{state.dials[i]=targetVal;deg+=72;updateDialUi();companion.react('happy');sound('coop');$('#puzzleResult').textContent=`神树副铜环传来清越共鸣，法斗帮你校准了${names[i]}刻度（${targetVal}），对应神树铜枝已点亮！`};
 $('#dialDone').onclick=()=>{closeModal();if(state.dials.join(',')==='3,2,4'&&state.clues.includes('relief')){if(!state.solved[1]){state.solved[1]=true;companion.releaseGuard(true);hero.react('discovery');companion.react('happy');vibrateGamepad(240,.35,.68);sayBubble('hero','神树三脉贯通了！',3200);sayBubble('pet','嗷呜～ ♪',3200);sound('solve');toast('三支铜枝全部亮起，祭坛打开了向下的通道。法斗摇着尾巴跑回你身边！');renderScene();save()}}else toast('机关已记录。铭版中藏着三种纹样的节律。')}
}
function chimePuzzle(){
 const targets=[3,5,2];
 const bellNames=['日轮大钟','飞羽大钟','神木大钟'];
 const scaleNames=['宫音（3）','羽音（5）','商音（2）'];
 const coopOn=Boolean(companion.guardTarget);
 const banner=coopOn?`<p class="coop-banner active">🐾 伙伴正在长廊副铜环驻守 · 转至正确节律（${targets.join(' · ')}）时编钟与星桥将同步金辉共鸣</p>`:`<p class="coop-banner">◌ 协作提示：结合潮音古碑与浑天仪线索，将三钟调谐至宫、羽、商之律</p>`;
 const renderChimeUi=()=>`
  <p>镜头已聚焦至古蜀编钟中枢。轻敲每口青铜大钟，即可在五声律（1–5）之间切换。</p>${banner}
  <div class="dial-overview">${bellNames.map((n,idx)=>`<span class="${state.chimes[idx]===targets[idx]?'matched':''}">${n}：<b>${state.chimes[idx]}</b> ${state.chimes[idx]===targets[idx]?'✦':''}</span>`).join('')}</div>
  <div class="slots">${[0,1,2].map(i=>`<button class="chime-bell-btn bronze-wheel ${state.chimes[i]===targets[i]?'matched':''} ${coopOn&&state.chimes[i]===targets[i]?'resonating':''}" data-chime="${i}" style="--wheel-deg:${(state.chimes[i]-1)*72}deg" aria-label="调谐${bellNames[i]}">${wheelInner(state.chimes[i],bellNames[i],5)}</button>`).join('')}</div>
  ${evidenceBrief(['chimeStele','astrolabe'])}
  <p id="puzzleResult" class="result" role="status"></p>
  <div class="puzzle-actions"><button id="chimeDone" class="action">${state.solved[3]?'星桥已构筑 · 前往破晓观星台 →':'导通星璇音律 · 构筑星桥'}</button><button id="hintBtn" class="hint">林悦的思考</button>${coopOn?'<button id="coopAssistBtn" class="hint">🐾 伙伴共鸣校准</button>':''}</div>
  <p id="hintText" class="hint-text"></p>
 `;
 openModal('CHAPTER IV / 星璇编钟长廊','青铜编钟古律',renderChimeUi());
 setPuzzleFocus(50,48);
 hints(['读读潮音古碑，注意“击日钟为宫，击鸟钟为羽，击枝钟为商”。','宫对应3，羽对应5，商对应2。','依次将三口大钟拨至：3、5、2。']);
 const syncBells=()=>{
  document.querySelectorAll('.chime-bell-btn').forEach((b,i)=>{
   b.innerHTML=wheelInner(state.chimes[i],bellNames[i],5);
   b.style.setProperty('--wheel-deg',`${(state.chimes[i]-1)*72}deg`);
   b.classList.toggle('matched',state.chimes[i]===targets[i]);
   b.classList.toggle('resonating',coopOn&&state.chimes[i]===targets[i]);
  });
  const spans=document.querySelectorAll('.dial-overview span');
  spans.forEach((sp,idx)=>{
   const matched=state.chimes[idx]===targets[idx];
   sp.classList.toggle('matched',matched);
   sp.innerHTML=`${bellNames[idx]}：<b>${state.chimes[idx]}</b> ${matched?'✦':''}`;
  });
  updateChimeFlow();
  save();
 };
 document.querySelectorAll('.chime-bell-btn').forEach(b=>{
  b.onclick=()=>{
   const i=+b.dataset.chime;
   state.chimes[i]=state.chimes[i]%5+1;
   syncBells();
   sound(state.chimes[i]===targets[i]?'coop':'bell');
  };
 });
 if($('#coopAssistBtn'))$('#coopAssistBtn').onclick=()=>{
  const idx=targets.findIndex((t,i)=>state.chimes[i]!==t);
  if(idx>=0){
   state.chimes[idx]=targets[idx];
   syncBells();
   companion.react('happy');
   sound('coop');
   $('#puzzleResult').textContent=`副铜环传来清脆共振，法斗帮你校准了${bellNames[idx]}（刻度 ${targets[idx]}）！`;
  }
 };
 $('#chimeDone').onclick=()=>{
  if(state.solved[3]){closeModal();changeScene(4);return}
  const isMatch=targets.every((t,i)=>state.chimes[i]===t);
  if(!isMatch){feedback('编钟之声略显杂乱，深壑上的星桥尚未凝聚。');return}
  state.solved[3]=true;
  companion.releaseGuard(true);
  hero.react('discovery');
  companion.react('happy');
  vibrateGamepad(260,.4,.75);
  sayBubble('hero','星桥通向破晓天际了！',3200);
  sayBubble('pet','嗷呜～ ♪（欢快摇尾）',3200);
  sound('solve');
  save();
  closeModal();
  renderScene();
  toast('三钟长鸣，虚空凝桥！前方青铜门已通向终章「破晓观星台」。');
 };
}
function inspectEnv(id){
 const d=(scenes[state.scene].env||[]).find(item=>item[0]===id);if(!d||mode!=='play')return;
 const [,x,y,label,pose,snd,effect,line]=d;
 if(Math.abs(x-state.x)>8){turn=x<state.x?-1:1;player.classList.toggle('facing-left',turn<0)}
 hero.react(pose||'curious');companion.react(pose==='wonder'?'wonder':'curious');
 if(id==='stream'||id==='lotusPool'){
  const vx=id==='stream'?Math.max(355,state.x+105):Math.min(1210,state.x-105);
  const vy=Math.max(720,Math.min(800,state.y+18));
  companion.playVignette('water-mirror',{x:vx,y:vy});
  sayBubble('hero','小心别踩湿了爪子。',3000);
  sayBubble('pet','？！（被水里的倒影吓了一跳）',3200);
  stepRipples.push({x:vx,y:vy+6,surf:'water',born:performance.now()});
 }else if(id==='maskGaze'){
  const vx=Math.max(290,Math.min(1310,state.x+turn*105));
  companion.playVignette('brave-guard',{x:vx,y:Math.max(710,Math.min(800,state.y+12))});
  sayBubble('hero','别紧张，那是千年前的纵目神像。',3200);
  sayBubble('pet','呜… 汪！（勇敢挡在你身前）',3200);
 }else if(id==='cloudSea'||id==='dawnSunGate'){
  const vx=Math.max(290,Math.min(1310,state.x+turn*85));
  companion.playVignette('chase-light',{x:vx,y:Math.max(710,Math.min(800,state.y+10))});
  sayBubble('hero','小家伙，看！阳光和云海！',3200);
  sayBubble('pet','汪呜～ ♡（迎着朝阳欢跳）',3200);
 }else{
  const vx=Math.max(290,Math.min(1310,state.x+turn*98));
  companion.playVignette('chase-light',{x:vx,y:Math.max(710,Math.min(800,state.y+14))});
  sayBubble('hero',`看看这处${label}。`,2600);
  sayBubble('pet','✦ 嗅嗅…',2600);
 }
 sound(snd||'look');placePlayer();
 if(effect){$('#world').dataset.pulse=effect;clearTimeout(pulseTimer);pulseTimer=setTimeout(()=>{delete $('#world').dataset.pulse},2200)}
 toast(line||`林悦仔细观察了${label}。`);
}
function interact(id){
 if(mode!=='play')return;
 const pt=scenes[state.scene].points.find(p=>p[0]===id);
 if(pt&&Math.abs(pt[1]-state.x)>8){turn=pt[1]<state.x?-1:1;player.classList.toggle('facing-left',turn<0);placePlayer()}
 if(clues[id])return discover(id);
 if(id==='door'){
  if(state.solved[0])changeScene(1);
  else sequencePuzzle(false);
 }else if(['sunDial','birdDial','branchDial'].includes(id)){
  dial(['sunDial','birdDial','branchDial'].indexOf(id));
 }else if(id==='passage'){
  if(state.solved[1])changeScene(2);
  else toast('通道仍被封住。先按计数铭版调整三个机关。');
 }else if(id==='final'){
  if(state.solved[2])changeScene(3);
  else sequencePuzzle(true);
 }else if(id==='chimeBells'||id==='bridgeDais'){
  if(state.solved[3])changeScene(4);
  else chimePuzzle();
 }else if(id==='dawnAltar'){
  finish();
 }else if(id==='back'){
  changeScene(state.scene-1);
 }
}
async function changeScene(next){
 mode='transition';keys.clear();target=null;pending=null;darkClock=0;sound('door');
 $('#transitionText').textContent=scenes[next].desc;
 $('#transition').hidden=false;
 await new Promise(r=>setTimeout(r,1500));
 state.scene=next;
 state.x=next?370:675;
 state.y=757;
 renderScene();
 save();
 $('#transition').hidden=true;
 mode='play';
 toast(scenes[next].desc);
 if(next===4){
  sayBubble('hero','小家伙，我们看，是日出！',3200);
  sayBubble('pet','汪呜！♡（兴奋地扑在你怀里）',3200);
 }
}
$('#celebrationHug').onclick=()=>{
 if(mode!=='play'&&mode!=='ending')return;
 sayBubble('hero','我们一起做到了！',3000);
 sayBubble('pet','呼噜噜… ♡ 汪！',3000);
 sound('pet');
 vibrateGamepad(180,.3,.5);
 finish();
};
function renderTrueEndingCard(){
 const box=$('#trueEndingCard');if(!box)return;
 const cCount=state.clues?.length||0,rCount=state.relics?.length||0,oCount=state.optical?.length||0;
 const isFull=cCount>=12&&rCount>=5&&oCount>=5;
 const showTrue=isFull||previewTrueEnding;
 box.classList.toggle('true-unlocked',showTrue);
 const svg=showTrue
  ? `<svg class="epilogue-svg" viewBox="0 0 600 135" aria-label="破晓真结局：林悦与法斗迎着朝阳走出古蜀遗迹"><defs><linearGradient id="dawnSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#2c4e42"/><stop offset="55%" stop-color="#585433"/><stop offset="100%" stop-color="#122624"/></linearGradient><radialGradient id="dawnSun" cx="50%" cy="32%" r="48%"><stop offset="0%" stop-color="#fff6c8" stop-opacity=".95"/><stop offset="45%" stop-color="#f2cf7d" stop-opacity=".45"/><stop offset="100%" stop-color="#f2cf7d" stop-opacity="0"/></radialGradient></defs><rect width="600" height="135" fill="url(#dawnSky)"/><circle cx="300" cy="44" r="64" fill="url(#dawnSun)"/><g stroke="#f6dfa466" stroke-width="1.2" fill="none"><circle cx="300" cy="44" r="24"/><circle cx="300" cy="44" r="38" stroke-dasharray="6 6"/><path d="M300 6V16M300 72V82M262 44H272M328 44H338M273 17L280 24M320 64L327 71M327 17L320 24M280 64L273 71"/></g><path d="M0 135L0 92Q110 74 220 104L220 135ZM600 135L600 88Q485 70 380 104L380 135Z" fill="#0d2022"/><path d="M180 135Q300 94 420 135Z" fill="#163231"/><g stroke="#f9e6a7" stroke-width="1.8" fill="none"><path d="M195 48Q203 40 211 48Q219 40 227 48"/><path d="M372 36Q380 28 388 36Q396 28 404 36"/><path d="M430 54Q436 48 442 54Q448 48 454 54"/></g><g transform="translate(274,72)"><circle cx="12" cy="10" r="6.5" fill="#f3e2b3"/><path d="M5 38L8 18H16L19 38Z" fill="#d99"/><rect x="7" y="18" width="10" height="20" rx="3" fill="#e5dec2"/><g transform="translate(28,20)"><ellipse cx="8" cy="11" rx="7" ry="5.5" fill="#2c2933"/><circle cx="12" cy="5" r="5" fill="#2c2933"/><path d="M9 1L11 5M14 1L15 5" stroke="#2c2933" stroke-width="2.2"/><ellipse cx="9" cy="10" rx="4" ry="2.5" fill="#e79bb0"/><circle cx="14" cy="9" r="1.8" fill="#f7df8b"/></g></g><text x="300" y="125" fill="#fff2c2" font-size="10.5" text-anchor="middle" letter-spacing="2">清晨 06:12 · 第一缕日光刺破岩缝，佩戴铜铃犬牌的小家伙向朝阳摇起了尾巴</text></svg>`
  : `<svg class="epilogue-svg" viewBox="0 0 600 135" aria-label="终章纪事：青铜神树与记忆星河苏醒"><rect width="600" height="135" fill="#08191c"/><circle cx="300" cy="66" r="52" fill="none" stroke="#9ef0c844" stroke-width="1.5" stroke-dasharray="5 5"/><path d="M300 112V34M300 78Q260 62 232 42M300 62Q340 46 368 28M300 92Q268 82 246 70M300 92Q332 82 354 70" stroke="#9ef2cc" stroke-width="2.4" fill="none"/><circle cx="232" cy="42" r="4" fill="#f5e29c"/><circle cx="368" cy="28" r="4" fill="#f5e29c"/><circle cx="300" cy="30" r="5.5" fill="#fff3c4"/><text x="300" y="124" fill="#b8dcc8" font-size="10.5" text-anchor="middle" letter-spacing="2">地下深处的记忆星河已点亮 · 收集全部伙伴秘宝与光学暗刻可解锁「破晓真结局」</text></svg>`;
 box.innerHTML=`<div class="epilogue-header"><span>${showTrue?'✦ 守望者真结局 · 破晓归途':'◉ 遗迹记忆画卷 · 星河初醒'}</span><span class="epilogue-badge">${isFull?'★ 100% 全收集达成':showTrue?'✦ 真结局预览模式':`收集进度：线索 ${cCount}/12 · 秘宝 ${rCount}/5 · 金文 ${oCount}/5`}</span></div>${svg}<p class="epilogue-caption">${showTrue?'「千年前的守望者将记忆封入青铜，千年后的林悦与小法斗带着晨光走出了石殿。」':'「神树与面具的记忆已经苏醒；星桥与破晓观星台展现了古蜀人与伙伴千年的相守。」'}</p>${!isFull?`<button type="button" id="toggleTrueEndingBtn" class="epilogue-toggle">${previewTrueEnding?'↺ 返回标准结局画卷':'✦ 预览全收集「破晓真结局」画卷'}</button>`:''}`;
 const btn=$('#toggleTrueEndingBtn');
 if(btn)btn.onclick=()=>{previewTrueEnding=!previewTrueEnding;sound('coop');renderTrueEndingCard()};
}
async function finish(immediate=false){
 state.ended=true;
 state.solved[2]=true;
 if(state.scene===4)state.solved[4]=true;
 awakeningStart=performance.now();
 companion.releaseGuard(true);
 hero.react('wonder');
 companion.react('wonder');
 save();
 mode='ending';
 keys.clear();
 target=null;
 pending=null;
 $('#world').classList.add('awake');
 updateCoopElements();
 renderTrueEndingCard();
 sound('end');
 if(!immediate&&state.scene!==4){
  toast('青铜之眼睁开了。千年的日光、金鸟与编钟正在苏醒……');
  await new Promise(r=>setTimeout(r,2800));
 }
 $('#ending').hidden=false;
 const relicNote=state.relics?.length?` · 伙伴嗅探秘宝 ${state.relics.length} / 5`:'';
 const optNote=state.optical?.length?` · 光学金文 ${state.optical.length} / 5`:'';
 $('#endStats').textContent=`田野记录 ${state.clues.length} / 12${relicNote}${optNote} · 调查用时 ${Math.max(1,Math.round(state.elapsed/60))} 分钟 · 记忆档案已保存`;
 const hugAgain=$('#hugAgainBtn'), roamDawn=$('#roamDawnBtn');
 if(hugAgain)hugAgain.onclick=()=>{
  sound('pet');
  vibrateGamepad(160,.25,.4);
  const hearts=$('#endingHugHearts');
  if(hearts){
   hearts.textContent='♡ ♡ ♡ 🐾 ✦ ★ 汪！ ♡ ♡ ♡';
   setTimeout(()=>{hearts.textContent='♡ ✦ 🐾 ✦ ♡'},2400);
  }
  toast('林悦抱紧小法斗，小家伙亲昵地蹭着她的脸颊，发出满足的呼噜声！');
 };
 if(roamDawn)roamDawn.onclick=()=>{
  $('#ending').hidden=true;
  mode='play';
  if(state.scene!==4)changeScene(4);
  toast('已返回破晓观星台，可与伙伴在晨光云海中漫步留念（随时点击日轮圣坛可重开结算）。');
 };
}
$('#restartBtn').onclick=()=>{openModal('新的田野记录','重新开始调查？','<p>这会清除本游戏的通关进度和手记，重新回到青铜神殿前厅。</p><button id="confirmRestart" class="action">确认重新开始</button><button id="cancelRestart" class="hint">保留这段记忆</button>');$('#confirmRestart').onclick=()=>{$('#modal').hidden=true;localStorage.removeItem(KEY);loaded=null;$('#continueBtn').hidden=true;start()};$('#cancelRestart').onclick=()=>{$('#modal').hidden=true;mode='ending'}};
$('#coopPad').onclick=e=>{
 if(mode!=='play')return;
 e.stopPropagation();
 const pad=scenes[state.scene].pad;if(!pad||state.solved[state.scene])return;
 if(companion.guardTarget){
  companion.releaseGuard();
  sound('pet');
  toast('你轻声招呼，法斗离开副铜环跑回你身边。');
  updateCoopElements();
  return;
 }
 if(Math.abs(pad.x-state.x)>8){turn=pad.x<state.x?-1:1;player.classList.toggle('facing-left',turn<0)}
 hero.react('curious');
 companion.guardPad(pad);
 sound('coop');
 placePlayer();
 updateCoopElements();
 toast(`林悦轻拍地面：「小家伙，帮我守住${pad.label}！」`);
};
$('#opticalGlyph').onclick=e=>{
 if(mode!=='play')return;
 e.stopPropagation();
 if(!state.flash){toast('需要先打开手电（F），用光束照射才能显影石壁暗刻。');return}
 const opt=scenes[state.scene]?.optical;if(!opt)return;
 pointerX=opt.x;pointerY=opt.y;
 if(Math.abs(opt.x-state.x)>8){turn=opt.x<state.x?-1:1;player.classList.toggle('facing-left',turn<0)}
 aimAngle=Math.max(-22,Math.min(22,(opt.y-(state.y-210))*.06));
 placePlayer();
 revealOptical(state.scene);
};
$('#stage').addEventListener('pointermove',e=>{
 const rect=$('#stage').getBoundingClientRect();if(!rect.width||!rect.height)return;
 pointerX=Math.max(0,Math.min(1600,(e.clientX-rect.left)/rect.width*1600));
 pointerY=Math.max(0,Math.min(900,(e.clientY-rect.top)/rect.height*900));
 if(mode==='play'&&state.flash){
  aimAngle=Math.max(-22,Math.min(22,Math.atan2(pointerY-(state.y-210),Math.abs(pointerX-state.x)+110)*180/Math.PI*.55));
 }
});
$('#scentSpot').onclick=e=>{
 if(mode!=='play')return;
 e.stopPropagation();
 const rId=scenes[state.scene].relic,rel=rId?relics[rId]:null;
 if(!rel)return;
 const tx=Math.max(245,Math.min(1355,rel.x)),ty=Math.max(690,Math.min(792,rel.y));
 if(Math.hypot(state.x-tx,state.y-ty)<65){discoverRelic(rId);return}
 target={x:tx,y:ty};pending=`relic:${rId}`;showWalkMark(tx,ty);
};
$('#hotspots').onclick=e=>{const b=e.target.closest('[data-id]');if(!b||mode!=='play')return;e.stopPropagation();const p=scenes[state.scene].points.find(p=>p[0]===b.dataset.id);target={x:Math.max(245,Math.min(1355,p[1])),y:Math.max(690,Math.min(792,p[2]+70))};pending=p[0];showWalkMark(target.x,target.y)};
$('#envSpots').onclick=e=>{const b=e.target.closest('[data-env]');if(!b||mode!=='play')return;e.stopPropagation();const d=(scenes[state.scene].env||[]).find(item=>item[0]===b.dataset.env);if(!d)return;const tx=Math.max(245,Math.min(1355,d[1])),ty=Math.max(690,Math.min(792,Math.max(695,d[2]+90)));if(Math.hypot(state.x-tx,state.y-ty)<65){inspectEnv(d[0]);return}target={x:tx,y:ty};pending=`env:${d[0]}`;showWalkMark(tx,ty)};
$('#world').onclick=e=>{if(mode!=='play'||e.target.closest('[data-id],[data-env],#companion,#coopPad,#scentSpot,#opticalGlyph'))return;const rect=$('#stage').getBoundingClientRect();if(!rect.width||!rect.height)return;const wx=(e.clientX-rect.left)/rect.width*1600,wy=(e.clientY-rect.top)/rect.height*900;const tx=Math.max(245,Math.min(1355,wx)),ty=Math.max(690,Math.min(812,wy));target={x:tx,y:ty};pending=null;showWalkMark(tx,ty)};
function nearest(){return scenes[state.scene].points.map(p=>({id:p[0],name:p[3],d:Math.hypot(state.x-p[1],(state.y-Math.max(690,Math.min(792,p[2]+70)))*1.3)})).sort((a,b)=>a.d-b.d)[0]}
$('#companionBtn').onclick=()=>{if(mode==='play'){const uncollected=scenes[state.scene].points.find(([id])=>clues[id]&&!state.clues.includes(id));companion.call(uncollected?uncollected[1]:null);updateCoopElements();if(Math.abs(companion.x-state.x)>6){turn=companion.x<state.x?-1:1;player.classList.toggle('facing-left',turn<0)}hero.react('curious');sayBubble('hero',uncollected?`去看看${uncollected[3]}那边？`:'过来这边，小家伙。',2600);sayBubble('pet','汪！🐾',2500);placePlayer();toast(uncollected?`你轻声招呼，法斗跑来蹭了蹭你，又朝「${uncollected[3]}」方向竖起耳朵。`:'你轻声招呼，法斗摇摇晃晃地跑了过来。')}};
$('#bagBtn').onclick=()=>{if(mode==='play')journal()};$('#flashBtn').onclick=()=>{state.flash=!state.flash;if(state.flash)darkClock=0;updateButtons();save()};$('#muteBtn').onclick=()=>{state.muted=!state.muted;updateButtons();if(!state.muted)sound('look');save()};$('#pauseBtn').onclick=()=>{if(mode!=='play')return;openModal('FIELD RECORD / 暂停','在幽光中稍作停留','<p>进度已自动记录。暂停期间，世界与伙伴动作均已凝固。</p><button id="resumeBtn" class="action">继续探索 →</button><button id="menuBtn" class="hint">返回主菜单</button>','pause');$('#resumeBtn').onclick=closeModal;$('#menuBtn').onclick=()=>{save();loaded={...state};$('#continueBtn').hidden=false;$('#modal').hidden=true;$('#menu').hidden=false;mode='menu';keys.clear()}};
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(['arrowup','arrowdown','arrowleft','arrowright',' ','tab'].includes(k))e.preventDefault();if(e.repeat&&['e','f','m','p','tab','escape'].includes(k))return;if(k==='escape'){if(mode==='modal'||mode==='pause')closeModal();else if(mode==='play')$('#pauseBtn').click();return}if(mode!=='play')return;if(k==='p'){$('#companionBtn').click();return}if(k==='tab'){journal();return}if(k==='f'){$('#flashBtn').click();return}if(k==='m'){$('#muteBtn').click();return}if(k==='e'){const n=nearest();if(n.d<130)interact(n.id);else toast('走近带菱形标记的物品，或直接点击地面与物品。');return}keys.add(k);target=null;pending=null});addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));addEventListener('blur',()=>keys.clear());document.addEventListener('visibilitychange',()=>keys.clear());
for(const b of document.querySelectorAll('[data-dir]')){const key='arrow'+b.dataset.dir;b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture(e.pointerId);keys.add(key);target=null;pending=null};b.onpointerup=b.onpointercancel=()=>keys.delete(key)}$('#touchE').onclick=()=>{const n=nearest();if(mode==='play'&&n.d<130)interact(n.id)};
addEventListener('gamepadconnected',()=>{window.__gamepadStats.connected=true;const el=$('#padStatus');if(el)el.hidden=false;toast('已连接手柄：左摇杆移动，右摇杆照射手电，A调查 / X唤宠 / Y手电 / LB驻守铜环')});
addEventListener('gamepaddisconnected',()=>{const pads=navigator.getGamepads?Array.from(navigator.getGamepads()).filter(Boolean):[];window.__gamepadStats.connected=pads.length>0;const el=$('#padStatus');if(el)el.hidden=pads.length===0});
function pollGamepad(dt){
 const pads=navigator.getGamepads?navigator.getGamepads():[];
 const gp=pads&&(pads[0]||pads[1]||pads[2]||pads[3]);
 if(!gp)return{gx:0,gy:0};
 if(!window.__gamepadStats.connected){window.__gamepadStats.connected=true;const el=$('#padStatus');if(el)el.hidden=false}
 const btn=i=>Boolean(gp.buttons?.[i]?.pressed);
 const tap=i=>btn(i)&&!padPrevButtons[i];
 let gx=Math.abs(gp.axes?.[0]||0)>.18?gp.axes[0]:0;
 let gy=Math.abs(gp.axes?.[1]||0)>.18?gp.axes[1]:0;
 if(btn(14))gx=-1;if(btn(15))gx=1;if(btn(12))gy=-1;if(btn(13))gy=1;
 const rx=Math.abs(gp.axes?.[2]||0)>.18?gp.axes[2]:0;
 const ry=Math.abs(gp.axes?.[3]||0)>.18?gp.axes[3]:0;
 if(mode==='play'&&(rx||ry)){
  pointerX=Math.max(80,Math.min(1520,pointerX+rx*520*dt));
  pointerY=Math.max(80,Math.min(840,pointerY+ry*420*dt));
  if(state.flash)aimAngle=Math.max(-22,Math.min(22,Math.atan2(pointerY-(state.y-210),Math.abs(pointerX-state.x)+110)*180/Math.PI*.55));
 }
 if(tap(0)){
  window.__gamepadStats.lastButton='A';
  if(mode==='menu')$('#startBtn')?.click();
  else if(mode==='modal'||mode==='pause')($('#submitPuzzle')||$('#dialDone')||$('#leaveNote')||$('#resumeBtn')||$('#closeModal'))?.click();
  else if(mode==='play'){const n=nearest();if(n&&n.d<130)interact(n.id);else toast('走近带菱形标记的物品按 A 调查。')}
 }
 if(tap(1)){window.__gamepadStats.lastButton='B';if(mode==='modal'||mode==='pause')closeModal()}
 if(tap(2)&&mode==='play'){window.__gamepadStats.lastButton='X';$('#companionBtn')?.click()}
 if(tap(3)&&mode==='play'){window.__gamepadStats.lastButton='Y';$('#flashBtn')?.click()}
 if(tap(4)&&mode==='play'){window.__gamepadStats.lastButton='LB';$('#coopPad')?.click()}
 if((tap(8)||tap(5))&&mode==='play'){window.__gamepadStats.lastButton='RB';journal()}
 if(tap(9)){window.__gamepadStats.lastButton='START';if(mode==='modal'||mode==='pause')closeModal();else if(mode==='play')$('#pauseBtn')?.click()}
 for(let i=0;i<(gp.buttons?.length||0);i++)padPrevButtons[i]=btn(i);
 return{gx,gy};
}
// Ambient motes in three depth planes + real-time water ripple reflections.
const dust=$('#dust').getContext('2d'),motes=Array.from({length:65},(_,i)=>({x:Math.random()*1600,y:Math.random()*900,r:.5+Math.random()*1.5,v:.06+Math.random()*.18,a:.08+Math.random()*.25}));
const goldenBirds=Array.from({length:12},(_,i)=>({phase:i*.52,speed:.18+(i%4)*.035,radius:140+(i%5)*55,scale:.68+(i%3)*.18}));
function drawAwakeningTheater(t){
 if(state.scene===3&&state.solved[3]){
  dust.save();
  for(let i=0;i<8;i++){
   const prog=((t*.0003+i*.125)%1);
   const sx=640+prog*320,sy=658-Math.sin(prog*Math.PI)*105;
   dust.fillStyle=`rgba(158,242,204,${(1-prog)*.45})`;
   dust.beginPath();
   dust.arc(sx,sy,2.5,0,Math.PI*2);
   dust.fill();
  }
  dust.restore();
 }
 if(state.scene===4){
  dust.save();
  for(let i=0;i<6;i++){
   const prog=((t*.0002+i*.16)%1);
   const gx=720+prog*160,gy=720-prog*180;
   dust.fillStyle=`rgba(255,232,152,${(1-prog)*.42})`;
   dust.beginPath();
   dust.arc(gx,gy,2+prog*3,0,Math.PI*2);
   dust.fill();
  }
  dust.restore();
 }
 if(state.scene!==2||(!state.solved[2]&&mode!=='ending'))return;
 const elapsed=awakeningStart?Math.max(0,(t-awakeningStart)/1000):4;
 const fade=Math.min(1,elapsed/1.8);
 dust.save();
 // 1. Expanding golden acoustic ripples on the mirror pool
 for(let r=0;r<4;r++){
  const prog=((t*.00045+r*.25)%1);
  const rx=90+prog*380,ry=22+prog*78;
  dust.strokeStyle=`rgba(245,224,154,${(1-prog)*.38*fade})`;
  dust.lineWidth=2.2-prog*1.4;
  dust.beginPath();
  dust.ellipse(800,765,rx,ry,0,0,Math.PI*2);
  dust.stroke();
 }
 // 2. Converging golden-emerald eye beams from the floating mask toward the sky canopy
 const beamGrad=dust.createLinearGradient(800,295,800,95);
 beamGrad.addColorStop(0,`rgba(255,246,196,${.34*fade})`);
 beamGrad.addColorStop(.55,`rgba(158,242,204,${.20*fade})`);
 beamGrad.addColorStop(1,'rgba(158,242,204,0)');
 dust.fillStyle=beamGrad;
 dust.beginPath();
 dust.moveTo(690,292);dust.lineTo(730,292);dust.lineTo(845,95);dust.lineTo(755,95);dust.closePath();
 dust.moveTo(870,292);dust.lineTo(910,292);dust.lineTo(845,95);dust.lineTo(755,95);dust.closePath();
 dust.fill();
 // 3. Rotating 12-ray Ancient Shu Sun Wheel hologram above the mask
 dust.save();
 dust.translate(800,152);
 dust.rotate(t*.00035);
 dust.strokeStyle=`rgba(247,228,162,${.46*fade})`;
 dust.lineWidth=1.8;
 dust.beginPath();dust.arc(0,0,46,0,Math.PI*2);dust.stroke();
 dust.beginPath();dust.arc(0,0,26,0,Math.PI*2);dust.stroke();
 for(let k=0;k<12;k++){
  const a=k*Math.PI/6;
  dust.beginPath();
  dust.moveTo(Math.cos(a)*26,Math.sin(a)*26);
  dust.quadraticCurveTo(Math.cos(a+.22)*38,Math.sin(a+.22)*38,Math.cos(a)*46,Math.sin(a)*46);
  dust.stroke();
 }
 dust.restore();
 // 4. Ascending flapping Golden Birds spiraling from the mirror pool to the canopy
 goldenBirds.forEach((b,idx)=>{
  const p=((t*.001*b.speed+b.phase)%1);
  const angle=p*Math.PI*3.2+idx*.7;
  const bx=800+Math.sin(angle)*(b.radius*(1-p*.45));
  const by=740-p*610;
  const wing=Math.sin(t*.012+idx*1.7)*9*b.scale;
  const s=13*b.scale;
  const alpha=Math.sin(p*Math.PI)*.78*fade;
  dust.save();
  dust.translate(bx,by);
  dust.rotate(Math.cos(angle)*.28);
  dust.strokeStyle=`rgba(255,238,172,${alpha})`;
  dust.fillStyle=`rgba(246,216,132,${alpha*.45})`;
  dust.lineWidth=2.2;
  dust.beginPath();
  dust.moveTo(-s,wing);
  dust.quadraticCurveTo(-s*.4,-s*.5+wing*.4,0,0);
  dust.quadraticCurveTo(s*.4,-s*.5+wing*.4,s,wing);
  dust.stroke();
  dust.beginPath();
  dust.arc(0,0,2.5*b.scale,0,Math.PI*2);
  dust.fill();
  dust.restore();
 });
 dust.restore();
 window.__reflectionStats.awakeningFrames++;
}
function drawWaterReflections(t){
 dust.save();
 const alphaBase=state.scene===2?.22:state.scene===1?.16:.10;
 const heroImg=hero.cache.get(`assets/hero/${hero.sheet||'poses'}/${Math.max(0,hero.frame)}.webp`);
 if(heroImg&&heroImg.complete&&heroImg.naturalWidth>0){
  const scale=.68+(state.y-660)/700,w=156*scale,h=110*scale;
  for(let slice=0;slice<5;slice++){
   const sy=slice/5,wave=Math.sin(t*.0038+slice*1.3+state.x*.02)*(1.8+slice*.9);
   dust.save();
   dust.globalAlpha=alphaBase*(1-sy*.72);
   dust.translate(state.x+wave,state.y+10+slice*(h/5));
   dust.scale(turn,-0.38);
   dust.drawImage(heroImg,0,heroImg.naturalHeight*(0.35+sy*0.55),heroImg.naturalWidth,heroImg.naturalHeight*0.12,-w/2,0,w,h/4);
   dust.restore();
  }
 }
 // Companion water reflection ripple oval + shimmer
 const cx=companion.x,cy=companion.y;
 for(let r=0;r<3;r++){
  const wave=Math.sin(t*.0042+r*1.5)*3.2;
  dust.fillStyle=`rgba(182,226,204,${(alphaBase*.65)*(1-r*.28)})`;
  dust.beginPath();
  dust.ellipse(cx+wave,cy+10+r*8,28-r*5,5.5-r*1.1,0,0,Math.PI*2);
  dust.fill();
 }
 // In Scene 2 (Chamber), reflect the floating bronze mask & glowing eyes in the mirror pool
 if(state.scene===2){
  const maskEl=$('#floatingMask');
  if(maskEl&&maskEl.complete&&maskEl.naturalWidth>0){
   const wave=Math.sin(t*.0026)*4.5;
   dust.save();
   dust.globalAlpha=state.solved[2]?.24:.14;
   dust.translate(800+wave,838);
   dust.scale(1,-0.26);
   dust.drawImage(maskEl,-210,-120,420,240);
   dust.restore();
  }
 }
 // Render expanding footstep ripples (water splashes vs. bronze/stone resonance rings)
 for(let i=stepRipples.length-1;i>=0;i--){
  const rp=stepRipples[i],age=(t-rp.born)/1000;
  if(age>.85){stepRipples.splice(i,1);continue}
  const p=age/.85,rx=12+p*(rp.surf==='water'?44:28),ry=4+p*(rp.surf==='water'?14:9);
  dust.strokeStyle=rp.surf==='water'?`rgba(158,242,204,${(1-p)*.58})`:rp.surf==='bronze'?`rgba(243,225,162,${(1-p)*.45})`:`rgba(205,218,195,${(1-p)*.28})`;
  dust.lineWidth=rp.surf==='water'?1.9:1.3;
  dust.beginPath();
  dust.ellipse(rp.x,rp.y,rx,ry,0,0,Math.PI*2);
  dust.stroke();
  window.__reflectionStats.stepRipplesRendered++;
 }
 dust.restore();
 window.__reflectionStats.framesRendered++;
 window.__reflectionStats.lastScene=state.scene;
}
function frame(t){const dt=Math.min((t-last)/1000||0,.05);last=t;const pad=pollGamepad(dt);if(mode==='pause'){requestAnimationFrame(frame);return}const n=nearest();if(mode==='play'){state.elapsed+=dt;if(state.scene===1){chimeClock+=dt;if(chimeClock>7.2){chimeClock=0;sound('chimeMicro')}}const px=((state.x-800)/480)+((pointerX-800)/1600)*.32,py=((state.y-750)/130)+((pointerY-450)/900)*.22;$('#world')?.style.setProperty('--px',px.toFixed(3));$('#world')?.style.setProperty('--py',py.toFixed(3));const opt=scenes[state.scene]?.optical,optEl=$('#opticalGlyph');if(opt&&optEl&&state.flash){const dOpt=Math.hypot(pointerX-opt.x,pointerY-opt.y);optEl.classList.toggle('lit',dOpt<135);if(dOpt<125&&!(state.optical||[]).includes(state.scene)){opticalClock+=dt;if(opticalClock>.28){revealOptical(state.scene);opticalClock=0}}else opticalClock=0}else if(optEl)optEl.classList.remove('lit');if(!state.flash){darkClock+=dt;const rId=scenes[state.scene]?.relic;if(darkClock>.38&&rId&&!state.relics.includes(rId)&&!companion.scentTarget){companion.trackScent(relics[rId]);updateCoopElements();toast('黑暗中浮现微弱的荧光气味，法斗竖起耳朵循味跑了过去！')}}else darkClock=0;if(companion.scentTarget||!state.flash)updateCoopElements();let dx=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0)+pad.gx,dy=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0)+pad.gy;if(pad.gx||pad.gy){target=null;pending=null}if(pending==='companion'){const side=state.x<companion.x?-1:1;target={x:Math.max(245,Math.min(1355,companion.x+side*64)),y:Math.max(690,Math.min(812,companion.y-18))};if(Math.hypot(state.x-companion.x,state.y-companion.y)<=98){target=null;pending=null;if(Math.abs(companion.x-state.x)>6){turn=companion.x<state.x?-1:1;player.classList.toggle('facing-left',turn<0)}companion.pat(state);placePlayer()}}if(target){const vx=target.x-state.x,vy=target.y-state.y,dist=Math.hypot(vx,vy);if(dist<7){state.x=target.x;state.y=target.y;target=null;const id=pending;pending=null;if(id==='companion'){if(Math.abs(companion.x-state.x)>6){turn=companion.x<state.x?-1:1;player.classList.toggle('facing-left',turn<0)}companion.pat(state);placePlayer()}else if(id&&id.startsWith('relic:'))discoverRelic(id.slice(6));else if(id&&id.startsWith('env:'))inspectEnv(id.slice(4));else if(id)interact(id)}else{dx=vx/dist;dy=vy/dist}}let moving=mode==='play'&&(dx!==0||dy!==0);player.classList.toggle('walking',moving);if(moving){const len=Math.hypot(dx,dy)||1;state.x=Math.max(245,Math.min(1355,state.x+dx/len*240*dt));state.y=Math.max(690,Math.min(812,state.y+dy/len*155*dt));if(dx)turn=dx<0?-1:1;player.classList.toggle('facing-left',turn<0);stepClock+=dt;if(stepClock>.32){sound('step');stepClock=0;const surf=getSurfaceMaterial(state.scene,state.x,state.y),lift=terrainLift(state.scene,state.x,state.y);stepRipples.push({x:state.x,y:state.y+4+lift,surf,born:t})}placePlayer()}document.querySelectorAll('.hotspot').forEach(b=>b.classList.toggle('near',b.dataset.id===n.id&&n.d<170));$('#interaction').style.display=n.d<120?'block':'none';$('#interaction').textContent='E · '+n.name;saveClock+=dt;if(saveClock>4){save();saveClock=0}}else{player.classList.remove('walking');$('#interaction').style.display='none'}const nearClue=Boolean(n&&n.d<132&&((clues[n.id]&&!state.clues.includes(n.id))||(!state.solved[state.scene]&&['door','sunDial','birdDial','branchDial','final'].includes(n.id))));const petDist=Math.hypot(state.x-companion.x,state.y-companion.y);hero.update(dt,t,{x:state.x,y:state.y,scene:state.scene,facing:turn,mode,flash:state.flash,nearClue,petDist});companion.update(dt,t,{x:state.x,y:state.y,mode,scene:state.scene,facing:turn});placePlayer();dust.clearRect(0,0,1600,900);drawWaterReflections(t);drawAwakeningTheater(t);for(const m of motes){m.y-=m.v*dt*30;m.x+=Math.sin(t*.0002+m.y)*dt*3;if(m.y<0)m.y=900;dust.fillStyle=`rgba(204,218,173,${m.a})`;dust.beginPath();dust.arc(m.x,m.y,m.r,0,Math.PI*2);dust.fill()}requestAnimationFrame(frame)}
renderScene();requestAnimationFrame(frame);
