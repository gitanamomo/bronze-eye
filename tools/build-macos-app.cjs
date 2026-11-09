const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

let sharp;
try {
  sharp = require('sharp');
} catch {
  sharp = require('/Users/gitana/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
}

const ROOT = path.resolve(__dirname, '..');
const APP_NAME = '古蜀迷踪：青铜之眼.app';
const APP_DIR = path.join(ROOT, APP_NAME);
const CONTENTS_DIR = path.join(APP_DIR, 'Contents');
const MACOS_DIR = path.join(CONTENTS_DIR, 'MacOS');
const RESOURCES_DIR = path.join(CONTENTS_DIR, 'Resources');
const GAME_RES_DIR = path.join(RESOURCES_DIR, 'game');

function copyFileCreatingDir(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

async function buildAppIcon(icnsDest) {
  const tmpIconset = path.join(ROOT, 'tools/macos-app/AppIcon.iconset');
  fs.rmSync(tmpIconset, { recursive: true, force: true });
  fs.mkdirSync(tmpIconset, { recursive: true });

  // Create a 1024x1024 squircle icon with the painted vault/hall backdrop and bronze mask
  const maskSvg = Buffer.from(`
    <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <rect x="64" y="64" width="896" height="896" rx="200" ry="200" fill="#ffffff"/>
    </svg>
  `);
  const frameSvg = Buffer.from(`
    <svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="glow" cx="50%" cy="46%" r="48%">
          <stop offset="0%" stop-color="#c9f7dc" stop-opacity="0.48"/>
          <stop offset="65%" stop-color="#143734" stop-opacity="0.18"/>
          <stop offset="100%" stop-color="#051317" stop-opacity="0.72"/>
        </radialGradient>
        <linearGradient id="rim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f0e1b1" stop-opacity="0.92"/>
          <stop offset="50%" stop-color="#8eb89f" stop-opacity="0.55"/>
          <stop offset="100%" stop-color="#b79f67" stop-opacity="0.88"/>
        </linearGradient>
      </defs>
      <rect x="64" y="64" width="896" height="896" rx="200" ry="200" fill="url(#glow)"/>
      <rect x="70" y="70" width="884" height="884" rx="194" ry="194" fill="none" stroke="url(#rim)" stroke-width="12"/>
      <rect x="88" y="88" width="848" height="848" rx="180" ry="180" fill="none" stroke="#e8dbb038" stroke-width="3"/>
    </svg>
  `);

  const bgBuf = await sharp(path.join(ROOT, 'assets/painterly/hall.webp'))
    .resize(1024, 1024, { fit: 'cover', position: 'center' })
    .modulate({ brightness: 0.88, saturation: 1.05 })
    .png()
    .toBuffer();

  const bronzeMaskBuf = await sharp(path.join(ROOT, 'assets/painterly/mask.webp'))
    .resize(780, 420, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const heroBuf = await sharp(path.join(ROOT, 'assets/hero/poses/0.webp'))
    .resize(260, 508, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const master1024 = await sharp(bgBuf)
    .composite([
      { input: frameSvg, top: 0, left: 0 },
      { input: bronzeMaskBuf, top: 175, left: 122 },
      { input: heroBuf, top: 430, left: 382 },
      { input: maskSvg, blend: 'dest-in' }
    ])
    .png()
    .toBuffer();

  const sizes = [
    ['icon_16x16.png', 16],
    ['icon_16x16@2x.png', 32],
    ['icon_32x32.png', 32],
    ['icon_32x32@2x.png', 64],
    ['icon_128x128.png', 128],
    ['icon_128x128@2x.png', 256],
    ['icon_256x256.png', 256],
    ['icon_256x256@2x.png', 512],
    ['icon_512x512.png', 512],
    ['icon_512x512@2x.png', 1024]
  ];

  for (const [name, dim] of sizes) {
    await sharp(master1024)
      .resize(dim, dim)
      .png()
      .toFile(path.join(tmpIconset, name));
  }

  execFileSync('/usr/bin/iconutil', ['-c', 'icns', tmpIconset, '-o', icnsDest]);
  fs.rmSync(tmpIconset, { recursive: true, force: true });
}

(async () => {
  fs.rmSync(APP_DIR, { recursive: true, force: true });
  fs.mkdirSync(MACOS_DIR, { recursive: true });
  fs.mkdirSync(GAME_RES_DIR, { recursive: true });

  console.log('1. 编译原生 macOS 启动器 (Cocoa + WKWebView)...');
  const binPath = path.join(MACOS_DIR, 'BronzeEye');
  execFileSync('/usr/bin/swiftc', [
    '-O',
    '-module-cache-path', '/tmp/bronze-eye-swift-cache',
    path.join(ROOT, 'tools/macos-app/main.swift'),
    '-framework', 'Cocoa',
    '-framework', 'WebKit',
    '-o', binPath
  ], { stdio: 'inherit', env: { ...process.env, TMPDIR: '/tmp' } });
  fs.chmodSync(binPath, 0o755);

  console.log('2. 生成高清青铜之眼应用图标 (AppIcon.icns)...');
  await buildAppIcon(path.join(RESOURCES_DIR, 'AppIcon.icns'));

  console.log('3. 打包游戏运行资源到 .app 包内 (支持独立移动运行)...');
  const rootFiles = [
    'index.html',
    'style.css',
    'painterly.css',
    'expedition.css',
    'companion.css',
    'hero.css',
    'game.js',
    'companion.js',
    'hero.js'
  ];
  for (const f of rootFiles) {
    copyFileCreatingDir(path.join(ROOT, f), path.join(GAME_RES_DIR, f));
  }

  const assetFiles = [
    'assets/icon.svg',
    'assets/painterly/hall.webp',
    'assets/painterly/tree.webp',
    'assets/painterly/vault-clean.webp',
    'assets/painterly/mask.webp',
    'assets/painterly/chime.webp',
    'assets/painterly/dawn.webp',
    'assets/hero/celebration-hug.webp',
    'assets/painterly/tree-inscription.svg',
    'assets/companion/idle.webp',
    'assets/companion/walk.webp',
    'assets/companion/manifest.json',
    'assets/hero/manifest.json'
  ];
  for (let i = 0; i < 8; i++) {
    assetFiles.push(`assets/hero/poses/${i}.webp`);
    assetFiles.push(`assets/hero/walk/${i}.webp`);
  }
  for (const rel of assetFiles) {
    copyFileCreatingDir(path.join(ROOT, rel), path.join(GAME_RES_DIR, rel));
  }

  console.log('4. 写入 Info.plist 并执行本地签名...');
  const infoPlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleDevelopmentRegion</key>
  <string>zh_CN</string>
  <key>CFBundleDisplayName</key>
  <string>古蜀迷踪：青铜之眼</string>
  <key>CFBundleExecutable</key>
  <string>BronzeEye</string>
  <key>CFBundleIconFile</key>
  <string>AppIcon</string>
  <key>CFBundleIdentifier</key>
  <string>com.bronzeeye.game</string>
  <key>CFBundleInfoDictionaryVersion</key>
  <string>6.0</string>
  <key>CFBundleName</key>
  <string>古蜀迷踪：青铜之眼</string>
  <key>CFBundlePackageType</key>
  <string>APPL</string>
  <key>CFBundleShortVersionString</key>
  <string>1.7.0</string>
  <key>CFBundleVersion</key>
  <string>8</string>
  <key>LSMinimumSystemVersion</key>
  <string>12.0</string>
  <key>NSHighResolutionCapable</key>
  <true/>
  <key>NSSupportsAutomaticGraphicsSwitching</key>
  <true/>
</dict>
</plist>
`;
  fs.writeFileSync(path.join(CONTENTS_DIR, 'Info.plist'), infoPlist);

  execFileSync('/usr/bin/codesign', ['--force', '--deep', '--sign', '-', APP_DIR], { stdio: 'inherit' });
  try {
    execFileSync('/usr/bin/xattr', ['-cr', APP_DIR]);
  } catch {}

  console.log('Done:', APP_DIR);
})();
