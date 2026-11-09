const {chromium}=require('@playwright/test');
const fs=require('fs'),path=require('path'),assert=require('assert');
(async()=>{
const browser=await chromium.launch({headless:true,args:['--allow-file-access-from-files'],executablePath:process.env.BROWSER_PATH||'/Users/gitana/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'});
const p=await browser.newPage({viewport:{width:1600,height:900}}),checks=[],errors=[];
p.on('pageerror',e=>errors.push(e.message));const check=(name,v)=>{assert(v,name);checks.push(name);console.log('PASS',name)};
try{
await p.goto('file://'+path.resolve(__dirname,'../index.html'));await p.waitForLoadState('networkidle');await p.click('#startBtn');
await p.click('#bondBtn');check('陪伴菜单可打开',await p.locator('#bondPanel').isVisible());
await p.click('#bondPat');await p.waitForFunction(()=>companion.affection===1);
check('远处抚摸会走近并进入亲昵状态',await p.evaluate(()=>Math.hypot(state.x-companion.x,state.y-companion.y)<=105&&companion.el.dataset.behavior==='nuzzle'));
const a=await p.evaluate(()=>({x:companion.x,y:companion.y}));await p.waitForTimeout(650);const b=await p.evaluate(()=>({x:companion.x,y:companion.y}));check('亲昵期间脚底不漂移',Math.hypot(a.x-b.x,a.y-b.y)<1);
await p.waitForTimeout(1400);await p.click('#bondBtn');await p.click('#bondPat');await p.waitForFunction(()=>companion.affection===2);check('再次抚摸有不同对白',await p.locator('#heroBubble').textContent()==='这次也多亏你啦。');
await p.click('#pauseBtn');const before=await p.evaluate(()=>({age:companion.age,x:companion.x}));await p.waitForTimeout(700);check('暂停冻结宠物动作与位置',await p.evaluate(before=>companion.age===before.age&&companion.x===before.x,before));
await p.keyboard.press('Tab');check('弹窗Tab可移动键盘焦点',await p.evaluate(()=>document.activeElement.id==='resumeBtn'));await p.keyboard.press('Enter');
await p.click('#bondBtn');await p.click('#bondPlay');await p.waitForFunction(()=>Boolean(companion.vignette));check('追光互动进入情境动作',await p.evaluate(()=>companion.vignette.kind==='chase-light'));
await p.waitForTimeout(400);await p.keyboard.press('p');check('呼唤可中断追光并返回',await p.evaluate(()=>!companion.vignette&&companion.recallFor>0));
await p.click('#bondBtn');await p.click('#bondRest');await p.waitForFunction(()=>companion.el.dataset.behavior==='sleep',{}, {timeout:22000});check('休息互动可自然坐卧入睡',await p.locator('#companion').getAttribute('data-behavior')==='sleep');
await p.setViewportSize({width:844,height:390});await p.click('#bondBtn');check('窄屏横向陪伴控件可点击',await p.locator('#bondPanel').isVisible());await p.screenshot({path:'artifacts/v8/screenshots/28-v8-companion-narrow.png'});
check('无脚本错误',errors.length===0);fs.writeFileSync('artifacts/v8/interaction-test-results.json',JSON.stringify({date:new Date().toISOString(),browser:await browser.version(),checks,errors,note:'真实鼠标键盘；窄窗口为Chromium，不等于Safari/iPhone验收。'},null,2));
}finally{await browser.close()}
})();
