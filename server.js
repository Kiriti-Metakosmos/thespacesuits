const express = require('express');
const { engine } = require('express-handlebars');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

const { SITE_URL } = require('./config/site');
const suits = require('./data/suits');
const failures = require('./data/failures');

const app = express();
const PORT = process.env.PORT || 3000;

// ── Security & performance ──────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());

// ── Static assets ───────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '7d',
  etag: true
}));

// ── Handlebars engine ────────────────────────────────────────────
app.engine('hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),
  helpers: {
    eq: (a, b) => a === b,
    or: (a, b) => a || b,
    formatPressure: (suit) => {
      if (suit.pressurePsi) return `${suit.pressurePsi} psi / ${suit.pressureKpa} kPa`;
      if (suit.pressureHpa) return `${suit.pressureHpa} hPa`;
      return 'TBD';
    },
    formatMass: (suit) => {
      if (suit.systemMassLb) return `${suit.systemMassLb} lb (system)`;
      if (suit.massLb) return `${suit.massLb} lb`;
      return 'TBD';
    },
    formatEVA: (hr) => hr ? `${hr} hours` : 'N/A',
    nationLabel: (n) => ({ us: 'United States', soviet: 'Soviet / Russia', china: 'China / CMSA', esa: 'Europe / ESA' }[n] || n),
    nationColor: (n) => ({ us: 'cyan', soviet: 'gold', china: 'gold', esa: 'purple' }[n] || 'paper'),
    severityColor: (s) => ({ Critical: 'red', High: 'gold', Medium: 'paper3' }[s] || 'paper3'),
    truncate: (str, len) => str && str.length > len ? str.slice(0, len) + '…' : str,
    currentYear: () => new Date().getFullYear(),
    json: (ctx) => JSON.stringify(ctx),
    statusColor: (s) => {
      if (!s) return 'paper3';
      if (s.includes('Active')) return 'green';
      if (s.includes('development')) return 'purple';
      return 'paper3';
    },
    hasPhoto: (slug) => fs.existsSync(path.join(__dirname, 'public/images/suits', slug + '.jpg'))
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// ── SEO helpers ─────────────────────────────────────────────────
const siteUrl = SITE_URL;
const defaultMeta = {
  siteName: 'The Spacesuits',
  siteUrl,
  twitterHandle: '@thespacesuits',
  defaultTitle: 'The Spacesuits — Engineering Archive',
  defaultDescription: 'Definitive engineering archive of US, Soviet, Russian and Chinese spacesuit programs. 40+ variants, 70 years of history, real failure cases and technical analysis.',
  defaultImage: `${siteUrl}/images/og-default.jpg`
};

// ── Routes ───────────────────────────────────────────────────────

// HOME
app.get('/', (req, res) => {
  const featured = suits.filter(s => ['apollo-a7l','berkut','enhanced-emu','orlan-m'].includes(s.id));
  const criticalFailures = failures.filter(f => f.severity === 'Critical').slice(0, 4);
  const nations = [...new Set(suits.map(s => s.nation))];
  res.render('pages/home', {
    title: defaultMeta.defaultTitle,
    meta: { ...defaultMeta, canonical: siteUrl },
    suits: suits.slice(0, 6),
    featured,
    criticalFailures,
    totalSuits: suits.length,
    totalFailures: failures.length,
    totalNations: nations.length
  });
});

// DATABASE — all suits
app.get('/database', (req, res) => {
  const filtered = suits.slice().sort((a, b) => (a.firstUse || 2024) - (b.firstUse || 2024));
  res.render('pages/database', {
    title: 'Suit Database — The Spacesuits',
    meta: {
      ...defaultMeta,
      pageTitle: 'Suit Database',
      pageDescription: 'Complete spacesuit variant database. 40+ suits across US, Soviet and Russian programs. Filter by nation, category and era.',
      canonical: `${siteUrl}/database`
    },
    suits: filtered,
    totalCount: filtered.length
  });
});

// INDIVIDUAL SUIT
app.get('/suits/:slug', (req, res) => {
  const suit = suits.find(s => s.slug === req.params.slug);
  if (!suit) return res.status(404).render('pages/404', { title: '404 — The Spacesuits', meta: defaultMeta });
  const related = suits.filter(s => s.id !== suit.id && s.nation === suit.nation).slice(0, 3);
  const suitFailures = failures.filter(f => {
    // Program name substring match (existing)
    if (f.program.toLowerCase().includes(suit.program.toLowerCase())) return true;
    if (f.program.toLowerCase().includes(suit.name.split(' ')[0].toLowerCase())) return true;
    // Nation-scoped failures for China and ESA (program-level entries)
    if (['china', 'esa'].includes(suit.nation) && f.nation === suit.nation) return true;
    // Subsystem tag overlap
    if (suit.subsystemTags && suit.subsystemTags.some(tag =>
      f.subsystem && f.subsystem.toLowerCase().includes(tag.replace('-', ' ')))) return true;
    return false;
  });
  res.render('suits/detail', {
    title: suit.meta.title,
    meta: {
      ...defaultMeta,
      pageTitle: suit.name,
      pageDescription: suit.meta.description,
      canonical: `${siteUrl}/suits/${suit.slug}`,
      ogImage: `${siteUrl}/images/suits/${suit.slug}.jpg`
    },
    ...suit,
    related,
    suitFailures
  });
});

// FAILURES
app.get('/failures', (req, res) => {
  const severity = req.query.severity || 'all';
  let filtered = failures;
  if (severity !== 'all') filtered = filtered.filter(f => f.severity === severity);
  res.render('pages/failures', {
    title: 'Failure Cases — The Spacesuits',
    meta: {
      ...defaultMeta,
      pageTitle: 'Failure Modes & Lessons',
      pageDescription: 'Documented spacesuit failures, near-misses and engineering lessons. EVA-23, xEMU mass overrun, pure oxygen fire, and 50+ more cases.',
      canonical: `${siteUrl}/failures`
    },
    failures: filtered,
    severity,
    totalCount: filtered.length
  });
});

// TIMELINE
app.get('/timeline', (req, res) => {
  const nonProto = suits.filter(s => !s.isPrototype);
  const byNation = (n) => nonProto.filter(s => s.nation === n)
    .sort((a, b) => (a.firstUse || 2030) - (b.firstUse || 2030));
  res.render('pages/timeline', {
    title: 'Program Timeline — The Spacesuits',
    meta: {
      ...defaultMeta,
      pageTitle: 'Development Timeline',
      pageDescription: '70 years of spacesuit development from 1931 Soviet pre-space era to Artemis AxEMU. US and Soviet programs in parallel chronology.',
      canonical: `${siteUrl}/timeline`
    },
    usTimeline:     byNation('us'),
    sovietTimeline: byNation('soviet'),
    chinaTimeline:  byNation('china'),
    esaTimeline:    byNation('esa')
  });
});

// SUBSYSTEMS
app.get('/subsystems', (req, res) => {
  const SUB_DEFS = [
    { tag:'gloves',       label:'Gloves & Dexterity',      color:'gold',
      description:'Most persistent mission-limiting subsystem across all three programs. 12 development lines documented. Torque vs thermal paradox at finger-joint level remains unsolved.' },
    { tag:'helmet',       label:'Helmets & Visors',         color:'cyan',
      description:'Visibility, thermal load, comms, dust contamination and maintainability. Helmet penetrations in dusty lunar environments proved consistently problematic across Apollo and concept studies.' },
    { tag:'life-support', label:'Life Support / LSS',        color:'red',
      description:'Vehicle-fed IVA vs umbilical EVA vs autonomous backpack. EVA-23 water intrusion (2013) proved contamination sensitivity is life-critical. Water loop management now rated P1 priority.' },
    { tag:'torso-entry',  label:'Torso & Entry Systems',     color:'cyan',
      description:'Front vs rear-entry architecture. Soviets pioneered rear-entry from KRECHET (1967) through Orlan. US adopted modular HUT from Shuttle EMU. Rear-entry enables solo donning — critical for planetary surface ops.' },
    { tag:'mobility',     label:'Mobility Joints',           color:'purple',
      description:'Link-net restraint (IVA ideal, EVA insufficient) to hard-bearing modular joints. Soviet and US programs independently converged on convolute→hard-bearing progression. Partial-gravity mobility remains under-characterised.' },
    { tag:'thermal',      label:'Thermal & Materials',       color:'green',
      description:'LCG became mandatory post-Apollo as EVA duration increased. Dust, cold shadow, and hot-sun regimes simultaneously present at lunar south pole. Modular outer layers and self-cleaning concepts needed.' },
  ];
  const subsystems = SUB_DEFS.map(def => {
    const tagged = suits.filter(s => s.subsystemTags && s.subsystemTags.includes(def.tag));
    return {
      ...def,
      count: tagged.length,
      examples: tagged.slice(0, 3).map(s => ({ name: s.name, slug: s.slug }))
    };
  });
  res.render('pages/subsystems', {
    title: 'Subsystem Analysis — The Spacesuits',
    meta: {
      ...defaultMeta,
      pageTitle: 'Subsystem Analysis',
      pageDescription: '16 spacesuit subsystems traced across 70 years: gloves, helmets, life support, mobility joints, thermal, torso entry and more.',
      canonical: `${siteUrl}/subsystems`
    },
    subsystems
  });
});

// ROADMAP
app.get('/roadmap', (req, res) => {
  const PRIORITIES = [
    { tag:'gloves',          priority:'P1', priorityLabel:'Critical', color:'red',
      label:'Gloves & Dexterity',
      description:'Hand fatigue, contact injury, cold-object handling and sizing remain the most persistent mission limiter across every program on record.',
      h1:'Digital fit library; instrumented torque testing; TMG swap simplification',
      h2:'Active assistance / smart restraint concepts; improved maintainability' },
    { tag:'life-support',    priority:'P1', priorityLabel:'Critical', color:'red',
      label:'Life Support / Water Loop',
      description:'EVA-23 (2013) demonstrated contamination sensitivity is life-critical, not a nuisance. Separator blockage allowed free water into Parmitano\'s helmet.',
      h1:'Redesign separator; add free-water detection; emergency helmet management',
      h2:'Modular contamination-tolerant water processing; easier on-orbit maintenance' },
    { tag:'mass-integration', priority:'P1', priorityLabel:'Critical', color:'red',
      label:'Mass / Vehicle Integration',
      description:'xEMU failure demonstrated exploration suit feasibility can collapse on mass allocation alone, not hardware performance.',
      h1:'Lock mass budgets at subsystem level before elaboration; live allocation model',
      h2:null },
    { tag:'supply-chain',    priority:'P2', priorityLabel:'High',     color:'gold',
      label:'Supply Chain / Digital Thread',
      description:'Aging Enhanced EMU fleet showed industrial-base fragility can become mission risk independent of hardware condition. OIG 2025 critical flag.',
      h1:'Map critical parts, alternate suppliers, refurbishment bottlenecks',
      h2:'Digital lifecycle traceability with predictive maintenance metrics' },
  ];
  const roadmapPriorities = PRIORITIES.map(p => ({
    ...p,
    cases: failures.filter(f => f.roadmapTag === p.tag),
    suitCount: suits.filter(s => s.subsystemTags && s.subsystemTags.includes(p.tag)).length
  }));
  res.render('pages/roadmap', {
    title: 'Development Roadmap — The Spacesuits',
    meta: {
      ...defaultMeta,
      pageTitle: 'Development Roadmap',
      pageDescription: 'Priority spacesuit subsystem improvements for 0–3yr, 3–7yr and 7yr+ horizons. Synthesized from 70 years of US and Soviet operational data.',
      canonical: `${siteUrl}/roadmap`
    },
    roadmapPriorities
  });
});

// PROGRAMS
app.get('/programs/:nation', (req, res) => {
  const nations = { us: 'United States', soviet: 'Soviet / Russian', china: 'China / CMSA', esa: 'Europe / ESA' };
  const nation = req.params.nation;
  if (!nations[nation]) return res.status(404).render('pages/404', { title: '404', meta: defaultMeta });
  const programSuits = suits.filter(s => s.nation === nation);
  res.render('pages/program', {
    title: `${nations[nation]} Program — The Spacesuits`,
    meta: {
      ...defaultMeta,
      pageTitle: `${nations[nation]} Spacesuit Program`,
      pageDescription: `Complete archive of ${nations[nation]} spacesuit development. ${programSuits.length} variants documented.`,
      canonical: `${siteUrl}/programs/${nation}`
    },
    nation,
    nationLabel: nations[nation],
    programSuits
  });
});

// PROTOTYPES
app.get('/prototypes', (req, res) => {
  const prototypeSuits = suits.filter(s => s.isPrototype === true);
  res.render('pages/prototypes', {
    title: 'Prototype & Experimental Suits — The Spacesuits',
    meta: {
      ...defaultMeta,
      pageTitle: 'Prototype & Experimental Suits',
      pageDescription: 'Pre-spaceflight research prototypes and experimental pressure suit programs. 16 experimental variants from 1956–1974 documented.',
      canonical: `${siteUrl}/prototypes`
    },
    suits: prototypeSuits,
    totalCount: prototypeSuits.length
  });
});

// ABOUT
app.get('/about', (req, res) => {
  res.render('pages/about', {
    title: 'About — The Spacesuits Engineering Archive',
    meta: {
      ...defaultMeta,
      pageTitle: 'About the Archive',
      pageDescription: 'The Spacesuits is a structured engineering archive created by Metakosmos Group. Primary sources, technical analysis, real failure cases.',
      canonical: `${siteUrl}/about`
    }
  });
});

// SITEMAP
app.get('/sitemap.xml', (req, res) => {
  res.header('Content-Type', 'application/xml');
  const suitUrls = suits.map(s => `
  <url>
    <loc>${siteUrl}/suits/${s.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${siteUrl}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>${siteUrl}/database</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>${siteUrl}/failures</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>${siteUrl}/timeline</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>${siteUrl}/subsystems</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>${siteUrl}/roadmap</loc><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>${siteUrl}/programs/us</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>${siteUrl}/programs/soviet</loc><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>${siteUrl}/about</loc><changefreq>yearly</changefreq><priority>0.5</priority></url>
  ${suitUrls}
</urlset>`);
});

// ROBOTS
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nSitemap: ${siteUrl}/sitemap.xml`);
});

// 404
app.use((req, res) => {
  res.status(404).render('pages/404', { title: '404 — The Spacesuits', meta: defaultMeta });
});

app.listen(PORT, () => console.log(`The Spacesuits running on http://localhost:${PORT}`));

module.exports = app;
