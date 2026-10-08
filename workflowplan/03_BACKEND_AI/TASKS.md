# Developer 2 — BACKEND / AI — TASK LIST

**Role owner:** Developer 2
**Working window:** 09:00 → 20:00 Baku (feature work ends 16:50; release mode from 17:00)
**Owns these paths:** `backend/app/ai/**`, `backend/tests/ai/**`, `data/benchmark/**`, `data/evidence/**`
**Must not touch:** `backend/app/**` outside `app/ai/`, `frontend/**`, `data/seed/**`, `data/fixtures/**`

> Open `03_BACKEND_AI/MASTER_PROMPT.md` in OpenCode first. This file is your checklist.
> You should not need to open other developer folders. The API contract you depend on is
> reproduced in your MASTER_PROMPT.

---

## 1. YOUR MISSION IN ONE LINE

Make Hososhi *understand*: pick a provider/model by measured evidence, retrieve only relevant
company context, produce validated structured explanations for **"Why does this step exist?"**,
classify every step as SAFE / HUMAN REVIEW / HUMAN REQUIRED — and never let the AI break the
product.

---

## 2. API CONTRACT YOU IMPLEMENT

Base path `/api/v1`. Schemas live in `backend/app/schemas.py` (owned by D1) — **import them, do
not redefine them**.

| # | Endpoint | Pri | Notes |
|---|---|---|---|
| 6 | `GET /workflows/{wid}/steps/{sid}/intelligence` | P0 | the signature moment. Answer + evidence + confidence |
| 7 | `GET /workflows/{wid}/evidence?step_id=&type=` | P0 | evidence list with ids and relevance |
| 8 | `POST /workflows/{wid}/automation/analyze` | P0 | classification per step |
| 13 | `GET /meta` (P1) | P1 | expose provider/model names for the disclosure footer — coordinate with D1 |

---

## 3. TASK LIST

Legend: **Pri** = P0/P1/P2/P3 · **Est** = realistic estimate · **Dep** = blocked by

### BLOCK A — Provider client + benchmark harness (PHASE 1, do this FIRST)

| ID | Task | Pri | Est | Dep | Done when |
|---|---|---|---|---|---|
| A1 | `app/ai/provider.py` — one interface, N adapters, config via env (`AI_PROVIDER`, `AI_API_KEY`, `AI_MODEL`) | P0 | 25m | D1 `.env.example` keys | switching provider = changing one env var |
| A2 | Uniform interface: `complete(prompt, schema, timeout) -> validated object`, plus raw latency and token/usage info where the provider returns it | P0 | 20m | A1 | one call site works for every provider |
| A3 | Timeouts, retries, and typed error classes: `RATE_LIMITED`, `PROVIDER_UNAVAILABLE`, `AI_OUTPUT_INVALID`, `TIMEOUT` | P0 | 20m | A1 | a dead provider produces a typed error, never a traceback |
| A4 | **Fixed eval set**: 10 cases spanning the 4 roles (extract / understand / explain / classify), each with expected field values | P0 | 30m | D1 schemas | `data/benchmark/eval_set.json` exists and is committed-ready |
| A5 | Benchmark runner: same cases for every provider, records correctness, schema validity, latency p50/p95, failure rate, consistency (2 runs per case) | P0 | 30m | A2,A4 | `python -m app.ai.benchmark` writes `data/benchmark/results.json` |

**Run the benchmark as early as possible.** It is the input to the model-lock decision and it
gates your whole layer.

### BLOCK B — Retrieval (PHASE 2)

| ID | Task | Pri | Est | Dep | Done when |
|---|---|---|---|---|---|
| B1 | Filter layer: select events for a step, matching policies by department/entity, decisions by entity/topic, incidents linked to policies | P0 | 30m | D1 seed data | returns a small, relevant set — not the whole DB |
| B2 | Relevance scoring, simple and explainable (keyword/entity/department overlap + recency). No vector DB | P0 | 20m | B1 | each evidence item has a `relevance` score |
| B3 | Hard cap on context: max N items (e.g. 12 evidence items, 15 events) so the prompt stays small. Log what was sent | P0 | 15m | B1 | prompt size is bounded and observable |
| B4 | **Verify: the entire dataset is never sent.** Log item counts per request; a test asserts the cap | P0 | 20m | B3 | test proves the cap holds |

