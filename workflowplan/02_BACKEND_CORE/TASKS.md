# Developer 1 — BACKEND / CORE — TASK LIST

**Role owner:** Developer 1
**Working window:** 09:00 → 20:00 Baku (feature work ends 16:50; release mode from 17:00)
**Owns these paths:** `backend/app/**` (except `app/ai/`), `backend/tests/**`, `data/seed/**`, `data/cases/**`
**Must not touch:** `backend/app/ai/**`, `data/benchmark/**`, `data/evidence/**`, `frontend/**`, `data/fixtures/**`

> Open `02_BACKEND_CORE/MASTER_PROMPT.md` in OpenCode first. This file is your checklist.
> You should not need to open other developer folders. Only the API contract (below) matters,
> and it is duplicated in your MASTER_PROMPT.

---

## 0. YOUR MISSION IN ONE LINE

Build the FastAPI backend, the synthetic enterprise dataset, workflow discovery, the automation
engine with enforced human approval, and **real measured results** — so the demo path works
end to end for Developer 3's frontend.

---

## 1. API CONTRACT YOU IMPLEMENT (v1, frozen 10:45)

Base path `/api/v1`.

| # | Endpoint | Pri | Notes |
|---|---|---|---|
| 1 | `GET /health` | P0 | returns `{"status":"ok","version":"…"}` |
| 2 | `GET /dashboard` | P0 | one call, feeds the whole Dashboard screen |
| 3 | `GET /workflows` | P0 | list of discovered workflows |
| 4 | `GET /workflows/{workflow_id}` | P0 | workflow + ordered steps |
| 5 | `GET /workflows/{workflow_id}/steps/{step_id}` | P0 | single step |
| 6 | `GET /workflows/{wid}/steps/{sid}/intelligence` | P0 | **D2 implements**, you serve the shell if needed |
| 7 | `GET /workflows/{wid}/evidence` | P0 | **D2 implements** |
| 8 | `POST /workflows/{wid}/automation/analyze` | P0 | **D2 implements** |
| 9 | `POST /workflows/{wid}/automation/run` | P0 | yours |
| 10 | `GET /runs/{run_id}` | P0 | yours — poll run progress |
| 11 | `POST /approvals/{approval_id}` | P0 | yours — human decision |
| 12 | `GET /results/{run_id}` | P0 | yours — measured results |
| 13 | `GET /meta` | P1 | yours — disclosure data for the UI |

**Define the Pydantic schemas for ALL 13 in `backend/app/schemas.py` in PHASE 1.** D2 and D3
consume those schemas. Do not change them after 10:45 without telling all three.

**Error envelope (all non-2xx):**
```json
{"error":{"code":"VALIDATION_ERROR","message":"…","retryable":false,"request_id":"req_…"}}
```

---

## 2. TASK LIST

Legend: **Pri** = P0/P1/P2/P3 · **Est** = realistic estimate · **Dep** = blocked by

### BLOCK A — Setup (PHASE 1, 09:35–10:45)

| ID | Task | Pri | Est | Dep | Done when |
|---|---|---|---|---|---|
| A1 | Create `backend/` project: venv, `requirements.txt` (FastAPI, Uvicorn, Pydantic v2, SQLAlchemy 2, pydantic-settings), `.env.example` | P0 | 20m | — | venv activates, `uvicorn app.main:app --reload` starts |
| A2 | `app/main.py` with CORS (allow the frontend origin), `/api/v1/health` | P0 | 15m | A1 | `curl /api/v1/health` → 200 |
| A3 | `app/schemas.py` — all 13 request/response models | P0 | 30m | A1 | agreed in the 10:45 contract-freeze review |
| A4 | Repo skeleton: `data/seed/`, `data/cases/`, `tests/e2e/` (empty, documented) | P0 | 5m | — | dirs exist |
| A5 | Read `.env.example` aloud with D2 so both agree on key names | P0 | 5m | A3 | no key-name conflicts |

### BLOCK B — Data model + synthetic dataset (PHASE 2 first half)

| ID | Task | Pri | Est | Dep | Done when |
|---|---|---|---|---|---|
| B1 | SQLAlchemy models: `Employee, Supplier, PurchaseRequest, WorkflowEvent, Policy, Decision, Incident, Workflow, Step, WorkflowRun, RunStep, Approval, MetricSnapshot` | P0 | 40m | A1 | `Base.metadata.create_all` works on SQLite |
| B2 | Seed generator with **fixed random seed**: 200–400 events, 30–60 purchase requests, 15–25 employees, 10–15 suppliers, 8–12 policies, 10–15 decisions, 3–5 incidents | P0 | 45m | B1 | `python -m app.seed` regenerates identical data twice |
| B3 | Realistic timestamps over ~6 months with per-step handling-time gaps | P0 | 20m | B2 | baseline replay produces non-zero durations |
| B4 | Seed specific scenarios: duplicate request, missing supplier, unusual price, missing info, conflicting policies, ambiguous decision | P0 | 20m | B2 | each TEST-002…007 case has a row in the DB |
| B5 | Idempotent seed script + one-command rebuild | P0 | 10m | B2 | delete DB, re-run seed, same data |
| B6 | `data/seed/README` note: "all data is synthetic" (one short paragraph, not a doc set) | P1 | 5m | B2 | exists |

