// Sprite preparation only: preserve the supplied dog's pixels, normalize scale and paw baseline.
const fs = require('node:fs');
let sharp;
try { sharp = require('sharp'); } catch { sharp = require(process.env.SHARP_MODULE_PATH || '/Users/gitana/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp'); }
const root = require('node:path').resolve(__dirname, '..');
const out = root + '/assets/companion';
const W = 384, H = 320, baseline = 302;
(async () => {
  const manifest = { cellWidth: W, cellHeight: H, columns: 4, rows: 3, pawBaseline: baseline, sheets: {} };
  for (const type of ['walk', 'idle']) {
    const file = `${out}/source/${type}-sheet.png`;
    const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const rows = type === 'idle' ? [[0, 444], [444, 795], [795, 1086]] : [[0, 362], [362, 724], [724, 1086]];
    const layers = [], frames = [];
    for (let i = 0; i < 12; i++) {
      const col = i % 4, row = Math.floor(i / 4), x0 = col * 362, [y0, y1] = rows[row];
      let minX = info.width, minY = info.height, maxX = 0, maxY = 0;
      for (let y = y0; y < y1; y++) for (let x = x0; x < x0 + 362; x++) {
        if (data[(y * info.width + x) * 4 + 3] > 32) { minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y); }
      }
      minX = Math.max(x0, minX - 2); minY = Math.max(y0, minY - 2);
      maxX = Math.min(x0 + 361, maxX + 2); maxY = Math.min(y1 - 1, maxY + 2);
      const crop = { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
      // Frontal sheet was drawn at a larger head scale than the side sheet.
      const factor = type === 'walk' ? .9 : .64;
      const width = Math.round(crop.width * factor), height = Math.round(crop.height * factor);
      const image = await sharp(file).extract(crop).resize(width, height).png().toBuffer();
      const left = Math.round((W - width) / 2), top = baseline - height;
      layers.push({ input: image, left: col * W + left, top: row * H + top });
      frames.push({ frame: i, source: crop, width, height, left, top });
    }
    await sharp({ create: { width: W * 4, height: H * 3, channels: 4, background: '#00000000' } }).composite(layers).webp({ quality: 94, alphaQuality: 100 }).toFile(`${out}/${type}.webp`);
    manifest.sheets[type] = frames;
  }
  fs.writeFileSync(`${out}/manifest.json`, JSON.stringify(manifest, null, 2) + '\n');
  console.log('Prepared 12 walking and 12 idle / sit / rest frames, alpha preserved, aligned paws.');
})();
