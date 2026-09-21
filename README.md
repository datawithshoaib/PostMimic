# PostMimic - LinkedIn Style Cloner & Multi-Agent Studio

**PostMimic** connects to a user's LinkedIn profile (or demo presets), extracts historic posts, analyzes writing style DNA, and runs a **multi-agent feedback loop** (Writer + Reviewer + loop controller) to draft publish-ready LinkedIn posts.

The stack is split into a **Next.js** frontend and a **Python (FastAPI)** API backend.

---

## Key Features

1. **Authentication & profiles** — PBKDF2 password hashing, demo login, profile management.
2. **LinkedIn historic posts** — URL, presets, or custom paste; engagement and style metadata.
3. **Style DNA** — LLM persona analysis (hooks, structure, emoji/hashtag policy, CTAs).
4. **Multi-agent studio** — Writer/reviewer loop with trace UI and human-in-the-loop refinement.
5. **LinkedIn preview** — Feed-style card, copy/export, draft history.

---

## Quick Start

### 1. Environment

Create `.env` at the repo root:

```env
GROQ_API_KEY=gsk_your_groq_api_key
```

Optional:

```env
PORT=8080
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### 2. Start the app

```bash
pip install -r requirements.txt
python run.py
```

Or double-click **`start.bat`** on Windows.

This starts **both** the FastAPI API and the Next.js dev server, opens the UI in your browser, and runs `npm install` in `frontend/` on first launch if needed.

- UI: **http://localhost:3000**
- API: **http://localhost:8080**
- OpenAPI: **http://localhost:8080/docs**

Optional env: `FRONTEND_PORT`, `PORT`, `API_PROXY_TARGET` (set automatically by `run.py` when the API port changes).

The Next.js dev server proxies `/api/*` and `/health` to the backend (see `frontend/next.config.mjs`).

**API only** (if Node.js is missing): `run.py` still starts the API; run `cd frontend && npm run dev` separately for the UI.

---

## Architecture

```
PostMimic/
├── backend/                      # Python API
│   ├── app/
│   │   ├── main.py               # FastAPI app factory, CORS, router mount
│   │   ├── config.py             # Env, DB path, CORS origins
│   │   ├── db.py                 # SQLite schema & migrations
│   │   ├── auth.py               # Sessions & password security
│   │   ├── routers/              # HTTP layer (thin controllers)
│   │   │   ├── auth.py
│   │   │   ├── profile.py
│   │   │   ├── linkedin.py
│   │   │   ├── posts.py
│   │   │   ├── style.py
│   │   │   ├── generation.py
│   │   │   └── drafts.py
│   │   ├── schemas/              # Pydantic request/response models
│   │   ├── services/             # App-specific persistence helpers
│   │   ├── linkedin_service.py   # Post extraction & presets
│   │   ├── style_analyzer.py     # Style DNA LLM pipeline
│   │   └── agent_workflow.py     # Multi-agent loop
│   └── requirements.txt
├── data/                         # Preset datasets (raw & processed posts for demo seeding)
├── frontend/                     # Next.js 15 (App Router)
│   ├── src/app/                  # layout, page, global styles
│   ├── src/components/           # UI (studio, historic, modals, …)
│   └── src/lib/api/client.js     # Typed fetch client
├── run.py                        # API launcher (adds backend/ to PYTHONPATH)
├── postmimic.db                  # SQLite (created at repo root)
└── requirements.txt              # Points to backend/requirements.txt
```

**Design notes**

- **Frontend / backend separation** — No static SPA bundle served from FastAPI; CORS + Next rewrites in dev.
- **Routers vs services** — Routes validate auth and delegate; reusable DB logic lives in `services/` and domain modules.

---

## Testing the API

```bash
set PYTHONPATH=backend
python -c "from starlette.testclient import TestClient; from app.main import app; c=TestClient(app); print(c.get('/health').json())"
```

On Unix:

```bash
PYTHONPATH=backend python -c "from starlette.testclient import TestClient; from app.main import app; c=TestClient(app); print(c.get('/health').json())"
```
