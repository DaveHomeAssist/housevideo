# FMP chrome unify (branch notes)

## Done on branch
- fmp/chrome.js + fmp/chrome.css
- fmp/house/house-tokens.css (Inter/blue → av-theme rust + DM Sans)
- fmp/house/house.js select-safe theme label
- fmp/ref.js select-safe theme label
- fmp/index.html fonts + breadcrumb System by Dave / FMP Video Operations

## Still applying in follow-up commits on this PR
- Wire house/gear/build/ptz HTML to tokens + Light/Dark/Auto select
- Guide fonts.css + theme select
- Back focus FMP breadcrumb + theme select
- Rig shared chrome
- Camera favicon/theme-color/fonts
- Stub domain-move.css note; style.css unused

## Verify
- /fmp/ breadcrumb + theme select
- /fmp/house/ accent is rust not house blue; no Inter
- /fmp/guide/ loads DM Sans via fonts.css
- /backfocus/ returns to /fmp/ not AV Suite
