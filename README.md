# rk9-site

Public marketing site for **RK9 AI OY** — [rk9.fi](https://rk9.fi).

A single-page site: the "Elävä graafi" homepage — a 14 000-particle WebGL
organism that morphs through nine scroll-driven scenes (sphere → four
vendors → one disc → ring cycle → the three products → "3" → a dotted line) —
plus the 30 s explainer (`/selitys`) and a static privacy page. Bilingual (FI default / EN
toggle). Raw WebGL, no frameworks, no build step: fonts and scripts are
inlined, so the whole site is three HTML files and one image.

## Stack

- **Static files** in `site/` — committed ready-to-serve.
  - `site/index.html` — the homepage (self-contained, ~175 kB).
  - `site/tietosuoja.html` — privacy policy (served at `/tietosuoja`).
  - `site/selitys.html` — the 30 s explainer (Canvas 2D, served at `/selitys`).
    The homepage "Katso 30 s" dialog loads the same file in an iframe
    (`/selitys.html?embed=1&lang=fi|en`) only when opened — one source.
  - `site/og.jpg` — social share image (1200×630).
- **nginx:alpine** container serves them (`Dockerfile` + `deploy/nginx/container.conf`).
- No backend, no database, no node_modules.

## Develop

```bash
cd site && python3 -m http.server 8080   # http://localhost:8080
```

The homepage is generated from a template that inlines the brand fonts
(Instrument Serif, Geist, Geist Mono — Google Fonts latin subsets as base64
`@font-face` data URIs). Edit `site/index.html` directly for small changes;
regenerate from the template for structural ones.

## Accessibility

All content is real HTML (the canvas is `aria-hidden`); `prefers-reduced-motion`
freezes the particle animation; sound is opt-in behind a button; the page works
as a plain text page without JavaScript or WebGL.

## Deploy

`gh workflow run deploy.yml` (manual `workflow_dispatch`, self-hosted runner).
Builds the image on the deploy host, pushes to GHCR, `docker compose up -d`,
health + smoke checks (`/`, `/tietosuoja`, `/selitys`, `/og.jpg`, `/classic` → 301).

Rollback: the deploy host keeps `previous-tag`; the pre-2026-08 React SPA
lives in git history and as image `ghcr.io/rk9-ai/rk9-site:sha-cb6913e`.
