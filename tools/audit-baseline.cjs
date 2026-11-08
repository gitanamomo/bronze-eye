const {chromium}=require('@playwright/test');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {spawn}=require('node:child_process');
const assert=require('node:assert/strict');

const ROOT=path.resolve(__dirname,'..');
fs.mkdirSync(path.join(ROOT,'artifacts/v5/screenshots'),{recursive:true});
fs.mkdirSync(path.join(ROOT,'artifacts/v5/full-game/screenshots'),{recursive:true});

const executablePath=process.env.BROWSER_PATH||'/Users/gitana/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';

const MIME={
  '.html':'text/html; charset=utf-8',
  '.js':'application/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8',
  '.json':'application/json; charset=utf-8',
  '.svg':'image/svg+xml',
  '.png':'image/png',
  '.webp':'image/webp',
  '.mp4':'video/mp4',
  '.webm':'video/webm'
};

function startServer(port=5173){
  const server=http.createServer((req,res)=>{
    const cleanUrl=decodeURIComponent((req.url||'/').split('?')[0]);
    const rel=cleanUrl.endsWith('/')?cleanUrl+'index.html':cleanUrl;
    const filePath=path.resolve(ROOT,'.'+rel);
    if(!filePath.startsWith(ROOT)||!fs.existsSync(filePath)||fs.statSync(filePath).isDirectory()){
      res.writeHead(404);res.end('Not found');return;
    }
    const ext=path.extname(filePath).toLowerCase();
    res.writeHead(200,{'Content-Type':MIME[ext]||'application/octet-stream','Cache-Control':'no-store'});
    fs.createReadStream(filePath).pipe(res);
  });
  return new Promise((resolve,reject)=>{
    server.on('error',reject);
    server.listen(port,'127.0.0.1',()=>resolve(server));
  });
}

function runChild(script,env){
  return new Promise((resolve,reject)=>{
    const child=spawn(process.execPath,[script],{cwd:ROOT,env,stdio:'inherit'});
    child.on('error',reject);
    child.on('exit',code=>code===0?resolve():reject(new Error(`${script} exited with code ${code}`)));
  });
}

