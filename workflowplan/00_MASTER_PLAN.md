# HOSOSHI — MASTER EXECUTION PLAN

**Track:** AI Enterprise Solutions
**Team:** 3 developers
**Event day:** 9 October 2026
**Official freeze:** **20:00 Baku time, 9 October 2026** (hard, non-negotiable)
**Release / freeze mode entry:** **17:00 Baku** (the last 3 hours are protected)
**Working language of all plan documents:** English
**This package contains PLANNING ONLY.** No product code, no repo, no Git operations.

---

## 0. HOW TO USE THIS PACKAGE

| File | Who reads it | When |
|---|---|---|
| `00_MASTER_PLAN.md` | Everyone (lead/coordination) | Start of day, and at every checkpoint |
| `01_GEMINI_HANDOVER_MASTER_PROMPT.md` | Anyone continuing the project with a fresh AI assistant | If the current assistant loses context |
| `02_BACKEND_CORE/` | Developer 1 (Backend/Core) | Standalone. Do not need other folders |
| `03_BACKEND_AI/` | Developer 2 (Backend/AI) | Standalone. Do not need other folders |
| `04_FRONTEND/` | Developer 3 (Frontend) | Standalone. Do not need other folders |
| `05_INTEGRATION_QA/MASTER_PROMPT.md` | All three, together | PHASE 3 onward |
| `06_TESTING/` | All three | PHASE 6 onward, continuously |
| `07_RELEASE/RELEASE_CHECKLIST.md` | All three | PHASE 7 → 20:00 |
| `08_EMERGENCY/` | Whoever is blocked | Any time, on demand |

**Rule:** each developer folder is self-contained by design. You should be able to work a full
phase from your own `MASTER_PROMPT.md` + `TASKS.md` without opening someone else's folder.
Cross-folder reading is allowed for *checking the contract*, never as a prerequisite.

---

## 1. PROJECT IN ONE PAGE

**Hososhi** is an enterprise **workflow intelligence** product.

> "Companies automate the workflows they think they have.
> Hososhi discovers the workflows they actually have."

**Product loop:** `OBSERVE → UNDERSTAND → AUTOMATE → MEASURE`

| Loop stage | What Hososhi does |
|---|---|
| OBSERVE | Ingest enterprise activity/events from a synthetic dataset |
| UNDERSTAND | Discover the real workflow, explain every step and *why it exists*, with cited evidence |
| AUTOMATE | Execute SAFE deterministic steps; stop and ask a human for judgment steps |
| MEASURE | Compare the human-only baseline with the AI-assisted run using **real measurements** |

**Primary demo workflow — Purchase Request Processing:**

1. Purchase Request
2. Extract Request Information
3. Identify Supplier
4. Verify Price
5. Check Company Policy
6. Search Historical Decisions
7. Manager Approval
8. Create Purchase Order

**Signature UX moment — "Why does this step exist?"**
The answer is grounded in company evidence: policies (`POL-PR-07`), historical decisions
(`DEC-104`), incidents (`INC-38`), and prior workflow events.
These identifiers are **placeholders until the synthetic dataset actually exists and is used.**

**What this is NOT:** a chatbot, a generic autonomous agent, a "magic AI" dashboard, a neon
cyberpunk robot UI. If a judge can describe Hososhi as "a chat app that answers questions about
workflows," the demo has failed.

---

## 2. ABSOLUTE TIME ANCHORS

| Anchor | Time (Baku, 9 Oct 2026) | Status |
|---|---|---|
| Development may continue until | 16:50 | soft |
| **Release / freeze mode begins** | **17:00** | **hard rule** |
| E2E + deploy + video + submission all done | 19:30 | hard |
| **Official freeze** | **20:00** | **absolute, immovable** |

> **ASSUMPTION (decide in PHASE 0):** official start is **09:00 Baku**. All phase times below are
> anchored to 09:00. If the real start time differs, **shift every phase by the same offset** —
> the phase *order* and the 17:00 / 20:00 anchors never move.

### Timeline at a glance

| Phase | Baku time | Dur. | Mode | Focus |
|---|---|---|---|---|
| **0** | 09:00–09:35 | 35m | all together | Start, environment verification, access check |
| **1** | 09:35–10:45 | 70m | all together | Skeleton + **API contract freeze** |
| **2** | 10:45–14:15 | 210m | 3 parallel tracks | Core implementation |
| **3** | 14:15–15:15 | 60m | all together | Vertical slice integration (first full click-through) |
| **4** | 15:15–15:50 | 35m | D2 + D1 | AI/provider validation, **model lock** |
| **5** | 15:50–16:20 | 30m | 3 parallel tracks | P1/P2 feature completion only |
| **6** | 16:20–17:00 | 40m | all together | Quality testing sprint #1 (TEST-001…008) |
| **7** | 16:20–17:00 | 40m | parallel with 6 | Release preparation (build, env, deploy target) |
| **8** | **17:00–19:30** | 150m | all together | **PROTECTED FREEZE WINDOW** (T-180 → T-30) |
| **9** | 19:30–20:00 | 30m | all together | Final submission verification + final freeze |

