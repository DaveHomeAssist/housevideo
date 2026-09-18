# FMP chrome unify

## On this PR
- Canonical theme: `/css/av-theme.css` (rust) + `/css/fonts.css` (DM Sans / DM Serif / JetBrains Mono)
- Shared chrome: `fmp/chrome.css` + `fmp/chrome.js` (theme select bind, legacy toggle upgrade, stylesheet ensure, backfocus AV Suite → `/fmp/`, guide font remap)
- `fmp/theme.js` loads `chrome.js` so existing theme.js pages get the upgrade
- House family: `fmp/house/house-tokens.css` remaps Inter/`#285e8d` → av tokens; HTML links fonts/av-theme/tokens + Light/Dark/Auto select
- Hub, guide, gear, house, build, ptz, rig, backfocus: breadcrumb System by Dave / FMP Video Operations / {page} + theme control
- Guide: bad `@font-face` removed or remapped; prefers `fonts.css`
- Camera: fonts + av-theme + hub favicon/theme-color; app chrome kept; return to `/fmp/`
- Stubs `404.html` + `fmp-index/index.html`: `domain-move.css`

## Deferred
- Unused `css/style.css` left in place (not deleted)
- `fmp-house-video` SPA out of scope
- Full rewrite of `house.css` not done (tokens override instead)