### BLOCK C — Prompts + structured output (PHASE 2)

| ID | Task | Pri | Est | Dep | Done when |
|---|---|---|---|---|---|
| C1 | 4 prompt templates, one per role, each with: role, task, strict output schema, explicit "use only the provided context" instruction, explicit "if the context is insufficient, say so" instruction | P0 | 35m | A4 | four files, readable |
| C2 | 4 Pydantic output schemas: `ExtractionResult`, `StepUnderstanding`, `StepExplanation`, `AutomationClassification` | P0 | 30m | D1 schemas | every AI response validated before it leaves your layer |
| C3 | `classify` enum exactly `SAFE | HUMAN_REVIEW | HUMAN_REQUIRED` | P0 | 5m | C2 |
| C4 | Extraction of the structured payload from varied provider responses (native JSON mode when available, otherwise robust parse + repair attempt) | P0 | 25m | A2 | benchmark shows the schema validity rate per provider |
| C5 | Prompt v1 vs v2 comparison on the eval set — keep the better one | P1 | 25m | C1,A5 | prompt choice is evidence-based |

### BLOCK D — Endpoints (PHASE 2)

| ID | Task | Pri | Est | Dep | Done when |
|---|---|---|---|---|---|
| D1e | `GET …/steps/{sid}/intelligence` → `{step_id, question, summary, answer, confidence, evidence[], model, generated_at, fallback_used}` | P0 | 30m | B*,C* | answer is grounded and cites evidence ids |
| D2e | `GET …/evidence?step_id=&type=` → evidence list | P0 | 20m | B1 | ids resolve against the seeded DB |
| D3e | `POST …/automation/analyze` → `{policy_rules_version, summary{safe,human_review,human_required}, steps[]}` | P0 | 20m | C3 | every step gets a class + reason + confidence |
| D4e | `/meta` contribution: expose the active provider + model ids (no invented specs) | P1 | 10m | A1 | disclosure footer can render real names |
| D5e | Cache intelligence for the demo workflow (in-process dict is fine) so the demo is not latency-bound | P1 | 15m | D1e | second click is instant |

### BLOCK E — Safety classification rules (PHASE 2)

| ID | Task | Pri | Est | Dep | Done when |
|---|---|---|---|---|---|
| E1 | Classification rubric: what makes a step SAFE vs HUMAN REVIEW vs HUMAN REQUIRED. Write it in ~10 lines and encode it | P0 | 20m | — | rubric is deterministic and reviewable |
| E2 | Enforcement: irreversible/financial-commitment steps can never be classified SAFE by the model alone | P0 | 20m | E1 | test proves the override |
| E3 | Expose the class + reason + confidence to D1; D1 re-derives and may override (e.g. amount threshold → HUMAN REQUIRED) | P0 | 15m | D3e | both sides agree on the contract |
| E4 | Never output an instruction for the AI to take actions. The AI returns advice/classification; D1's engine performs actions | P0 | — | — | true by design |

### BLOCK F — Failure handling + tests (PHASE 2 → PHASE 6)

| ID | Task | Pri | Est | Dep | Done when |
|---|---|---|---|---|---|
| F1 | Fallback chain: primary → secondary provider → typed error. Configurable | P0 | 25m | A3 | killing the primary still returns something sane |
| F2 | Malformed output handling: parse fail → repair attempt → retry once → `AI_OUTPUT_INVALID` (422) | P0 | 25m | C4 | test with a deliberately broken response |
| F3 | Rate-limit handling: detect, back off, retry, then fall back | P0 | 20m | A3 | test with a simulated limit |
| F4 | Timeout handling with a bounded total time so the UI never hangs | P0 | 15m | A3 | UI gets a `retryable` error |
| F5 | AI test suite: schema validity, evidence relevance, classification correctness, latency budget, provider-failure path | P1 | 40m | C2 | `pytest tests/ai` green |
| F6 | TEST-006 (conflicting policy) and TEST-007 (ambiguous decision) executed and recorded | P0 | 30m | D1 seed | rows filled in `06_TESTING/TEST_CASES.md` |