**Protected window detail:** the release checklist (`07_RELEASE/RELEASE_CHECKLIST.md`) uses
T-marks from the 17:00 anchor:
`T-180=17:00`, `T-150=17:30`, `T-120=18:00`, `T-90=18:30`, `T-60=19:00`, `T-45=19:15`,
`T-30=19:30`, `T-15=19:45`, `T-0=20:00`.

---

## 3. TEAM OWNERSHIP MAP

| Dev | Role | Owns these repo paths | Primary deliverable |
|---|---|---|---|
| **D1** | Backend / Core | `backend/app/**` except `app/ai/`, `backend/tests/**`, `data/seed/**`, `data/cases/**` | Working API, synthetic dataset, automation engine, measured results |
| **D2** | Backend / AI | `backend/app/ai/**`, `backend/tests/ai/**`, `data/benchmark/**`, `data/evidence/**` | Step intelligence, "Why does this step exist?", evidence synthesis, safe classification |
| **D3** | Frontend | `frontend/**`, `data/fixtures/**` | All six screens, loading/error/empty states, human approval interaction |

**Path-ownership rule:** if a file is not in your owned paths, do not edit it. Send a one-line
message to the owner instead. No exceptions, even for "one tiny fix".

**From 14:15 (PHASE 3) onward all three work as one team** on integration, testing, bug fixing,
deployment, demo and submission.

---

## 4. PRIORITY SYSTEM

| Priority | Meaning | Cut rule |
|---|---|---|
| **P0** | Absolutely required for the demo to work | Never cut |
| **P1** | Important — clearly improves judge impression | Cut under pressure |
| **P2** | Useful if time allows | Cut early |
| **P3** | Optional polish / nice-to-have | Cut first |

### The MVP (P0) — the one path that must work end to end

```
Dashboard
  → Purchase Request Processing workflow
    → workflow timeline
      → select a step (Step Intelligence)
        → "Why does this step exist?"
          → evidence list (policy / decision / incident / event)
            → Automation Analysis (SAFE | HUMAN REVIEW | HUMAN REQUIRED)
              → Automation Run (SAFE steps execute, stops at approval)
                → Human Approval (Approve / Reject)
                  → Purchase Order created
                    → Results (measured baseline vs AI-assisted)
```

**If only this path works, the project succeeds for the hackathon.**
Everything else is secondary.

### P0 item list (authoritative)

1. API contract frozen and implemented for all 8 core endpoints
2. Synthetic dataset with Purchase Request workflow, policies, decisions, incidents
3. Workflow discovery + timeline for Purchase Request Processing
4. Step Intelligence screen with "Why does this step exist?"
5. Evidence display with identifiers and relevance
6. Automation Analysis: SAFE / HUMAN REVIEW / HUMAN REQUIRED classification
7. Automation Run: SAFE execution, hard stop at manager approval
8. Human Approval: Approve and Reject, backend-enforced
9. Purchase Order creation after approval
10. Results screen with **real measured numbers** + baseline
11. Loading / error / empty states on every screen
12. TEST-001…TEST-008 executed, results recorded
13. Deployment + working demo link
14. ≤2 minute demo video
15. Submission form complete, including disclosures

### Explicitly SECONDARY (everything not on the P0 list)

Multi-workflow support beyond Purchase Request, advanced dashboard metrics, search/filter,
dark/light toggle, i18n, auth, avatars/photos, charts beyond a simple bar comparison,
notifications, pagination, sorting, export, multi-tenant, audit log UI, settings pages.

---

## 5. PHASE 0 — Hackathon start / environment verification
**09:00–09:35 (35 min) — all three together**

### Objective
Everyone works, everyone has credentials, the machine is ready, and the single most important
decision (scope + contract) is understood by all three before any code is written.

### Tasks

| ID | Task | Owner | Pri | Time |
|---|---|---|---|---|
| 0.1 | Read `00_MASTER_PLAN.md` §1 and the demo path in §4 aloud, together | All | P0 | 10m |
| 0.2 | Verify Python 3.11+, Node 20+, npm, git, and a working package registry | D1 | P0 | 10m |
| 0.3 | Verify all AI provider API keys are present and each key makes **one real test call** | D2 | P0 | 10m |
| 0.4 | Confirm frontend toolchain runs (`create-next-app` smoke test) | D3 | P0 | 10m |
| 0.5 | Agree and write down: hackathon start time, official freeze, submission portal URL, deployment target | All | P0 | 5m |
| 0.6 | Create the repo skeleton directories (`frontend/ backend/ data/ tests/`) — D1 does it, others watch | D1 | P0 | 10m |

