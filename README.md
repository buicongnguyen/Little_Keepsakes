# Little Keepsakes

A small, cozy 3D attic to explore: find nine little treasures, restore three keepsakes, earn buttons and decorate the room. No timers and no way to lose. Built with Three.js; everything in the room is modelled in code.

**Play:** https://buicongnguyen.github.io/Little_Keepsakes/

This was the first prototype of what became [The Lantern Picnic](https://github.com/buicongnguyen/picnic_game). The concept, research and plan are in [docs/DESIGN.md](docs/DESIGN.md).

## Run

```sh
npm install
npm run dev            # http://localhost:4173
npm test               # game rules, saves and levels
npm run test:browser   # desktop and phone play-through (needs npm run dev; KEEPSAKES_URL=<url> tests another site)
```

`?debug` exposes `window.__keepsakes` for tests. Progress is saved in the browser.

## Deploy

Every push to `main` runs [.github/workflows/pages.yml](.github/workflows/pages.yml): `npm ci`, `npm test`, `npm run build`, then publishes `dist/` to GitHub Pages.
