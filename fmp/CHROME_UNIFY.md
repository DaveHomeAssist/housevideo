# FMP chrome unify (branch notes)

## Unified on this PR
- Canonical theme: `/css/av-theme.css` (rust) + `/css/fonts.css` (DM Sans / DM Serif / JetBrains Mono)
- Shared chrome: `fmp/chrome.css` + `fmp/chrome.js` (theme select bind, legacy toggle upgrade, stylesheet ensure, backfocus AV Suite → `/fmp/`)
- `fmp/theme.js` also loads `chrome.js` so pages that already include theme get the upgrade
- House family: `fmp/house/house-tokens.css` remaps Inter/`#285e8d` → av tokens; linked from house/gear/build/ptz
- Hub, guide, gear, house, build, ptz, rig, backfocus: breadcrumb `System by Dave / FMP Video Operations / {page}` + Light/Dark/Auto
- Guide: bad `@font-face` removed; uses `fonts.css`
- Camera pages: fonts + av-theme + hub favicon/theme-color; keep app chrome; return link to `/fmp/`
- Stubs `404.html` + `fmp-index/index.html`: `domain-move.css`

## Deferred / notes
- Unused `css/style.css` left in place (not deleted)
- `fmp-house-video` SPA out of scope
- Full rewrite of `house.css` not done (tokens override instead)
- Guide/rig keep some local layout CSS; brand face/accent follow shared tokens