### Expected output
- All 3 developers have a working toolchain and a working AI provider key.
- An agreed, written timeline with the real start time.
- Empty but real directory structure.

### Completion criteria
- [ ] Every dev can run a hello-world backend, frontend, and one LLM call.
- [ ] Real start time and freeze time confirmed and written into this plan.
- [ ] Deployment target chosen and reachable (even a bare "we will decide by PHASE 7").

### Do NOT
- Do NOT start building features in this phase.
- Do NOT install OS-level packages or reconfigure the desktop.
- Do NOT spend more than 35 minutes here.

### Fallback if blocked
- If a provider key is missing, record it and pick a second provider immediately — this is a
  blocking risk, not a nice-to-have.
- If the network is slow, still proceed; do not wait more than 10 minutes on any single check.

---

## 6. PHASE 1 — Project skeleton and contracts
**09:35–10:45 (70 min) — all three together**

### Objective
**The API contract is frozen at 10:45.** After that, nobody changes an endpoint shape without
telling all three. This is the single highest-leverage 70 minutes of the day.

### Tasks

| ID | Task | Owner | Pri | Time |
|---|---|---|---|---|
| 1.1 | Create backend: FastAPI app skeleton, venv, `requirements.txt`, `.env.example`, health route | D1 | P0 | 25m |
| 1.2 | Create frontend: Next.js + TypeScript app, base layout, dev server runs | D3 | P0 | 25m |
| 1.3 | Write the shared API contract as Pydantic schemas (single source of truth) | D1 | P0 | 20m |
| 1.4 | Generate TypeScript types / mock fixtures mirroring those schemas in `data/fixtures/` | D3 | P0 | 20m |
| 1.5 | **Contract freeze review:** all three read the schema file together and agree | All | P0 | 15m |
| 1.6 | D2 sets up `backend/app/ai/` provider client interface + first benchmark harness | D2 | P0 | 30m |

### The API contract (v1 — FROZEN at 10:45)

Base URL: `/api/v1` (frontend reads it from `NEXT_PUBLIC_API_BASE_URL`).

| # | Endpoint | Method | Purpose | Owner | Pri |
|---|---|---|---|---|---|
| 1 | `/health` | GET | Liveness. No auth, no DB heavy work | D1 | P0 |
| 2 | `/dashboard` | GET | Dashboard summary in **one** call | D1 | P0 |
| 3 | `/workflows` | GET | Discovered workflows list | D1 | P0 |
| 4 | `/workflows/{workflow_id}` | GET | Workflow detail incl. steps/timeline | D1 | P0 |
| 5 | `/workflows/{wid}/steps/{sid}` | GET | Single step detail | D1 | P0 |
| 6 | `/workflows/{wid}/steps/{sid}/intelligence` | GET | "Why does this step exist?" + evidence | D2 | P0 |
| 7 | `/workflows/{wid}/evidence` | GET | Evidence list (optional `?step_id=&type=`) | D2 | P0 |
| 8 | `/workflows/{wid}/automation/analyze` | POST | SAFE / HUMAN REVIEW / HUMAN REQUIRED per step | D2 | P0 |
| 9 | `/workflows/{wid}/automation/run` | POST | Start/advance an automation run | D1 | P0 |
| 10 | `/runs/{run_id}` | GET | Poll run progress + approval state | D1 | P0 |
| 11 | `/approvals/{approval_id}` | POST | Approve or Reject (human decision) | D1 | P0 |
| 12 | `/results/{run_id}` | GET | Measured baseline vs AI-assisted metrics | D1 | P0 |
| 13 | `/meta` | GET | Dataset + model/provider disclosure for the UI footer | D1 | P1 |

> Endpoints 1–5 and 9, 11, 12 come from the project brief. Endpoints 2, 6, 10, 13 are **agreed
> additions** needed for the demo UX. The structure may be adjusted tomorrow, but only by the
> three of them together, and only before the freeze at 10:45.

**Error envelope (all non-2xx responses):**
```json
{"error": {"code": "AI_PROVIDER_UNAVAILABLE", "message": "human readable", "retryable": true, "request_id": "req_..."}}
```
Codes: `VALIDATION_ERROR` (400) · `NOT_FOUND` (404) · `INVALID_STATE_TRANSITION` (409) ·
`AI_OUTPUT_INVALID` (422) · `RATE_LIMITED` (429) · `INTERNAL_ERROR` (500).

### Expected output
- Running backend with `/health` returning 200.
- Running frontend dev server rendering an empty shell.
- A single `backend/app/schemas.py` (or equivalent) that both sides agree on.
- TS types + fixtures in `data/fixtures/`.