### BLOCK C — Workflow discovery (PHASE 2)

| ID | Task | Pri | Est | Dep | Done when |
|---|---|---|---|---|---|
| C1 | Discovery service: group `WorkflowEvent`s into sequences per `requestId` | P0 | 25m | B1 | returns sequences with ordered steps |
| C2 | Step consolidation: identical action patterns → one Step with an id and order | P0 | 15m | C1 | `Verify Price` appears once, not N times |
| C3 | Discovery metadata: event count, date range, confidence, discovery method | P0 | 10m | C2 | `GET /workflows` returns `discovery{}` |
| C4 | Discovery run at seed time, persisted as `Workflow` + `Step` rows | P0 | 15m | C2 | `GET /workflows` non-empty after seed |
| C5 | Unit tests for discovery: stable ordering, consolidation, empty-input behaviour | P0 | 20m | C4 | pytest passes |

### BLOCK D — Read APIs (PHASE 2)

| ID | Task | Pri | Est | Dep | Done when |
|---|---|---|---|---|---|
| D1t | `GET /workflows`, `GET /workflows/{id}`, `GET /workflows/{id}/steps/{sid}` | P0 | 25m | C4 | responses match `schemas.py` |
| D2t | `GET /dashboard` in one call (counts, opportunities, recent workflow) | P0 | 15m | D1t | Dashboard needs exactly one request |
| D3t | `GET /meta` (dataset name, seed, AI provider/model from D2's config, disclosure flags) | P1 | 15m | A3 | UI can render a transparency footer |
| D4t | Consistent error handling: 400/404/409/422/429/500, all via the error envelope | P0 | 20m | A3 | negative tests pass |

### BLOCK E — Automation engine + approval (PHASE 2)

| ID | Task | Pri | Est | Dep | Done when |
|---|---|---|---|---|---|
| E1 | Run state machine: `pending → running → waiting_approval → running → completed` (+ `rejected`, `failed`) | P0 | 25m | D1t | illegal transitions rejected |
| E2 | `POST /automation/run` — execute SAFE steps in order using deterministic backend logic | P0 | 30m | E1 | SAFE steps complete without AI |
| E3 | **Hard stop at HUMAN REQUIRED** → create `Approval`, state `waiting_approval`, return `approval_id` | P0 | 15m | E2 | run stops exactly at Manager Approval |
| E4 | `POST /approvals/{id}` — approve → advance the run; reject → run `rejected`, **no PO** | P0 | 20m | E3 | both paths verified by test |
| E5 | PO creation step executes only after an approved approval record for that run | P0 | 15m | E4 | unit + API test enforce it |
| E6 | `GET /runs/{id}` — poll progress (state, per-step state, `blocked_on`) | P0 | 15m | E2 | frontend can render a live progress list |
| E7 | **Safety rule:** amount threshold forces `HUMAN REQUIRED` regardless of the AI's class | P0 | 15m | E3 | unit test proves the override |
| E8 | Idempotency: duplicate submit of the same request does not create a second run | P0 | 15m | E2 | TEST-003 passes |

**Non-negotiable:** the backend must never trust a classification sent by the frontend. Re-derive
the class server-side on every run.

### BLOCK F — Metrics (PHASE 2)

| ID | Task | Pri | Est | Dep | Done when |
|---|---|---|---|---|---|
| F1 | Baseline: replay the synthetic events, compute per-request duration, manual steps, human decisions, error count. `source = "replayed_from_dataset"` | P0 | 30m | B3 | `GET /results` returns real baseline numbers |
| F2 | AI-assisted: instrument the live run (per-step start/finish, durations, actors). `source = "measured_in_this_run"` | P0 | 20m | E2 | durations are actual timestamps |
| F3 | `GET /results/{run_id}` with `delta`, `measurement_method`, `runs_count`, `is_measured` | P0 | 15m | F1,F2 | response matches the contract |
| F4 | Unmeasured metric → `null` + `source:"none"`. **Never 0, never a guess.** | P0 | 10m | F3 | unit test asserts nulls are preserved |
| F5 | Run the measurement ≥5 times and store a summary | P1 | 20m | F3 | a real, reproducible measurement exists |

### BLOCK G — Tests you own (PHASE 2 → PHASE 6)

| ID | Task | Pri | Est | Dep | Done when |
|---|---|---|---|---|---|
| G1 | Unit tests: discovery, state machine, safety overrides, metrics, baseline replay | P0 | 40m | C5,E7,F4 | `pytest` green |
| G2 | API tests: happy path + 400/404/409/422 for every endpoint you own | P0 | 30m | G1 | `pytest tests/api` green |
| G3 | Execute TEST-001…TEST-008 and fill Actual Result + Pass/Fail in `06_TESTING/TEST_CASES.md` | P0 | 40m | G2 | 8 rows completed |
| G4 | Record what broke, what was fixed, what remains a limitation | P0 | 15m | G3 | section completed |

### BLOCK H — Release (PHASE 7 + 8)

| ID | Task | Pri | Est | Dep | Done when |
|---|---|---|---|---|---|
| H1 | Production config: env vars via platform, not code; CORS locked to the real origin | P0 | 20m | — | deployed URL passes CORS |
| H2 | Deployment target serving frontend + backend from one host | P0 | 40m | — | URL loads |
| H3 | Dry-run deploy in PHASE 7 | P0 | 25m | H2 | preview URL works |
| H4 | Production deploy at T-120 | P0 | 20m | H2 | live URL works |
| H5 | Production smoke test + clean-profile browser walk-through | P0 | 30m | H4 | recorded pass |
| H6 | Literal setup instructions, verified by following them from scratch | P0 | 25m | — | a teammate follows them successfully |

---

## 3. ACCEPTANCE CRITERIA (your area)

**Functional**
- [ ] All 13 endpoints exist; the 8 you own return the contracted shape.
- [ ] `GET /workflows/wf_purchase_request` returns the 7 steps in the correct order.
- [ ] `POST /automation/run` executes SAFE steps then stops at Manager Approval.
- [ ] `POST /approvals/{id}` with `approve` completes the run and creates the PO.
- [ ] `POST /approvals/{id}` with `reject` stops the run and creates nothing.
- [ ] Direct execution of a `HUMAN REQUIRED` step is impossible via any endpoint (verified).
- [ ] `GET /results/{run_id}` returns measured numbers with a `source` per block.

**Quality**
- [ ] Schemas validated; invalid input → `VALIDATION_ERROR` (400).
- [ ] Unknown ids → `NOT_FOUND` (404).
- [ ] Illegal transitions → `INVALID_STATE_TRANSITION` (409).
- [ ] No unhandled 500s in the negative test suite.
- [ ] Database rebuildable with one command and a fixed seed.
- [ ] `pytest` fully green at 16:50.

**Honesty**
- [ ] No number anywhere that was not produced by a measurement.
- [ ] Dataset is clearly labelled synthetic in code comments' minimal form and in `/meta`.

---

## 4. DEPENDENCIES ON OTHER DEVELOPERS

| Depends on | What | When needed | If blocked |
|---|---|---|---|
| D2 | Automation classes for the analyze endpoint; evidence for explanations | PHASE 2–3 | Use a static class map you own as a temporary fallback and say so |
| D3 | Frontend base URL + whether fixture mode is on | PHASE 3 | Serve CORS for `localhost:3000` |
| D2 | Provider/model names for `/meta` disclosure | PHASE 7 | Read from `app/ai/config.py` if present, else `"pending"` |

**D2 depends on you for:** the database, the seed data, and the deterministic business logic that
the AI layer calls into. Prioritise B1–B5 early — D2 is blocked without real rows to retrieve.

---

## 5. WHAT NOT TO BUILD (explicitly out of scope)

Authentication · user accounts · roles/permissions UI · multi-tenant support · message queues ·
Celery/RQ · Docker/Kubernetes · microservices · vector DB · full-text search engine ·
pagination beyond a simple limit · auditing framework · i18n · caching infrastructure ·
optimistic-locking machinery · graph database · streaming · webhooks · email.

---

## 6. STOP CONDITIONS

Stop and report when:
- Your P0 tasks are done and green — do not start P1 before P0 is green.
- You hit a blocker for more than 15 minutes — report it immediately, do not silently grind.
- The clock reaches 16:50 — stop feature work regardless of state.
- 17:00 arrives — release mode; only integration, fixes, deployment, submission.

---

## 7. REPORTING FORMAT (use this at 12:30, 16:50, and whenever blocked)

```
D1 STATUS
DONE:      <task ids + one line each>
NOT DONE:  <task ids + why>
BLOCKED:   <what> — needs from: <D2|D3|All> — since: <time>
RISK:      <one line>
NEXT:      <next 2 tasks>
```