const { createCanvas, registerFont } = require('canvas');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const OUT = path.join(__dirname, '../public/images');

// ── OG DEFAULT IMAGE (1200x630) ──────────────────────────────────
async function generateOG() {
  const W = 1200, H = 630;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#0b0c10';
  ctx.fillRect(0, 0, W, H);

  // Subtle grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y < H; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  // Top eyebrow line
  ctx.strokeStyle = '#00c8d7';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(80, 90); ctx.lineTo(360, 90); ctx.stroke();

  // Eyebrow text
  ctx.fillStyle = '#00c8d7';
  ctx.font = 'bold 14px monospace';
  ctx.letterSpacing = '3px';
  ctx.fillText('// ENGINEERING ARCHIVE', 80, 85);

  // Main title "THE SPACESUITS"
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 120px Arial Black, Impact, sans-serif';
  ctx.letterSpacing = '-2px';
  ctx.fillText('THE', 80, 210);

  ctx.fillStyle = '#c9a84c';  // gold
  ctx.fillText('SUIT', 80, 330);

  ctx.fillStyle = '#00c8d7';  // cyan
  ctx.fillText('ARCHIVE', 80, 450);

  // Cyan subtitle
  ctx.fillStyle = 'rgba(0,200,215,0.7)';
  ctx.font = '18px monospace';
  ctx.letterSpacing = '2px';
  ctx.fillText('Engineering Archive · thespacesuits.com', 80, 500);

  // Stat line
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = '15px monospace';
  ctx.letterSpacing = '1px';
  ctx.fillText('70 Years  ·  40+ Variants  ·  3 Nations', 80, 555);

  // Right side: stylized suit silhouette shapes
  const drawSuitShape = (cx, color, scale) => {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = 0.55;

    // Helmet
    ctx.beginPath();
    ctx.ellipse(cx, 220 * scale + 150, 40 * scale, 45 * scale, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Torso
    ctx.beginPath();
    ctx.moveTo(cx - 30 * scale, 265 * scale + 150);
    ctx.lineTo(cx - 28 * scale, 360 * scale + 150);
    ctx.lineTo(cx + 28 * scale, 360 * scale + 150);
    ctx.lineTo(cx + 30 * scale, 265 * scale + 150);
    ctx.closePath();
    ctx.stroke();

    // Legs
    ctx.beginPath();
    ctx.moveTo(cx - 14 * scale, 360 * scale + 150);
    ctx.lineTo(cx - 16 * scale, 440 * scale + 150);
    ctx.moveTo(cx + 14 * scale, 360 * scale + 150);
    ctx.lineTo(cx + 16 * scale, 440 * scale + 150);
    ctx.stroke();

    ctx.restore();
  };

  // Draw three suit outlines on right side
  drawSuitShape(900, '#c9a84c', 0.55);   // gold SK-1
  drawSuitShape(1000, 'rgba(240,237,230,0.8)', 0.65); // white A7L (slightly larger)
  drawSuitShape(1100, '#00c8d7', 0.55);  // cyan Orlan

  // Bottom border line
  ctx.strokeStyle = 'rgba(201,168,76,0.3)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(80, 590); ctx.lineTo(1120, 590); ctx.stroke();

  // Save
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.88 });
  fs.writeFileSync(path.join(OUT, 'og-default.jpg'), buffer);
  console.log('✓ og-default.jpg');
}

// ── FAVICON PNGs ─────────────────────────────────────────────────
async function generateFavicons() {
  const drawFavicon = (size) => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    // Black circle background
    ctx.fillStyle = '#0b0c10';
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();

    // White S
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${Math.round(size * 0.7)}px Arial Black, Impact, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('S', size / 2, size / 2 + size * 0.04);

    // Cyan orbit ring
    ctx.strokeStyle = '#00c8d7';
    ctx.lineWidth = size * 0.05;
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate(-Math.PI / 6);
    ctx.beginPath();
    ctx.ellipse(0, 0, size * 0.42, size * 0.18, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    return canvas.toBuffer('image/png');
  };

  fs.writeFileSync(path.join(OUT, 'favicon-32.png'), drawFavicon(32));
  console.log('✓ favicon-32.png');

  fs.writeFileSync(path.join(OUT, 'favicon-16.png'), drawFavicon(16));
  console.log('✓ favicon-16.png');

  fs.writeFileSync(path.join(OUT, 'apple-touch-icon.png'), drawFavicon(180));
  console.log('✓ apple-touch-icon.png');
}

(async () => {
  await generateOG();
  await generateFavicons();
})().catch(err => { console.error(err); process.exit(1); });