### Completion criteria
- [ ] `GET /api/v1/health` returns 200 from the browser's CORS origin.
- [ ] Frontend renders a shell page with no console errors.
- [ ] All 13 endpoints documented with request/response shape.
- [ ] All three devs can state the 6 P0 frontend calls from memory.

### Do NOT
- Do NOT implement business logic yet.
- Do NOT add auth, Docker, microservices, or a monorepo toolchain.
- Do NOT freeze a schema and then silently change it.

### Fallback if blocked
- If the schema cannot be agreed in 15 minutes: D1 writes it, D3 builds against it, and the
  mismatch is fixed in PHASE 3. A slightly wrong frozen contract beats no contract.

---

## 7. PHASE 2 — Parallel core development
**10:45–14:15 (210 min) — 3 parallel tracks**

### Objective
Each developer completes their P0 slice against real (not mock) code where possible, and writes
automated tests as they go. Checkpoint at **12:30** — the last moment to change direction.

### D1 — Backend/Core

| ID | Task | Pri | Time |
|---|---|---|---|
| D1-1 | SQLAlchemy models + SQLite schema + migrations-as-code (keep simple) | P0 | 40m |
| D1-2 | Synthetic data generator: 200+ workflow events, 30–60 purchase requests, 8–12 policies, 10–15 decisions, 3–5 incidents, 15–25 employees, 10–15 suppliers | P0 | 45m |
| D1-3 | Seed script; deterministic seed so results are reproducible | P0 | 15m |
| D1-4 | Workflow discovery service: group events into sequences → Workflow + Step records | P0 | 40m |
| D1-5 | Endpoints 1,2,3,4,5 | P0 | 25m |
| D1-6 | Automation engine: run state machine, SAFE step execution, hard stop at HUMAN REQUIRED | P0 | 35m |
| D1-7 | Approval endpoint + enforced state transitions (409 on illegal transitions) | P0 | 20m |
| D1-8 | Metrics: baseline replay + live AI-assisted measurement | P0 | 30m |
| D1-9 | Unit + API tests for everything above | P0 | 30m |

### D2 — Backend/AI

| ID | Task | Pri | Time |
|---|---|---|---|
| D2-1 | Provider client abstraction (one interface, N providers, config via env) | P0 | 25m |
| D2-2 | Benchmark harness + **fixed 10-case eval set** spanning 4 roles | P0 | 30m |
| D2-3 | Run benchmark across all available providers; record latency, JSON validity, correctness, failure rate | P0 | 40m |
| D2-4 | Prompt set v1 + Pydantic output schemas for 4 roles (extract, understand, explain/why, classify) | P0 | 35m |
| D2-5 | Retrieval/filtering layer — only relevant events/policies/decidents go into the prompt | P0 | 30m |
| D2-6 | Endpoint 6 (`/intelligence`) and 7 (`/evidence`) | P0 | 30m |
| D2-7 | Endpoint 8 (`/automation/analyze`) | P0 | 20m |
| D2-8 | AI failure handling: timeout, malformed JSON, rate limit, wrong schema → typed error + fallback | P0 | 25m |
| D2-9 | AI tests (see `06_TESTING/TEST_PLAN.md`) | P1 | 25m |

### D3 — Frontend

| ID | Task | Pri | Time |
|---|---|---|---|
| D3-1 | Project shell: layout, navigation, shared types, API client with typed errors | P0 | 30m |
| D3-2 | Fixtures → mock mode switch (`data/fixtures/` vs live API) | P0 | 20m |
| D3-3 | Screen 1 Dashboard | P0 | 35m |
| D3-4 | Screen 2 Workflow Detail (timeline) | P0 | 45m |
| D3-5 | Screen 3 Step Intelligence + "Why does this step exist?" + evidence list | P0 | 55m |
| D3-6 | Screen 4 Automation Analysis (SAFE/HUMAN REVIEW/HUMAN REQUIRED) | P0 | 30m |
| D3-7 | Screen 5 Automation Run (progress + approval interaction) | P0 | 40m |
| D3-8 | Screen 6 Results (measured comparison) | P0 | 30m |
| D3-9 | Loading / error / empty states on all screens | P0 | 30m |
| D3-10 | Responsive behaviour (desktop-first; minimum usable at 1280px and 768px) | P1 | 20m |

### 12:30 checkpoint (10 minutes, all three)
Each developer reports, in 90 seconds: **what is done, what is not, what is blocking.**
Any P0 item not started by 12:30 is immediately re-prioritised or cut. No new ideas are accepted
after this checkpoint.

### Expected output
- Backend serves the full Purchase Request workflow from the real synthetic DB.
- AI endpoints return validated structured output with citations.
- Frontend shows the entire demo path with fixtures at minimum.