### BLOCK G — Benchmark results + disclosure (PHASE 4 + 7)

| ID | Task | Pri | Est | Dep | Done when |
|---|---|---|---|---|---|
| G1 | `data/benchmark/results.json` + a short readable table (markdown, inside the same file or one small file) with **real numbers only** | P0 | 20m | A5 | the table is the justification for the model choice |
| G2 | Model-lock decision per role, justified by the table | P0 | 15m | G1 | decision recorded and shared with D1/D3 |
| G3 | Configure the fallback provider chain in the production env | P0 | 10m | F1 | verified by killing the primary |
| G4 | Write the model/provider disclosure text for the submission | P0 | 15m | G2 | exact provider + model ids, real names |

---

## 4. ACCEPTANCE CRITERIA (your area)

**Structured output**
- [ ] Every AI response is validated against a Pydantic schema before reaching the product.
- [ ] `classify` returns only `SAFE`, `HUMAN_REVIEW`, `HUMAN_REQUIRED`.
- [ ] Malformed output never reaches the frontend as if it were valid data.
- [ ] Schema validity rate is recorded per provider in the benchmark.

**Grounding**
- [ ] Every evidence item id exists in the seeded database (verify a sample by id).
- [ ] Evidence is relevant to the step, not a generic list.
- [ ] Only a small, bounded context is sent (item counts logged; cap enforced by a test).

**Safety**
- [ ] Irreversible/financial steps are never classified SAFE by the model alone.
- [ ] The classification rubric is written down and deterministic.
- [ ] The AI never instructs or triggers actions; D1's engine executes.

**Reliability**
- [ ] Provider timeout, rate limit, 5xx and malformed output each produce a typed, handled error.
- [ ] Fallback chain works when the primary provider is killed (tested, not assumed).
- [ ] `/health` and all non-AI endpoints keep working while the AI provider is down.

**Honesty**
- [ ] Benchmark contains only measured values.
- [ ] No invented RPM/RPD, context windows, pricing, or model capability claims anywhere —
      verify from official documentation or omit entirely.
- [ ] Any fallback/mock behaviour used in the demo is disclosed.

---

## 5. DEPENDENCIES ON OTHER DEVELOPERS

| Depends on | What | When | If blocked |
|---|---|---|---|
| D1 | Pydantic schemas, seeded data with policies/decisions/incidents | PHASE 1–2 | If data is not ready, write prompts and schemas against the contract and test with a small local fixture; wire to the DB when it lands |
| D1 | `/meta` route, error envelope middleware | PHASE 2–3 | Return your typed errors in the agreed envelope shape even before D1's handler exists |
| D3 | Which fields the UI actually renders | PHASE 3 | Return the full contracted shape; D3 picks what to display |

**D2 unblocks:** D1's automation analysis, D3's Step Intelligence screen, and the whole
"Why does this step exist?" story. You are on the critical path for the demo's signature moment.

---

## 6. WHAT NOT TO BUILD

Agent frameworks · multi-agent systems · autonomous tool-using loops · RAG vector databases ·
embedding pipelines · fine-tuning · a generic chatbot endpoint · open-ended free-text chat ·
streaming UX · prompt-management platforms · evaluation frameworks beyond a small script ·
guardrail libraries · memory systems · knowledge graphs · any UI.

---

## 7. STOP CONDITIONS

Stop and report when:
- The model is locked (15:50) — no more provider experimentation after that.
- All P0 items are green.
- You are blocked for more than 15 minutes — say so, do not silently grind.
- 16:50 — stop feature work. 17:00 — release mode only.

---

## 8. REPORTING FORMAT (at 12:30, 16:50, and on any blocker)

```
D2 STATUS
DONE:      <task ids + one line each>
BENCHMARK: <provider/model → schema validity %, p50 ms, failure %>  (real numbers only)
NOT DONE:  <task ids + why>
BLOCKED:   <what> — needs from: <D1|D3|All> — since: <time>
RISK:      <one line>
NEXT:      <next 2 tasks>
```