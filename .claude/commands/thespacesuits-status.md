---
description: Read-only status summary for thespacesuits.com. Verifies against the live host only — never local dist/.
---

# /thespacesuits-status

Report the current state of thespacesuits.com. **Read-only.** Make no edits, no
commits, no pushes, no merges, no branch operations. Do not run a build.

## Verification rule — this is the point of the command

**Every claim about what is live must come from an HTTP response to
`https://www.thespacesuits.com`, with the status code stated.**

- Never read `dist/` to determine live state. A local build proves what *would*
  deploy, not what *is* deployed. This has produced false "verified live" reports
  repeatedly.
- Never infer live state from a commit existing, a build succeeding, or a task
  being marked done.
- Label every result with its source: `[LIVE]` for an HTTP response, `[REPO]` for
  a git or filesystem fact. Any row without `[LIVE]` is not a claim about production.
- If a check cannot be run, write `UNVERIFIED` and say why. Never infer a pass.

## 1. Deploy state `[REPO]`

```
git branch --show-current
git log --oneline -5
git log origin/main --oneline -3
git status --short
```

Report: current branch; whether local HEAD equals `origin/main`; any unpushed
commits (list them); any uncommitted changes.

Then report the most recent GitHub Actions run on `main`: number, commit SHA,
conclusion, and timestamp. Repo is `Kiriti-Metakosmos/thespacesuits` — **not**
`Metakosmos360`. If the newest run predates the newest commit on `origin/main`,
state plainly that the latest work is not deployed.

## 2. Live head tags `[LIVE]`

Fetch these three pages and report status code for each:

- `https://www.thespacesuits.com/` 
- `https://www.thespacesuits.com/suits/orlan-m`
- `https://www.thespacesuits.com/database`

From `/suits/orlan-m`, extract and print the actual values of:

| Field | Expected |
|---|---|
| `<title>` | full descriptive title |
| `og:title` | matches title minus the " \| The Spacesuits" suffix |
| `twitter:title` | same as og:title |
| `meta description` | populated, 120–158 chars |
| `link rel=canonical` | `https://www.thespacesuits.com/suits/orlan-m` |
| `og:url` | same as canonical |
| `og:image` | the suit's own image, not og-default.jpg |
| `article:published_time` | absent |
| share hrefs | `url=` populated on both X and LinkedIn |
| `ld+json` | count, and full payload printed |

Print values, not checkmarks. A checkmark hides a wrong value; the raw string doesn't.

## 3. Data integrity `[LIVE]`

From `https://www.thespacesuits.com/failures`, report the Year column for
FAIL-002 (expect 1965), FAIL-007 (expect 2013), FAIL-011 (expect 1967).
Any value rendering as the current year is a regression of the build-date bug.

## 4. Apex forwarding `[LIVE]`

```
curl -sI https://thespacesuits.com/
curl -sI https://thespacesuits.com/database
```

Report status and `Location` header for both. Expected: `301` to the matching
`https://www.thespacesuits.com/...` path.

Known state: two GoDaddy-locked A records sit on `@` (15.197.225.128,
3.33.251.168). A 301 forwarding rule to `https://www.thespacesuits.com` exists.
A `405` on paths means the A records are still shadowing the rule — that needs a
GoDaddy support call, not a code change.

## 5. Sitemap `[LIVE]`

Fetch `https://www.thespacesuits.com/sitemap.xml`. Report: status code, URL
count, count of any non-www URLs (must be zero), whether `<lastmod>` is present,
and any sitemap URL that does not return 200.

## 6. Outstanding work `[REPO]`

List open tasks with status. Do not mark anything complete without a `[LIVE]`
result above supporting it. Phase 2 (`staticwebapp.config.json` fix plus the
`build.js` copy step, as a single isolated commit) stays blocked until the apex
returns 301 on paths.

## Output

A compact table — check, source label, result, status code. Then a short
**Blocked on** list. No prose summary, no restating the task history.
If anything contradicts a previous "verified" claim, say so explicitly.