### Completion criteria
- [ ] `GET /api/v1/workflows/wf_purchase_request` returns 7 steps in the correct order.
- [ ] `GET /api/v1/workflows/…/steps/…/intelligence` returns answer + ≥1 evidence item.
- [ ] `/automation/analyze` returns a class for every step.
- [ ] `POST /automation/run` stops at the manager approval step and returns an `approval_id`.
- [ ] Frontend can walk Dashboard → Workflow Detail → Step Intelligence using fixtures.
- [ ] Every dev has run their own tests at least once.

### Do NOT
- Do NOT add a second workflow.
- Do NOT integrate with real external systems.
- Do NOT add a UI component library beyond what is already chosen in PHASE 1.
- Do NOT start any architectural refactor after 12:30.

### Fallback if blocked
- If D1's discovery logic is late: hand D3 a **static, checked-in** workflow JSON generated by
  the seeder, and continue frontend work. Discovery logic is still required, but it must not
  block the UI.
- If D2's provider benchmark is slow: continue with the fastest available provider and treat the
  model lock as a PHASE 4 decision.
- If a developer is blocked for >30 minutes, they say so explicitly and the team reassigns.

---

## 8. PHASE 3 — Vertical slice integration
**14:15–15:15 (60 min) — all three, on one screen if possible**

### Objective
The complete judge path works in the browser, end to end, with real data and real AI.

### Tasks

| ID | Task | Owner | Pri |
|---|---|---|---|
| 3.1 | Connect frontend to live backend, turn off fixture mode | D3 + D1 | P0 |
| 3.2 | Fix all P0 integration mismatches (field names, types, nulls, status codes) | All | P0 |
| 3.3 | Walk the full demo path once, in order, on a real browser | All | P0 |
| 3.4 | Approve → PO created → Results render with real numbers | All | P0 |
| 3.5 | Reject path works and is visibly different | D1 + D3 | P0 |
| 3.6 | Record a 3-minute screen capture of the working path (safety net for the final video) | D3 | P0 |
| 3.7 | Write down every known bug into a single visible list | All | P0 |

### Completion criteria
- [ ] A fresh browser session completes the demo path with zero console errors.
- [ ] The AI explanation names real evidence from the seeded dataset.
- [ ] The run cannot skip the approval step (verified by direct API call attempt).
- [ ] A safety-net recording exists on disk.

### Do NOT
- Do NOT add features here. This phase only makes what exists work together.
- Do NOT refactor working code.

### Fallback if blocked
- Revert to fixture mode for the frontend and fix the backend mismatch in PHASE 4. A working
  vertical slice beats a broken integration — but never ship fixtures to the judges without
  disclosing it.

---

## 9. PHASE 4 — AI/provider validation
**15:15–15:50 (35 min) — D2 leads, D1 supports, D3 observes the JSON shapes**

### Objective
The model choice is **evidence-based and locked**, and the AI layer degrades gracefully.

### Tasks

| ID | Task | Owner | Pri |
|---|---|---|---|
| 4.1 | Finish the provider benchmark table from Phase 2 results | D2 | P0 |
| 4.2 | Record: correctness, reasoning quality, structured-output validity, latency p50/p95, failure rate, rate-limit behaviour, consistency | D2 | P0 |
| 4.3 | **Model lock decision** for each role (extract / understand / explain / classify) | All | P0 |
| 4.4 | Configure fallback provider chain (primary → fallback) | D2 | P0 |
| 4.5 | Verify malformed-output handling and typed errors in the live API | D2 + D1 | P0 |
| 4.6 | Warm the cache for the demo workflow so the demo is not latency-dependent | D2 | P1 |
| 4.7 | Confirm `/meta` exposes real provider/model names for disclosure | D1 | P0 |

### Completion criteria
- [ ] A written benchmark table exists with **real numbers only**.
- [ ] Model selection is justified by that table.
- [ ] Killing the primary provider produces a graceful typed error or a working fallback — tested.
- [ ] No invented provider limits, pricing, or context-window numbers appear anywhere.

### Do NOT
- Do NOT invent RPM/RPD limits, context sizes, or pricing. Verify from official docs or omit.
- Do NOT switch providers after 15:50.

### Fallback if blocked
- Single provider + typed errors + UI error states. One reliable provider beats three flaky ones.

---

## 10. PHASE 5 — Feature completion
**15:50–16:20 (30 min) — 3 parallel tracks, P1/P2 only**

### Tasks
- D1: `/meta`, evidence caching, performance pass on the demo endpoint.
- D2: prompt polish using the benchmark failures, classification consistency.
- D3: P1 items — responsive pass, visual consistency, loading-skeleton polish.
- All: **anything P0 that is still open.**

