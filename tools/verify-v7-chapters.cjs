const { chromium } = require('@playwright/test');
const fs = require('fs');
const assert = require('assert');
const path = require('path');

const OUT = path.resolve(__dirname, '../artifacts/v5');
const SCREENSHOT_DIR = path.join(OUT, 'screenshots');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const executablePath = process.env.BROWSER_PATH || '/Users/gitana/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing';

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath,
    args: ['--allow-file-access-from-files', '--no-sandbox']
  });

  const page = await browser.newPage({
    viewport: { width: 1600, height: 900 },
    deviceScaleFactor: 1
  });

  const errors = [];
  const failed = [];
  const checks = [];

  page.on('pageerror', e => errors.push(e.message));
  page.on('requestfailed', r => failed.push(r.url()));
  page.on('response', r => {
    if (r.status() >= 400) failed.push(r.status() + ' ' + r.url());
  });

  const check = (name, v) => {
    assert(v, name);
    checks.push(name);
    console.log('PASS:', name);
  };

  const shot = async name => {
    await page.waitForTimeout(400);
    const dest = path.join(SCREENSHOT_DIR, `${name}.png`);
    await page.screenshot({ path: dest });
    console.log('SHOT:', dest);
  };

  const hit = async id => {
    const loc = page.locator(`[data-id="${id}"]`);
    await loc.scrollIntoViewIfNeeded();
    await loc.click();
    await page.waitForFunction(() => !document.querySelector('#modal').hidden || !document.querySelector('#transition').hidden, {}, { timeout: 15000 });
  };

  const clue = async id => {
    await hit(id);
    await page.locator('#leaveNote').click();
  };

  try {
    const fileUrl = 'file://' + path.resolve(__dirname, '../index.html');
    console.log('Navigating to', fileUrl);
    await page.goto(fileUrl);
    await page.waitForLoadState('networkidle');

    check('主菜单正常显示', await page.locator('#menu').isVisible());
    await page.locator('#startBtn').click();
    await page.waitForTimeout(600);

    // --- Scene 0: 前厅 ---
    check('场景0青铜殿前厅载入', await page.locator('#chapterName').textContent() === '青铜神殿前厅');
    await clue('stele');
    await clue('vessel');
    await clue('mural');
    check('前厅3份线索收录', await page.evaluate(() => state.clues.length === 3));

    // Chapter 1 Puzzle (Door)
    await hit('door');
    for (const [i, n] of [1, 2, 3].entries()) {
      for (let j = 0; j < n; j++) await page.locator(`[data-slot="${i}"]`).click();
    }
    await page.locator('#submitPuzzle').click();
    check('第1关青铜之门开启', await page.evaluate(() => state.solved[0]));

    // Proceed to Scene 1
    await page.locator('[data-id="door"]').click();
    await page.waitForFunction(() => document.querySelector('#chapterName').textContent === '神树祭坛', {}, { timeout: 10000 });
    await page.waitForFunction(() => document.querySelector('#transition').hidden);

    // --- Scene 1: 神树祭坛 ---
    check('场景1神树祭坛载入', await page.locator('#chapterName').textContent() === '神树祭坛');
    await clue('relief');
    await clue('roots');
    await clue('echo');
    check('前两章共6份线索收录', await page.evaluate(() => state.clues.length === 6));

    // Chapter 2 Puzzle (Dials)
    for (const [id, n] of [['sunDial', 2], ['birdDial', 1], ['branchDial', 3]]) {
      await hit(id);
      for (let j = 0; j < n; j++) await page.locator('#dialTurn').click();
      await page.locator('#dialDone').click();
    }
    check('第2关神树节律机关完成', await page.evaluate(() => state.solved[1]));

    // Proceed to Scene 2
    await page.locator('[data-id="passage"]').click();
    await page.waitForFunction(() => document.querySelector('#chapterName').textContent === '青铜之眼密室', {}, { timeout: 10000 });
    await page.waitForFunction(() => document.querySelector('#transition').hidden);

    // --- Scene 2: 青铜之眼密室 ---
    check('场景2青铜之眼密室载入', await page.locator('#chapterName').textContent() === '青铜之眼密室');
    await clue('return');
    await clue('eyes');
    check('前三章共8份线索收录', await page.evaluate(() => state.clues.length === 8));

    // Chapter 3 Puzzle (Final slots & eyes)
    await hit('final');
    for (const [i, n] of [3, 2, 1].entries()) {
      for (let j = 0; j < n; j++) await page.locator(`[data-slot="${i}"]`).click();
    }
    for (let i = 0; i < 2; i++) await page.locator('[data-eye="0"][data-delta="1"]').click();
    for (let i = 0; i < 3; i++) await page.locator('[data-eye="1"][data-delta="1"]').click();
    await page.locator('#submitPuzzle').click();
    check('第3关青铜之眼记忆中枢唤醒', await page.evaluate(() => state.solved[2]));

    // Proceed to Scene 3 (Chapter 4: 星璇编钟长廊)
    await page.locator('[data-id="final"]').click();
    await page.waitForFunction(() => document.querySelector('#chapterName').textContent === '星璇编钟长廊', {}, { timeout: 10000 });
    await page.waitForFunction(() => document.querySelector('#transition').hidden);

    // --- Scene 3: 星璇编钟长廊 ---
    check('场景3星璇编钟长廊载入', await page.locator('#chapterName').textContent() === '星璇编钟长廊');
    check('长廊背景载入', await page.locator('#backdrop').evaluate(i => i.complete && i.naturalWidth >= 1600 && i.src.endsWith('chime.webp')));
    await page.waitForTimeout(600);
    await shot('20-v7-chime-corridor');

    await clue('chimeStele');
    await clue('astrolabe');
    check('前四章共10份线索收录', await page.evaluate(() => state.clues.length === 10));

    // Chapter 4 Puzzle (Chimes: 日钟=3, 鸟钟=5, 枝钟=2)
    await hit('chimeBells');
    check('编钟拟物界面已打开', await page.locator('#chimeDone').isVisible());
    // Initial chimes are [1, 1, 1], so click chime 0 twice (-> 3), chime 1 four times (-> 5), chime 2 once (-> 2)
    for (let j = 0; j < 2; j++) await page.locator('[data-chime="0"]').click();
    for (let j = 0; j < 4; j++) await page.locator('[data-chime="1"]').click();
    for (let j = 0; j < 1; j++) await page.locator('[data-chime="2"]').click();
    await page.locator('#chimeDone').click();
    check('第4关编钟律音谐调完成，星桥虚空导通', await page.evaluate(() => state.solved[3]));

    // Check Star Bridge visual effect active
    check('星桥视觉光带激活', await page.locator('#chimeFlow').evaluate(el => !el.hidden && el.classList.contains('bridge-ready')));

    // Proceed to Scene 4 (Chapter 5: 破晓观星台) via bridgeDais
    await page.locator('[data-id="bridgeDais"]').click();
    await page.waitForFunction(() => document.querySelector('#chapterName').textContent === '破晓观星台', {}, { timeout: 10000 });
    await page.waitForFunction(() => document.querySelector('#transition').hidden);

    // --- Scene 4: 破晓观星台 ---
    check('场景4破晓观星台载入', await page.locator('#chapterName').textContent() === '破晓观星台');
    check('破晓背景载入', await page.locator('#backdrop').evaluate(i => i.complete && i.naturalWidth >= 1600 && i.src.endsWith('dawn.webp')));
    check('场景中相拥庆祝精灵可见', await page.locator('#celebrationHug').evaluate(el => !el.hidden && el.querySelector('img').complete));

    await clue('dawnMemorial');
    await clue('houndRelief');
    check('全五章12份线索完整收集', await page.evaluate(() => state.clues.length === 12));

    await page.waitForTimeout(600);
    await shot('21-v7-dawn-observatory');

    // Trigger celebration hug
    await page.locator('#celebrationHug').click();
    await page.waitForFunction(() => !document.querySelector('#ending').hidden, {}, { timeout: 10000 });
    check('通关结算画面弹出', await page.locator('#ending').isVisible());
    check('通关拥抱大卡展示', await page.locator('#endingHugShowcase').isVisible());
    check('拥抱大卡包含高保真插画', await page.locator('#endingHugImg').evaluate(i => i.complete && i.naturalWidth > 0));

    await page.waitForTimeout(800);
    await shot('22-v7-celebration-hug-ending');

    // Test "再抱一次" interaction
    await page.locator('#hugAgainBtn').click();
    await page.waitForTimeout(300);
    check('再次相拥心形气泡特效激活', await page.locator('#endingHugHearts').textContent() === '♡ ♡ ♡ 🐾 ✦ ★ 汪！ ♡ ♡ ♡');
    await shot('23-v7-hug-interactive');

    // Test "漫步破晓天台" interaction
    await page.locator('#roamDawnBtn').click();
    check('自由漫步已关闭结算面板', await page.locator('#ending').isHidden());
    check('仍在破晓观星台自由探索', await page.evaluate(() => state.scene === 4 && mode === 'play'));
    await page.waitForTimeout(600);
    await shot('24-v7-roam-dawn-terrace');

    // Open Journal to verify 12 clues & 5 relics rubric
    await page.keyboard.press('Tab');
    await page.waitForTimeout(500);
    check('手记展示12份全章节线索', (await page.locator('.evidence section').count()) === 12);
    check('手记展示青铜拓印画卷与暗文', await page.locator('.rubbing-svg').isVisible());
    await shot('25-v7-full-journal-12clues');
    await page.keyboard.press('Escape');

    check('无JavaScript运行报错', errors.length === 0);
    check('无资源缺失或404', failed.length === 0);

    const report = {
      date: new Date().toISOString(),
      browser: await browser.version(),
      chapters: 5,
      totalChecks: checks.length,
      checks,
      errors,
      failed,
      summary: '5大关卡全流程完整贯通：前厅 -> 神树祭坛 -> 密室 -> 星璇编钟长廊 -> 破晓观星台，主人物与法斗通关相拥庆祝交互完整，各场景画质与艺术风格高度统一。'
    };

    fs.writeFileSync(path.join(OUT, 'v7-test-results.json'), JSON.stringify(report, null, 2));
    console.log(`\n🎉 ALL ${checks.length} CHECKS PASSED SUCCESSFULLY!`);
  } catch (err) {
    console.error('Test failed:', err);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'v7-failure.png') });
    throw err;
  } finally {
    await browser.close();
  }
})();
