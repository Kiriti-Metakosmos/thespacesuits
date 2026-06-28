const sharp = require('sharp');
const path = require('path');

const SRC = path.join(__dirname, '../public/images/All-Spacesuits.jpg');
const OUT = path.join(__dirname, '../public/images/suits');

// Detected pixel boundaries (row boundaries: top y=0–517, bottom y=521–1046)
const TOP = { top: 0, height: 517 };
const BOT = { top: 521, height: 525 };

const suits = [
  { file: 'mercury-iva.jpg', left: 872, width: 167, ...TOP },
  { file: 'sk-1.jpg',        left: 1448, width: 173, ...TOP },
  { file: 'gemini-g4c.jpg',  left: 226, width: 193, ...BOT },
  { file: 'apollo-a7l.jpg',  left: 1458, width: 205, ...BOT },
  { file: 'apollo-a7lb.jpg', left: 1920, width: 200, ...BOT },
  { file: 'sokol-kv2.jpg',   left: 2600, width: 187, ...BOT },
  { file: 'shuttle-emu.jpg', left: 2789, width: 248, ...BOT },
];

async function main() {
  for (const s of suits) {
    const outPath = path.join(OUT, s.file);
    await sharp(SRC)
      .extract({ left: s.left, top: s.top, width: s.width, height: s.height })
      .jpeg({ quality: 90 })
      .toFile(outPath);
    console.log(`✓ ${s.file}`);
  }

  // OG hero: full image resized to 1200x630
  await sharp(SRC)
    .resize(1200, 630, { fit: 'cover' })
    .jpeg({ quality: 85 })
    .toFile(path.join(__dirname, '../public/images/all-suits-hero.jpg'));
  console.log('✓ all-suits-hero.jpg');
}

main().catch(err => { console.error(err); process.exit(1); });
