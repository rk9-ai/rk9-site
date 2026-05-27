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

CI: `.github/workflows/deploy.yml` (manual `workflow_dispatch`) builds the image on the
deploy host, pushes to `ghcr.io/mv50000/rk9-site`, and runs `docker compose up -d`. The
container serves on port `3050`; a reverse proxy terminates TLS for the public apex `rk9.fi`.

Deploy target (host/user/path) is held in repo **Variables**
(`DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_PATH`); the deploy SSH key is the `DEPLOY_SSH_KEY`
repo **Secret**. A `[self-hosted, docker]` Actions runner must be registered for the repo.

Public exposure (DNS A/AAAA for the apex, a reverse-proxy vhost, and a TLS cert) is managed
out-of-band on the infra host — email (MX/SPF/DKIM/DMARC) is independent and unaffected.

## Docker (local)

```bash
docker build -t rk9-site .
docker run --rm -p 3050:80 rk9-site
# → http://localhost:3050  (health: /healthz)
```

## License

[MIT](LICENSE) © 2026 RK9 AI OY
