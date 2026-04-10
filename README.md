# Deploy Fullstack Application Exercise

A full-stack application with a React + Vite frontend and an Express.js API, deployed with a fully automated CI/CD pipeline.

---

## Live URLs

| Service | URL |
|---|---|
| Frontend | [https://resplendent-fairy-b6a0ba.netlify.app/] |
| API | [https://docker-ci-cd-deploy-api.onrender.com/] |
| API Docs | [https://tibitoe.github.io/Docker-CI-CD-Deploy/] |

---

## Services

| Service | Tech | Hosting |
|---|---|---|
| Frontend | React + Vite, served by nginx | Netlify |
| API | Express.js (Node.js) | Render |
| API Docs | Swagger UI + OpenAPI 3.0 | GitHub Pages |

---

## Running Locally

**Prerequisites:** Node.js 22+, Docker (optional)

### Without Docker

Start the API:
```bash
cd api
npm install
npm run dev
# API available at http://localhost:3000
```

Start the frontend in a separate terminal:
```bash
cd frontend
npm install
npm run dev
# Frontend available at http://localhost:5173
```

The frontend proxies `/api` → `http://localhost:3000` in dev mode via Vite's proxy config, so no CORS issues locally.

### With Docker

```bash
docker compose up --build
# Frontend at http://localhost:80
# API at http://localhost:3000
```

### Running Tests

```bash
# API
cd api && npm test

# Frontend
cd frontend && npm test
```

---

## CI/CD Pipeline

The pipeline runs on every **push** and **pull request** to `main` via GitHub Actions.

### Jobs

```
push / PR to main
│
├── Build & Test          ← always runs
│     install deps (cached), run tests, build frontend
│
├── CodeQL Analysis       ← runs after test passes
│     static security scan of JS/JSX across both projects
│
└── (push to main only)
      ├── Deploy Backend  ← triggers Render deploy hook (only if api/ changed)
      ├── Deploy Frontend ← builds and publishes to Netlify via deploy action
      └── Publish Docs    ← generates openapi.json, deploys Swagger UI to GitHub Pages (only if api/ changed)
```

The deploy jobs only run when all tests pass and the push is to `main`, not on pull requests.

`node_modules` for both projects are cached by the hash of their `package-lock.json`, skipping `npm ci` entirely on unchanged dependencies.

---

## Troubleshooting with Logs

When something goes wrong the approach is top-down: start in the pipeline to locate the failure, then go to the relevant hosting platform for details.

### GitHub Actions

Open the **Actions** tab in the repo. Click the failed run and expand the failed job.

- **Build & Test failed** — look for the failing test assertion or a Vite build error. Fix the code and push again.
- **Deploy Backend failed** — if `curl` returns 404, the deploy hook URL is wrong or expired. Regenerate it on Render and update the `RENDER_DEPLOY_HOOK_URL` secret in GitHub → Settings → Secrets.
- **Deploy Frontend failed** — usually a missing env var or a secrets scan block. Netlify prints the exact reason in the last few lines of the log.

### Render (API)

Open the Web Service → **Logs** tab. Key lines to look for:

- `[INFO] API is listening to 0.0.0.0:PORT` — server started correctly. If missing, the process crashed on startup.
- `[FATAL] Uncaught exception` / `[FATAL] Unhandled promise rejection` — process is about to exit with code 1. The stack trace below it shows the cause.
- `[ERROR]` — a caught Express error on a specific route, includes method and URL.
- `[404]` — a route was hit that doesn't exist, often a mismatch between what the frontend calls and what the API registers.
- Morgan lines (e.g. `GET / 200 4ms`) — if the frontend shows "offline" but no Morgan lines appear, the issue is `VITE_API_URL` on Netlify, not the API itself.

Check **Events** in the Render sidebar to see deploy history. A failed deploy shows `Exited with status 1` and links to build output.

### Netlify (Frontend)

Open the site → **Deploys** → click the deploy in question.

- **Build logs** — full output of `npm install && npm run build`. Vite errors appear here exactly as they would locally.
- **Secrets scanning failure** — Netlify prints which key and file triggered it. Add the key to `SECRETS_SCAN_OMIT_KEYS` in `netlify.toml` if it is not a real secret.
- **Wrong API URL** — check Site → **Environment variables** and confirm `VITE_API_URL` matches the Render URL exactly (no trailing slash). Always trigger a fresh deploy after changing it — `VITE_*` vars are baked in at build time.

### Quick Reference

| Symptom | Where to look |
|---|---|
| Tests failing | GitHub Actions → Build & Test |
| Deploy hook 404 | GitHub Actions → Deploy Backend + regenerate hook on Render |
| API not starting | Render → Logs, look for `[FATAL]` or missing `[INFO] listening` |
| Frontend shows "offline" | Render → Logs to confirm requests arrive, then check `VITE_API_URL` on Netlify |
| Netlify deploy fails | Netlify → Deploys → failed deploy → build log |
| Site shows wrong content | Netlify → check `VITE_API_URL`, trigger fresh deploy |