### Completion criteria
- [ ] Zero open P0 items.
- [ ] Every new item added after 15:50 must be ≤15 minutes of work.

### Do NOT
- Do NOT start anything P3.
- Do NOT begin any item that takes more than 15 minutes.

### Fallback
Stop. Skip to PHASE 6. Unfinished P1 items are cut, not started.

---

## 11. PHASE 6 — Quality testing sprint #1
**16:20–17:00 (40 min) — all three, in parallel on different test groups**

Quality testing is **20 points**. It is a first-class feature of this plan, not an afterthought.
Automated tests were written during Phase 2; this sprint runs them, records results, and fixes
only P0/P1 defects.

### Tasks

| ID | Task | Owner | Pri |
|---|---|---|---|
| 6.1 | Run backend unit + API tests; record pass/fail | D1 | P0 |
| 6.2 | Run AI tests (valid output, invalid output, provider failure, latency) | D2 | P0 |
| 6.3 | Manually execute TEST-001 … TEST-008 in `06_TESTING/TEST_CASES.md` | All | P0 |
| 6.4 | Fill **Actual Result** and **Pass/Fail** in TEST_CASES.md | All | P0 |
| 6.5 | Frontend state check: loading / error / empty on all six screens | D3 | P0 |
| 6.6 | Safety test: direct API attempt to skip approval must fail | D1 | P0 |
| 6.7 | Baseline measurement run recorded (≥5 runs, real data) | D1 | P0 |

### Completion criteria
- [ ] TEST-001…TEST-008 all executed and recorded.
- [ ] No known P0 defect open at 17:00.
- [ ] At least one real baseline measurement exists.

### Do NOT
- Do NOT fix cosmetic bugs in this sprint.
- Do NOT add new tests that do not protect the demo path.

---

## 12. PHASE 7 — Release preparation (parallel with Phase 6)
**16:20–17:00 (40 min) — D1 deploy target, D3 production build, D2 stability**

### Tasks

| ID | Task | Owner | Pri |
|---|---|---|---|
| 7.1 | Choose and configure the deployment target; confirm it serves the backend and the frontend | D1 | P0 |
| 7.2 | Environment variables for production; secrets via the platform, not in code | D1 | P0 |
| 7.3 | Production build succeeds (`npm run build`, backend production mode) | D3 + D1 | P0 |
| 7.4 | **Dry-run deploy** to a staging/preview URL and smoke-test it | D1 | P0 |
| 7.5 | Reusable seed script so the demo dataset can be regenerated anywhere | D1 | P0 |
| 7.6 | Freeze prompts and model config; remove debug logging | D2 | P0 |
| 7.7 | Favicon, page title, meta description, 404 page | D3 | P1 |
| 7.8 | Draft the submission form skeleton with empty fields (so nothing is a surprise at T-10) | D1 | P0 |

### Completion criteria
- [ ] A deploy URL exists and loads, even if some screens are still rough.
- [ ] The demo dataset can be rebuilt from one command.
- [ ] The submission draft exists with all section headings and unknown values marked `TODO`.

### Do NOT
- Do NOT do the real production deploy yet — dry-run only.
- Do NOT wait until T-10 to discover what the submission requires.

---

## 13. PHASE 8 — PROTECTED FREEZE WINDOW
**17:00–19:30 (T-180 → T-30) — all three**

### Objective
**No new features. No architectural changes. Only integration, verification, deployment,
recording, and submission.**

### Full detail
See `07_RELEASE/RELEASE_CHECKLIST.md`. Summary of the blocks:

| Mark | Baku | Block | Owner |
|---|---|---|---|
| T-180 | 17:00 | **Feature freeze.** Kill all feature branches of thought. Write the final bug list | All |
| T-150 | 17:30 | Integration + build production artefacts | D1 + D3 |
| T-120 | 18:00 | Deploy + production smoke test | D1 + D3 |
| T-90 | 18:30 | Full E2E on the deployed URL + critical bug fixes only | All |
| T-60 | 19:00 | Demo video recording (≤2 min) + submission content finalised | D3 + D1 |
| T-45 | 19:15 | Video edit/upload, setup instructions, disclosures written | All |
| T-30 | 19:30 | Final submission verification begins (PHASE 9) | All |

### Hard rules for this window
- No new endpoints. No new screens. No refactors. No dependency upgrades.
- Any bug that is not on the demo path goes to the "known limitations" list instead of being fixed.
- If the demo URL is broken, fixing it outranks every other task in this window.

### Completion criteria
- [ ] Deployed URL works from a clean browser session.
- [ ] Full demo path passes on the deployed URL.
- [ ] Video ≤2 minutes exists, plays, and tells the story.

---

## 14. PHASE 9 — Final submission verification
**19:30–20:00 (T-30 → T-0)**