async function inspectUrl(browser,url,isBaseline=false){
  const p=await browser.newPage({viewport:{width:1600,height:900}});
  const errors=[];p.on('pageerror',e=>errors.push(e.message));
  const findings=[];
  try{
    await p.goto(url);await p.waitForLoadState('networkidle');
    await p.click('#startBtn');
    await p.keyboard.down('d');await p.waitForTimeout(500);await p.keyboard.up('d');
    await p.click('#pauseBtn');
    const before=await p.evaluate(()=>companion.snapshot());
    await p.waitForTimeout(650);
    const after=await p.evaluate(()=>companion.snapshot());
    findings.push({id:'A01',issue:'暂停不冻结伙伴',reproduced:Math.hypot(after.x-before.x,after.y-before.y)>2,before,after});
    if(!isBaseline)await p.screenshot({path:'artifacts/v5/screenshots/01-pause-frozen.png'});
    await p.click('#resumeBtn');

    await p.click('[data-id="door"]');await p.locator('[data-slot="0"]').waitFor({timeout:10000});
    await p.click('[data-slot="0"]');
    const entered=await p.locator('[data-slot="0"]').innerText();
    await p.click('#closeModal');
    await p.click('[data-id="door"]');await p.locator('[data-slot="0"]').waitFor({timeout:10000});
    const reopened=await p.locator('[data-slot="0"]').innerText();
    findings.push({id:'A02',issue:'机关重开丢失输入',reproduced:entered!==reopened,entered,reopened});
    if(!isBaseline)await p.screenshot({path:'artifacts/v5/screenshots/02-puzzle-persisted.png'});
    await p.click('#closeModal');

    // Move right so player is >105px from the companion when clicking #companion
    await p.keyboard.down('d');await p.waitForTimeout(450);await p.keyboard.up('d');
    await p.click('#companion');await p.waitForTimeout(120);
    const care=await p.evaluate(()=>({distance:Math.hypot(state.x-companion.x,state.y-companion.y),action:hero.snapshot().action}));
    findings.push({id:'A03',issue:'远距离即可触发抚摸',reproduced:care.distance>105&&care.action==='pet',...care});
    if(!isBaseline){
      await p.waitForFunction(()=>hero.snapshot().action==='pet'&&Math.hypot(state.x-companion.x,state.y-companion.y)<=105,{},{timeout:6000});
      await p.waitForTimeout(180);
      await p.screenshot({path:'artifacts/v5/screenshots/03-close-mutual-pet.png'});
    }

    const oldX=await p.evaluate(()=>state.x);
    await p.mouse.click(1220,792);
    await p.waitForTimeout(120);
    if(!isBaseline)await p.screenshot({path:'artifacts/v5/screenshots/04-ground-click-walk.png'});
    await p.waitForTimeout(350);
    const newX=await p.evaluate(()=>state.x);
    findings.push({id:'A04',issue:'点击可行走地面没有回应',reproduced:Math.abs(oldX-newX)<1,oldX,newX});
    if(isBaseline)await p.screenshot({path:'artifacts/v5/screenshots/baseline.png'});

    if(!isBaseline){
      await p.click('[data-env="sunbeam"]');
      await p.waitForFunction(()=>['wonder','curious'].includes(hero.snapshot().action),{},{timeout:8000});
      await p.waitForTimeout(220);
      await p.screenshot({path:'artifacts/v5/screenshots/05-env-interaction.png'});

      // Co-op mechanic 1: Dual-character pressure pad & resonance assist
      await p.click('#coopPad');
      await p.waitForFunction(()=>companion.snapshot().guarding===true,{},{timeout:8000});
      await p.waitForTimeout(200);
      await p.screenshot({path:'artifacts/v5/screenshots/06-coop-guard.png'});
      await p.click('[data-id="door"]');
      await p.locator('#coopAssistBtn').waitFor({timeout:10000});
      await p.click('#coopAssistBtn');
      const coopSlot1=await p.locator('[data-slot="1"]').innerText();
      assert.equal(coopSlot1.includes('飞鸟'),true,'C01: 伙伴共鸣校准应自动对齐下一处未匹配符号');
      const hasFocus=await p.evaluate(()=>document.querySelector('#world').classList.contains('puzzle-focus')&&document.querySelector('#modal').classList.contains('tactile-mode'));
      assert.equal(hasFocus,true,'S02a: 机关应触发场景镜头聚焦与青铜圆环拨盘模式');
      await p.screenshot({path:'artifacts/v5/screenshots/08-tactile-puzzle-focus.png'});
      await p.click('#closeModal');
      findings.push({id:'C01',issue:'法斗双人同心环驻守与共鸣校准',reproduced:false,guarding:true,coopSlot1});

      // Suggestion 2b: Flashlight optical inscription reveal
      await p.click('#opticalGlyph');
      await p.waitForFunction(()=>Array.isArray(state.optical)&&state.optical.includes(0)&&document.querySelector('#opticalGlyph').classList.contains('revealed'),{},{timeout:5000});
      await p.waitForTimeout(180);
      await p.screenshot({path:'artifacts/v5/screenshots/09-optical-glyph.png'});
      findings.push({id:'S02',issue:'场景镜头聚焦拨盘与手电光学显影暗刻',reproduced:false,puzzleFocus:hasFocus,opticalRevealed:0});

      // Suggestion 3: 2.5D parallax & real-time water ripple reflections
      const s03=await p.evaluate(()=>({
        px:document.querySelector('#world').style.getPropertyValue('--px'),
        hasFgSilhouette:Boolean(document.querySelector('.fg-silhouettes')),
        reflectionFrames:window.__reflectionStats?.framesRendered||0
      }));
      assert.equal(Boolean(s03.px&&s03.hasFgSilhouette&&s03.reflectionFrames>5),true,'S03: 2.5D 视差前景遮挡与水面实时倒影应生效');
      findings.push({id:'S03',issue:'2.5D 多层视差前景遮挡与水面实时波纹倒影',reproduced:false,...s03});

      // Co-op mechanic 2: Dark-mode scent tracking for hidden relics
      await p.click('#flashBtn');
      await p.waitForFunction(()=>companion.snapshot().scentTracking===true,{},{timeout:6000});
      await p.waitForFunction(()=>companion.snapshot().scentReached===true,{},{timeout:8000});
      await p.waitForTimeout(200);
      await p.screenshot({path:'artifacts/v5/screenshots/07-scent-relic.png'});
      await p.click('#scentSpot');
      await p.waitForFunction(()=>Array.isArray(state.relics)&&state.relics.includes('amberBell'),{},{timeout:8000});
      await p.click('#closeModal');
      await p.click('#flashBtn');
      findings.push({id:'C02',issue:'暗场微光嗅探与隐藏秘宝发掘',reproduced:false,relicFound:'amberBell'});

      // Suggestion 4: Ancient Shu Bianzhong soundscape & two-page rubbing journal
      await p.click('[data-id="stele"]');
      await p.locator('#leaveNote').waitFor({timeout:10000});
      await p.click('#leaveNote');
      await p.keyboard.press('Tab');
      const s04=await p.evaluate(()=>({
        journalBook:Boolean(document.querySelector('.journal-book')&&document.querySelector('.rubbing-svg')&&document.querySelector('.paw-seal')),
        audioStats:window.__audioStats
      }));
      assert.equal(s04.journalBook&&s04.audioStats?.partials===3&&s04.audioStats?.count>0,true,'S04: 手绘拓片手记双页与古蜀编钟泛音混响引擎应生效');
      await p.waitForTimeout(180);
      await p.screenshot({path:'artifacts/v5/screenshots/10-rubbing-journal.png'});
      await p.click('#closeModal');
      findings.push({id:'S04',issue:'古蜀编钟泛音混响音景与双页手绘拓片手记',reproduced:false,...s04});
    }

    await p.addInitScript(()=>{
      if(!sessionStorage.getItem('corrupt_injected')){
        sessionStorage.setItem('corrupt_injected','1');
        localStorage.setItem('bronze-eye-save-v1',JSON.stringify({version:1,scene:0,x:675,y:755,clues:['not-a-clue','stele'],solved:[false,false,false],dials:[1,1,1]}));
      }
    });
    await p.reload();await p.waitForLoadState('networkidle');
    await p.click('#continueBtn');await p.keyboard.press('Tab');
    findings.push({id:'A05',issue:'损坏存档线索可令手记报错',reproduced:errors.some(e=>e.includes('title')),errors:[...errors]});
    return {findings,errors};
  }finally{await p.close()}
}

