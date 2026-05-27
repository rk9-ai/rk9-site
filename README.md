# rk9-site

Public marketing site for **RK9 AI OY** — [rk9.fi](https://rk9.fi).

Bilingual (FI default / EN), single-page, hash-routed. Four pages: Etusivu (Home),
Yhtiö (About), Yhteystiedot (Contact), Tietosuoja (Privacy). Built from a Claude Design
handoff; the design's Tweaks panel is intentionally not shipped — the locked configuration
lives in `src/App.jsx` (`CONFIG`).

## Stack

- **Vite + React 18** → static build in `dist/`.
- **nginx:alpine** container serves the build (`Dockerfile` + `deploy/nginx/container.conf`).
- No backend, no database. Animated agent-network canvas (Mesh), coords HUD, activity ticker
  are all client-side.

## Develop

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview  # serve the production build
```

## Locked design configuration (`src/App.jsx`)

| token | value | meaning |
|-------|-------|---------|
| palette | `pine` | Petäjä — cream + green |
| fontPair | `editorial` | Instrument Serif + Geist |
| hero | `network` | agent-network hero |
| canvas | `mesh` | MESH.GRID visualisation |
| logo | `grid` | 3×3 dot mark |
| hud | `true` | coords HUD (hidden < 760px) |
| orch | `os` | "Yhtiön käyttöjärjestelmä" orchestration copy |

To explore other palettes/fonts/heroes, change `CONFIG` and rebuild (the variants all
still exist in `src/tokens.js`, `src/effects.jsx`, `src/copy.js`).

## Deploy

Hosting follows the per-company RK9 pattern:

- **Container** runs on `docker.rk9.fi` at port `3050`, deployed to `/srv/rk9-site/prod/`.
- **`nginx.rk9.fi`** reverse-proxies the public apex `rk9.fi` to it over TLS.

CI: `.github/workflows/deploy.yml` (manual `workflow_dispatch`) builds the image on
docker.rk9.fi, pushes to `ghcr.io/mv50000/rk9-site`, and runs `docker compose up -d`.

**Required before first deploy:**
1. Register a `[self-hosted, docker]` Actions runner for this repo (shared paperclip-01 runner).
2. Repo secret `DEPLOY_SSH_KEY` — the `paperclip`/`rk9admin` deploy key for docker.rk9.fi.
3. **DNS** (registrar): A/AAAA `rk9.fi` + `www.rk9.fi` → nginx.rk9.fi public IP.
   Leave MX / SPF / DKIM / DMARC records untouched — email is unaffected.
4. **nginx.rk9.fi vhost + TLS**: apply `deploy/nginx/rk9.fi.conf` and run
   `certbot --nginx -d rk9.fi -d www.rk9.fi` (rk9admin, via SSH).
5. **Firewall** on docker.rk9.fi: allow `192.168.1.17 → 192.168.1.58:3050`.

## Docker (local)

```bash
docker build -t rk9-site .
docker run --rm -p 3050:80 rk9-site
# → http://localhost:3050  (health: /healthz)
```