### Objective
Nothing is discovered at T-10. Everything is already written; this phase is verification only.

### Tasks

| ID | Task | Owner | Pri |
|---|---|---|---|
| 9.1 | Play the demo path once more on the deployed URL, on a clean browser profile | All | P0 |
| 9.2 | Submission form: every field filled or explicitly marked N/A | D1 | P0 |
| 9.3 | Repo source/export link verified working from a logged-out browser | D1 | P0 |
| 9.4 | Setup instructions: exact steps to run locally, checked by following them literally | D1 | P0 |
| 9.5 | Disclosures: models/providers, synthetic data, third-party components, fallback behaviour | D2 | P0 |
| 9.6 | Quality testing results attached (real results from TEST_CASES.md) | All | P0 |
| 9.7 | Video uploaded, playable, ≤2 min | D3 | P0 |
| 9.8 | Demo link verified from a logged-out browser / private window | D3 | P0 |
| 9.9 | One person reads the full submission text aloud for typos and false claims | D1 | P0 |
| 9.10 | Final freeze at 20:00. Stop all edits. | All | P0 |

### Completion criteria
- [ ] Submission submitted before 19:55.
- [ ] Every required field is complete.
- [ ] Every claim in the submission matches something that was actually done or measured.

### Do NOT
- Do NOT add features.
- Do NOT claim a metric that was not measured.
- Do NOT describe a third-party component as custom-built.

---

## 15. CUT ORDER (if behind schedule)

Decide the trigger in advance: **if a P0 item is projected to be incomplete at 17:00, start
cutting immediately — do not wait until 17:00 to find out.**

**Cut in this order:**

1. Cosmetic polish (shadows, spacing, animations, transitions)
2. Secondary workflows (anything other than Purchase Request Processing)
3. Advanced filtering / search / sorting
4. Non-essential dashboard metrics (keep at most: workflows discovered, automation opportunities,
   recent workflow)
5. Additional connectors / integrations
6. Advanced visualizations (keep a simple bar comparison for Results)
7. Secondary AI features (multi-role models, advanced reasoning modes, rich citations UI)

**Never cut first — these are protected:**

- Core workflow (Discovery → Timeline → Step Intelligence)
- "Why does this step exist?"
- Evidence display
- Automation classification (SAFE / HUMAN REVIEW / HUMAN REQUIRED)
- Human approval with backend enforcement
- Working execution of SAFE steps + PO creation
- Quality testing (TEST-001…008 + recorded results)
- Result measurement (real numbers)

### SCOPE-CREEP RULE
If someone proposes a new idea during the hackathon, the answer is written on a "LATER" list and
the work continues. Adding scope requires **all three developers** to agree **and** to identify
equal work being removed. There is no time budget for ideas.

---

## 16. MEASUREMENT HONESTY RULES (non-negotiable)

1. Every number on the Results screen must be traceable to a recorded measurement.
2. Results responses carry a `source` field per block:
   - `source: "replayed_from_dataset"` — baseline computed from the synthetic event timestamps.
   - `source: "measured_in_this_run"` — measured live by the backend during the run.
   - `source: "none"` — not measured. **Display as "not measured", never as a number.**
3. Forbid hardcoded claims such as "73% faster" or "34 minutes → 9 minutes" unless those exact
   numbers were produced by a measurement run that is recorded in TEST_CASES.md.
4. Never invent: model context windows, provider rate limits, RPM/RPD, pricing, accuracy claims,
   or customer outcomes. Verify from official docs during the hackathon or omit.
5. Never describe a third-party component as built from scratch.
6. If a fallback/mock path was used anywhere in the demo, disclose it in the submission.

---

## 17. INTEGRATION CADENCE

| Moment | Duration | Who | Purpose |
|---|---|---|---|
| 09:00 kickoff | 10m | All | Scope, anchors, demo path |
| 10:45 contract freeze | 15m | All | Sign off API schemas |
| 12:30 mid-day checkpoint | 10m | All | Status, blockers, cuts |
| 14:15 integration start | 60m | All | Vertical slice |
| 15:50 model lock | 10m | All | AI decision is final |
| 16:50 pre-freeze go/no-go | 10m | All | Ready for release mode? |
| 17:00 freeze mode entry | — | All | No new features, ever |
| T-30 | — | All | Submission verification |

Keep every update short: **done / not done / blocked.**

---

## 18. DEMO SCRIPT (13 steps, ≤3 minutes)

This is the path every implementation decision must support.

1. Open Dashboard.
2. Select **Purchase Request Processing**.
3. Show the discovered workflow timeline.
4. Select **Verify Price**.
5. Ask/show **"Why does this step exist?"**
6. Show the AI explanation + the cited evidence.
7. Open **Automation Analysis**.
8. Show SAFE / HUMAN REVIEW / HUMAN REQUIRED.
9. **Run automation.**
10. Execution stops at **manager approval**.
11. **Approve.**
12. **Purchase order created.**
13. **Results**: measured baseline vs AI-assisted.

