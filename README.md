# The Spacesuits — Engineering Archive
### thespacesuits.com · Created & developed by Metakosmos Group

Definitive engineering archive for US, Soviet, Russian and Chinese spacesuit programs.

---

## Project Structure

```
thespacesuits/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Azure CI/CD pipeline
├── data/
│   ├── suits.js                # All suit variant data (from workbooks)
│   └── failures.js             # Failure cases and lessons
├── public/
│   ├── css/main.css            # All styles
│   ├── js/main.js              # Client JS (mobile menu, share)
│   └── images/                 # Suit images, OG images, favicon
├── views/
│   ├── layouts/main.hbs        # Master layout (SEO, nav, footer)
│   ├── partials/               # Reusable components
│   │   ├── suit-card.hbs
│   │   ├── suit-silhouette-sk1.hbs
│   │   ├── suit-silhouette-a7l.hbs
│   │   └── suit-silhouette-orlan.hbs
│   ├── pages/                  # Page templates
│   │   ├── home.hbs
│   │   ├── database.hbs
│   │   ├── failures.hbs
│   │   ├── timeline.hbs
│   │   ├── subsystems.hbs
│   │   ├── roadmap.hbs
│   │   ├── program.hbs
│   │   ├── about.hbs
│   │   └── 404.hbs
│   └── suits/
│       └── detail.hbs          # Individual suit page
├── server.js                   # Express app + all routes
├── package.json
└── staticwebapp.config.json    # Azure config
```

## Pages & Routes

| Route | Page |
|-------|------|
| `/` | Home — hero, featured suits, failures, manifesto |
| `/database` | All suits — filterable by nation/category |
| `/suits/:slug` | Individual suit detail with specs, lessons, share |
| `/failures` | Failure cases table — filterable by severity |
| `/timeline` | US + Soviet chronology in parallel columns |
| `/subsystems` | 16 subsystem deep-dives |
| `/roadmap` | P1/P2 development roadmap with time horizons |
| `/programs/us` | US NASA program page |
| `/programs/soviet` | Soviet/Russian program page |
| `/programs/china` | China Feitian (coming soon) |
| `/about` | About, methodology, sources, Metakosmos Group |
| `/sitemap.xml` | Auto-generated XML sitemap |
| `/robots.txt` | SEO robots file |

## Local Development

```bash
npm install
npm run dev        # nodemon auto-restart
# Open http://localhost:3000
```

## Adding a New Suit

Edit `data/suits.js` — add a new object following the existing schema:

```js
{
  id: "unique-id",
  variantId: "VAR-019",
  name: "Suit Display Name",
  slug: "url-slug",          // becomes /suits/url-slug
  nation: "us",              // us | soviet | china
  category: "EVA",           // IVA | IEVA | EVA
  pressurePsi: 4.3,
  massLb: 100,
  // ... all other fields
  meta: {
    title: "SEO page title",
    description: "SEO meta description"
  }
}
```

Commit and push → CI/CD deploys automatically.

## Azure Deployment

### One-time setup

1. Create Azure Static Web App in Azure Portal
2. Link to this GitHub repository
3. Add secret `AZURE_STATIC_WEB_APPS_API_TOKEN` to GitHub repo settings
4. Configure custom domain `thespacesuits.com` in Azure portal

### CI/CD Flow

```
git push main
  → GitHub Actions triggers
  → Install dependencies
  → Health check (curl tests)
  → Deploy to Azure Static Web Apps
  → Live at thespacesuits.com
```

Pull requests get automatic preview URLs.

## SEO

Every page has:
- `<title>` and `<meta description>`
- Open Graph tags (og:title, og:description, og:image, og:url)
- Twitter/X Card (summary_large_image)
- JSON-LD structured data (WebSite schema)
- Individual suit pages have Product schema
- Auto-generated sitemap.xml
- robots.txt pointing to sitemap
- Canonical URLs on every page

## Adding Images

Drop images into `public/images/`:
- `og-default.jpg` — 1200×630px default social share image
- `suits/apollo-a7l.jpg` — per-suit OG images
- `favicon.svg` — SVG favicon
- `apple-touch-icon.png` — 180×180px

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 3000) |

## Credits

Created & developed by **Metakosmos Group**  
Data sources: NASA, Zvezda, OIG reports, Abramov & Skoog, Thomas & McMann
