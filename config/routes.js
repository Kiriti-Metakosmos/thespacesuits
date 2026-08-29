'use strict';
// Static content routes — single source of truth for build manifest and sitemap.
// Suit routes are generated separately from data/suits.js.
// /sitemap.xml, /robots.txt, /404 are build targets only — not sitemap entries.
module.exports = [
  { url: '/',                out: 'index.html' },
  { url: '/database',        out: 'database/index.html' },
  { url: '/database/iva',    out: 'database/iva/index.html' },
  { url: '/database/eva',    out: 'database/eva/index.html' },
  { url: '/failures',        out: 'failures/index.html' },
  { url: '/timeline',        out: 'timeline/index.html' },
  { url: '/subsystems',      out: 'subsystems/index.html' },
  { url: '/roadmap',         out: 'roadmap/index.html' },
  { url: '/about',           out: 'about/index.html' },
  { url: '/market',          out: 'market/index.html' },
  { url: '/programs/us',     out: 'programs/us/index.html' },
  { url: '/programs/soviet', out: 'programs/soviet/index.html' },
  { url: '/programs/china',  out: 'programs/china/index.html' },
  { url: '/programs/esa',    out: 'programs/esa/index.html' },
  { url: '/prototypes',            out: 'prototypes/index.html' },
  { url: '/articles',              out: 'articles/index.html' },
  { url: '/articles/glove-failures', out: 'articles/glove-failures/index.html' },
];
