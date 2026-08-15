'use strict';
process.env.NODE_ENV = 'production';

const fs   = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist');
const PORT = 3099;

// Set port before requiring server so it binds on 3099, not 3000
process.env.PORT = String(PORT);
require('./server');

const suits = require('./data/suits');

const BASE = `http://localhost:${PORT}`;

const ROUTES = [
  { url: '/',                out: 'index.html' },
  { url: '/database',        out: 'database/index.html' },
  { url: '/database/iva',    out: 'database/iva/index.html' },
  { url: '/database/eva',    out: 'database/eva/index.html' },
  { url: '/failures',        out: 'failures/index.html' },
  { url: '/timeline',        out: 'timeline/index.html' },
  { url: '/subsystems',      out: 'subsystems/index.html' },
  { url: '/roadmap',         out: 'roadmap/index.html' },
  { url: '/about',           out: 'about/index.html' },
  { url: '/programs/us',     out: 'programs/us/index.html' },
  { url: '/programs/soviet', out: 'programs/soviet/index.html' },
  { url: '/programs/china',  out: 'programs/china/index.html' },
  { url: '/programs/esa',    out: 'programs/esa/index.html' },
  { url: '/prototypes',      out: 'prototypes/index.html' },
  { url: '/sitemap.xml',     out: 'sitemap.xml' },
  { url: '/robots.txt',      out: 'robots.txt' },
  { url: '/404',             out: '404/index.html' },
  ...suits.map(s => ({ url: `/suits/${s.slug}`, out: `suits/${s.slug}/index.html` })),
];

function copyDir(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    entry.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d);
  }
}

async function build() {
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });

  // Give the server time to bind to the port
  await new Promise(r => setTimeout(r, 200));

  console.log(`\nRendering ${ROUTES.length} routes...\n`);

  let ok = 0, fail = 0;

  for (const route of ROUTES) {
    try {
      const res = await fetch(`${BASE}${route.url}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.text();
      const outPath = path.join(DIST, route.out);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, body, 'utf8');
      console.log(`  ✓  ${route.url.padEnd(28)} → dist/${route.out}`);
      ok++;
    } catch (err) {
      console.error(`  ✗  ${route.url}: ${err.message}`);
      fail++;
    }
  }

  // Copy public/ assets into dist/
  const publicDir = path.join(__dirname, 'public');
  if (fs.existsSync(publicDir)) {
    copyDir(publicDir, DIST);
    console.log(`\n  ✓  public/ → dist/`);
  }

  // Copy staticwebapp.config.json into dist/ so Azure picks it up
  const configSrc = path.join(__dirname, 'staticwebapp.config.json');
  if (fs.existsSync(configSrc)) {
    fs.copyFileSync(configSrc, path.join(DIST, 'staticwebapp.config.json'));
    console.log(`  ✓  staticwebapp.config.json → dist/`);
  }

  console.log(`\nBuild complete — ${ok} pages rendered, ${fail} errors.\n`);
  process.exit(fail > 0 ? 1 : 0);
}

build().catch(err => { console.error(err); process.exit(1); });