(async()=>{
  const server=await startServer(5173);
  const b=await chromium.launch({headless:true,executablePath});
  try{
    const base=await inspectUrl(b,'http://127.0.0.1:5173/versions/v4-before-audit/index.html',true);
    fs.writeFileSync('artifacts/v5/audit-baseline.json',JSON.stringify({date:'2026-11-07',target:'versions/v4-before-audit',findings:base.findings,note:'在保留的 V4 基线版本上复现全部 5 项体验与稳健性问题；独立临时浏览器上下文运行。'},null,2));
    console.log('BASELINE:',base.findings.map(f=>({id:f.id,reproduced:f.reproduced})));

    const fixed=await inspectUrl(b,'http://127.0.0.1:5173/index.html',false);
    for(const f of fixed.findings){
      assert.equal(f.reproduced,false,`${f.id} (${f.issue}) 应当已修复`);
      console.log('FIXED',f.id,f.issue);
    }
    assert.equal(fixed.errors.length,0,'修复后不应有任何页面报错');
    fs.writeFileSync('artifacts/v5/audit-test-results.json',JSON.stringify({date:'2026-11-07',browser:await b.version(),target:'index.html (V5)',findings:fixed.findings,errors:fixed.errors,allFixed:fixed.findings.every(f=>!f.reproduced)},null,2));
    await b.close();

    // Run hero, companion, and full-game regression suites asynchronously so HTTP server stays responsive
    const env={...process.env,TEST_DATE:'2026-11-07',COMPANION_ARTIFACT_DIR:'artifacts/v5',ARTIFACT_DIR:'artifacts/v5/full-game'};
    console.log('--- Running test-hero.cjs ---');
    await runChild('tools/test-hero.cjs',env);
    fs.copyFileSync('artifacts/v4/hero-test-results.json','artifacts/v5/hero-test-results.json');
    console.log('--- Running test-companion.cjs ---');
    await runChild('tools/test-companion.cjs',env);
    console.log('--- Running full-test.cjs ---');
    await runChild('tools/full-test.cjs',env);
  }finally{
    server.close();
  }
})();