If the demo cannot do these 13 things, extra features do not matter.

---

## 19. DEMO VIDEO SCRIPT (≤120 seconds)

| Time | Content | On screen |
|---|---|---|
| 0:00–0:10 | Problem statement, one line | Title card |
| 0:10–0:20 | "Here is the workflow we documented. Here is what actually happens." | Workflow timeline |
| 0:20–0:45 | "Why does this step exist?" + evidence | Step Intelligence |
| 0:45–1:00 | Automation analysis: SAFE / REVIEW / HUMAN | Automation Analysis |
| 1:00–1:25 | Run → stops at approval → human approves → PO created | Automation Run |
| 1:25–1:50 | Measured results, real numbers | Results |
| 1:50–2:00 | Close: Hososhi — OBSERVE → UNDERSTAND → AUTOMATE → MEASURE | End card |

**Do not** spend video time explaining architecture, stack, or the team. The product speaks for
itself. Record it at T-60 and have the T-45 edit ready as backup.

---

## 20. ACCEPTANCE CRITERIA (summary by owner)

**D1 — Backend/Core**
- Every P0 endpoint responds with the contracted shape.
- Schemas validated; invalid input → `VALIDATION_ERROR` (400).
- Unknown ids → `NOT_FOUND` (404).
- Illegal state transitions → `INVALID_STATE_TRANSITION` (409).
- Approval cannot be bypassed via any public endpoint (verified by test).
- Dataset rebuildable from one command with a fixed seed.
- Unit + API tests pass.

**D2 — Backend/AI**
- All AI output validated against a Pydantic schema before it reaches the product.
- Malformed output → `AI_OUTPUT_INVALID` (422) or a typed fallback, never a crash.
- Provider timeout / rate limit / 5xx → typed, retryable error.
- Evidence returned is actually present in the dataset (verifiable by id).
- Only relevant context is sent to the model (verified by token/request-size logging).
- Classification obeys the safety rules and backend overrides them when required.
- Model choice justified by the benchmark table.

**D3 — Frontend**
- Screens match the designer's intent in `04_FRONTEND/ui/`.
- Every screen has loading, error, and empty states.
- Approval interaction works and reflects the backend state.
- No fake numbers anywhere in the UI; unmeasured values show as "not measured".
- Usable at 1280px and 768px for the demo laptop.
- No console errors on the demo path.

**Integration (all three)**
- The 13-step demo path completes from a clean browser session.
- TEST-001…008 recorded with real results.
- Deployed URL works.
- Submission is complete and every claim is true.

---

## 21. FINAL PLAN REVIEW — CHECKED BEFORE DELIVERY

| # | Check | Status |
|---|---|---|
| 1 | Every required file exists | ✅ |
| 2 | Every developer has a standalone `TASKS.md` | ✅ |
| 3 | Every developer has a standalone `MASTER_PROMPT.md` | ✅ |
| 4 | Frontend has UI asset directories + README | ✅ |
| 5 | Gemini handover prompt is self-sufficient | ✅ |
| 6 | Final 3-hour release plan is explicit (T-180 → T-0) | ✅ |
| 7 | Testing treated as a first-class activity (20 pts) | ✅ |
| 8 | P0/P1/P2/P3 priorities defined and applied | ✅ |
| 9 | Cut order defined | ✅ |
| 10 | Emergency fallback plan exists | ✅ |
| 11 | No fake metrics presented as results | ✅ |
| 12 | No unverified provider limits stated as fact | ✅ |
| 13 | Git instructions explicitly say DO NOT commit/push | ✅ |
| 14 | Folders are self-contained; no cross-reading required | ✅ |
| 15 | MVP is obvious and marked | ✅ |
| 16 | Practical for a one-day hackathon | ✅ |
| 17 | No product implementation performed | ✅ |

---

## 22. DECISIONS TO MAKE IN PHASE 0 (open items)

These are genuinely unknown and must be decided by the team tomorrow morning:

1. **Official hackathon start time** (09:00 assumed here).
2. **Submission portal URL** and exact required fields.
3. **Deployment target** (one host serving both frontend and backend is strongly preferred).
4. **Which AI provider keys are actually available** and whose they are.
5. **Source/export requirement** — public repo or exported archive?
6. **Team presentation format** — live demo, slides, or both.
7. **Minimum acceptable demo environment** — if the venue internet fails, what is the offline plan?

---

**END OF MASTER PLAN.** Day-of execution starts at `00_MASTER_PLAN.md` §5 (PHASE 0).