# GEMINI HANDOVER — MASTER PROMPT (full project context)

**Purpose of this file:** if the original AI assistant becomes unavailable (context exhaustion,
token limits, session loss), paste this entire document into Gemini (or any other capable
assistant) and it will immediately understand the project, architecture, team split, plan,
priorities, testing, release strategy and how to continue helping.

**Status of this document:** it describes the plan as it exists before the hackathon day.
On the day, update it with actual decisions (real start time, real provider, real deploy target)
and keep it as the single source of truth for context handover.

---

# 1. PROJECT CONCEPT

**Name:** Hososhi
**Track:** AI Enterprise Solutions
**Team:** 3 developers
**Event day:** 9 October 2026
**Official freeze:** 20:00 Baku time (absolute)
**Release / freeze mode begins:** 17:00 Baku (last 3 hours protected)
**Assumed start:** 09:00 Baku (to be confirmed on the day; shift phases accordingly, never the
17:00 / 20:00 anchors)

**Tagline:**

> "Companies automate the workflows they think they have.
> Hososhi discovers the workflows they actually have."

**Category:** enterprise **workflow intelligence** product. Not a chatbot. Not a generic
autonomous agent.

**Core product loop:**

```
OBSERVE  →  UNDERSTAND  →  AUTOMATE  →  MEASURE
```

| Stage | Meaning |
|---|---|
| OBSERVE | Collect enterprise activity/events around business work |
| UNDERSTAND | Discover the real workflow; explain each step and *why it exists*, with cited evidence |
| AUTOMATE | Execute SAFE deterministic/repetitive steps; keep humans in control of judgment steps |
| MEASURE | Compare the human-only process with the AI-assisted process using real measurements |

---

# 2. THE PROBLEM

Enterprise automation programmes fail in a predictable way: companies document a process,
build automation against the documented process, and the real process diverges. People keep
invisible knowledge ("we always check the historical decision first because of what happened in
2024"). Nobody can answer, for any given step, **"why does this step even exist?"** — or what
evidence justifies removing it.

Existing tools either (a) let a human hand-design automation on top of a process they already
believe in, or (b) throw an LLM at the problem and produce plausible text with no grounding.

**Hososhi's answer:** derive the workflow from actual observed activity, ground every
explanation in retrievable company evidence, automate only what is provably safe, keep human
judgment in the loop, and measure the real difference.

**Target users:** enterprise operations / process owners / procurement & finance teams.
The demo speaks to a business audience, not to engineers.

## Target users and buyer

| User | What they need from Hososhi |
|---|---|
| Process/operations owner | "Show me the process we actually run, and prove it" |
| Procurement / finance approver | "Show me why this check exists, before I approve it" |
| Compliance / audit | "Show me the evidence behind every automated decision" |
| Engineering / IT | "Show me what is safe to automate and what is not" |

---

# 3. PRIMARY WORKFLOW (the demo subject)

**Purchase Request Processing**, discovered from a synthetic enterprise event dataset.

| # | Step | Id (planned) | Typical automation class (example, not fixed) |
|---|---|---|---|
| 1 | Purchase Request | `stp_request` | entry point |
| 2 | Extract Request Information | `stp_extract` | SAFE |
| 3 | Identify Supplier | `stp_supplier` | SAFE |
| 4 | Verify Price | `stp_price` | SAFE |
| 5 | Check Company Policy | `stp_policy` | SAFE |
| 6 | Search Historical Decisions | `stp_history` | HUMAN REVIEW |
| 7 | Manager Approval | `stp_approval` | HUMAN REQUIRED |
| 8 | Create Purchase Order | `stp_po` | SAFE (only after approval) |

These classifications are **examples**, not immutable requirements. They are produced by the
system and may differ; what matters is that the classification is grounded, explained and
enforced.

---

# 4. SIGNATURE UX MOMENT

> **"Why does this step exist?"**

The answer must be grounded in retrievable company evidence:

| Evidence type | Example id | Meaning |
|---|---|---|
| Policy | `POL-PR-07` | Company rule, e.g. price variance tolerance |
| Historical decision | `DEC-104` | A recorded past decision with a reason |
| Incident | `INC-38` | Something that went wrong and created the rule |
| Workflow event | `evt_…` | Prior occurrences of the same activity |

These identifiers are **placeholders**. They must not be shown as real evidence until the
synthetic dataset actually exists and is actually retrieved. Every evidence item returned by the
product must be verifiable by id in the seeded database.

---

# 5. DEMO STORY (the judge-facing path)

```
Dashboard
 → Purchase Request Processing
   → workflow timeline (7 steps)
     → select a step (Step Intelligence)
       → "Why does this step exist?"
         → evidence list with ids
           → Automation Analysis (SAFE / HUMAN REVIEW / HUMAN REQUIRED)
             → Automation Run (SAFE steps execute, hard stop at approval)
               → Human Approval (Approve / Reject)
                 → Purchase Order created
                   → Results (measured baseline vs AI-assisted)
```

Every implementation decision must serve this path. A complete vertical slice beats many
unfinished features.

---

# 6. UX / DESIGN PRINCIPLES (non-negotiable)

1. Enterprise-first.
2. Simple UX.
3. Professional and trustworthy.
4. Data-focused.
5. Minimal unnecessary UI.
6. **No generic chatbot experience.**
7. **No futuristic AI gimmicks.**
8. **No unnecessary gradients, neon, or robots.**
9. Human judgment stays under human control.
10. AI has no unrestricted authority.
11. Deterministic calculations are done by backend code, never hallucinated by the LLM.
12. AI receives retrieved relevant context, never the whole company database.
13. All important AI output is structured and validated.
14. Real measurements are collected during testing.
15. Never invent performance numbers.
16. Never claim a metric was achieved unless it was measured.
17. The demo tells a clear story from discovery to measurable result.

---

# 7. ARCHITECTURE (simple, hackathon-appropriate)

```
frontend/   Next.js + React + TypeScript
backend/    FastAPI (Python) — the only server
data/       seed generator, generated dataset, fixtures, benchmark results
tests/      e2e + shared test case definitions
```

**Deliberate non-architecture** (do not add): microservices, Kubernetes, message brokers,
complex event streaming, auth systems, multi-tenancy, CI/CD pipelines, service meshes,
vector DBs, Kubernetes charts, elaborate cloud architecture.

**Data flow:**

```
Browser → Next.js frontend → HTTP/JSON → FastAPI backend → SQLite file DB
                                            ↘ AI client → LLM provider (retrieved context only)
```

**Technology (proposed on the day; adjust if the team already has a preference):**

| Layer | Choice | Notes |
|---|---|---|
| Backend | Python 3.11+ / FastAPI / Pydantic v2 | API contract defined as Pydantic schemas |
| ORM / DB | SQLAlchemy 2.x + SQLite file | SQLite keeps it deployable anywhere |
| AI | One provider client interface, N provider adapters | config via env vars |
| Frontend | Next.js (App Router) + TypeScript | Tailwind or plain CSS, whichever is already set up |
| Tests | pytest (backend), Playwright or manual-with-script (E2E) | Do not build a testing framework |

---

# 8. TEAM ROLES

## Developer 1 — Backend responsibilities (Backend / Core)
FastAPI · database · synthetic enterprise dataset · event model · workflow discovery logic ·
workflow APIs · workflow state · automation engine · deterministic business logic · metrics
calculation · backend validation · backend error handling.

Owns: `backend/app/**` (except `app/ai/`), `backend/tests/**`, `data/seed/**`, `data/cases/**`.

## Developer 2 — AI responsibilities (Backend / AI)
AI provider integration · provider benchmarking · model selection · prompt engineering ·
structured AI outputs · workflow understanding · workflow/step reasoning ·
"Why does this step exist?" · evidence retrieval & synthesis · automation safety classification ·
AI failure handling · AI testing · AI reliability.

Owns: `backend/app/ai/**`, `backend/tests/ai/**`, `data/benchmark/**`, `data/evidence/**`.

## Developer 3 — Frontend responsibilities
Next.js · React · TypeScript · implements the designer-provided UI · Dashboard · workflow
visualization · Workflow Detail · Step Intelligence · evidence display · Automation Analysis ·
Automation Run · Human Approval · Results · loading states · error states · empty states ·
responsive behaviour.

Owns: `frontend/**`, `data/fixtures/**`.

## From 14:15 onward — all three together
Integration · end-to-end testing · AI testing · edge cases · bug fixing · deployment · demo
preparation · final video · submission form · final verification.

**Ownership rule:** nobody edits files outside their owned paths without asking the owner.

---

# 9. DATA MODEL (synthetic dataset)

Planning structures. The team may refine them, but they must support discovery, policy
reasoning, historical-decision reasoning, evidence retrieval, automation classification and
result calculation.

| Entity | Key fields |
|---|---|
| `Employee` | id, name, role, department, managerId, email |
| `Supplier` | id, name, category, riskTier, contractRef, country |
| `PurchaseRequest` | id, employeeId, department, items[], supplierId, amount, currency, status, createdAt |
| `WorkflowEvent` | id, timestamp, employeeId, application, action, entity, entityId, requestId, metadata{} |
| `Policy` | id, title, rule, effectiveDate, department, severity |
| `Decision` | id, title, date, reason, participants[], evidence[], outcome |
| `Incident` | id, title, date, severity, impact, linkedPolicyId, linkedDecisionId |
| `Workflow` | id, name, category, discoveredAt, eventCount, dateRange, confidence |
| `Step` | id, workflowId, name, order, actorRole, type, automationClass, automationReason, estimatedManualMinutes |
| `WorkflowRun` | id, workflowId, requestId, state, startedAt, finishedAt, metrics{} |
| `RunStep` | runId, stepId, state, startedAt, finishedAt, durationMs, actor, outputSummary |
| `Approval` | id, runId, stepId, requiredRole, state, decidedBy, decidedAt, comment |
| `MetricSnapshot` | runId, phase(baseline/ai_assisted), metricKey, metricValue, source, measuredAt |

**Dataset size guidance:** 200–400 workflow events · 30–60 purchase requests ·
15–25 employees · 10–15 suppliers · 8–12 policies · 10–15 decisions · 3–5 incidents.

**Dataset requirements:**
- Deterministic generation (fixed random seed) so results are reproducible.
- Realistic timestamps spread over ~6 months, with realistic per-step handling times.
- Enough variety to make discovery non-trivial (repeat patterns + noise).
- At least one case per quality test scenario (missing supplier, duplicate, unusual price,
  missing info, conflicting policy, ambiguous decision).
- **Synthetic nature must be disclosed in the final submission.**

---

# 10. API CONTRACT v1 (frozen at end of PHASE 1)

Base path `/api/v1`. Frontend reads base URL from `NEXT_PUBLIC_API_BASE_URL`.

| # | Method & path | Purpose | Owner |
|---|---|---|---|
| 1 | `GET /health` | Liveness | D1 |
| 2 | `GET /dashboard` | Dashboard summary (single call) | D1 |
| 3 | `GET /workflows` | Discovered workflows | D1 |
| 4 | `GET /workflows/{workflow_id}` | Workflow detail + steps | D1 |
| 5 | `GET /workflows/{workflow_id}/steps/{step_id}` | Single step | D1 |
| 6 | `GET /workflows/{workflow_id}/steps/{step_id}/intelligence` | "Why does this step exist?" + evidence | D2 |
| 7 | `GET /workflows/{workflow_id}/evidence?step_id=&type=` | Evidence list | D2 |
| 8 | `POST /workflows/{workflow_id}/automation/analyze` | Step classification | D2 |
| 9 | `POST /workflows/{workflow_id}/automation/run` | Start/advance automation run | D1 |
| 10 | `GET /runs/{run_id}` | Poll run progress + approval state | D1 |
| 11 | `POST /approvals/{approval_id}` | Approve / Reject | D1 |
| 12 | `GET /results/{run_id}` | Measured results | D1 |
| 13 | `GET /meta` | Dataset + model/provider disclosure | D1 (P1) |

**Error envelope:**
```json
{"error":{"code":"AI_PROVIDER_UNAVAILABLE","message":"…","retryable":true,"request_id":"req_…"}}
```
Codes: `VALIDATION_ERROR` 400 · `NOT_FOUND` 404 · `INVALID_STATE_TRANSITION` 409 ·
`AI_OUTPUT_INVALID` 422 · `RATE_LIMITED` 429 · `INTERNAL_ERROR` 500.

**Key response shapes** (illustrative; Pydantic schemas are the real source of truth):

```jsonc
// GET /workflows/{id}/steps/{sid}/intelligence
{
  "step_id": "stp_price",
  "question": "Why does this step exist?",
  "summary": "one-line answer",
  "answer": "3–5 sentence grounded explanation",
  "confidence": 0.84,
  "evidence": [
    {"ref":"POL-PR-07","type":"policy","title":"Price Variance Tolerance","snippet":"…",
     "relevance":0.91,"date":"2025-11-01"}
  ],
  "model": "provider/model-id",
  "generated_at": "…",
  "fallback_used": false
}

// POST /workflows/{id}/automation/analyze
{
  "workflow_id":"wf_purchase_request",
  "policy_rules_version":"safety-rules-v1",
  "summary":{"safe":4,"human_review":1,"human_required":2},
  "steps":[{"step_id":"stp_price","name":"Verify Price","automation_class":"SAFE",
            "reason":"…","confidence":0.9,"requires_approval":false}]
}

// POST /workflows/{id}/automation/run  →  run state
{
  "run_id":"run_…","workflow_id":"wf_purchase_request","state":"waiting_approval",
  "started_at":"…","finished_at":null,
  "steps":[{"step_id":"stp_price","name":"Verify Price","automation_class":"SAFE",
            "state":"completed","started_at":"…","finished_at":"…","duration_ms":812,
            "actor":"system","output_summary":"…"},
           {"step_id":"stp_approval","name":"Manager Approval","automation_class":"HUMAN_REQUIRED",
            "state":"waiting_approval","approval_id":"apr_…","actor":null}],
  "blocked_on":"approval:apr_…","metrics":null
}

// POST /approvals/{approval_id}   body: {"decision":"approve","approver_id":"emp_…","comment":""}
// GET /results/{run_id}
{
  "run_id":"run_…","workflow_id":"wf_purchase_request","measured_at":"…",
  "measurement_method":"in-app instrumentation; timestamps recorded by the backend",
  "runs_count":5,
  "baseline":{"label":"Human-only","source":"replayed_from_dataset","total_duration_ms":null,
              "manual_steps":null,"human_decisions":null,"automation_rate":null,"errors":null},
  "ai_assisted":{"label":"AI-assisted","source":"measured_in_this_run","total_duration_ms":null,
                 "manual_steps":null,"human_decisions":null,"automation_rate":null,"errors":null},
  "delta":{"duration_ms":null,"duration_percent":null,"human_interventions":null},
  "is_measured": false
}
```

`null` + `source:"none"` means **not measured** — the UI must render "not measured", never `0`
and never an invented number.

---

# 11. AI ARCHITECTURE

```
Database → retrieval/filtering → relevant context → LLM → structured output → backend validation → product
```

**Hard rule: the entire company database is never sent to an LLM.**

**The AI may assist with:** event classification · information extraction · workflow understanding ·
workflow discovery support · reasoning · explanation generation · evidence synthesis · automation
classification · structured decision output.

**The backend remains responsible for:** deterministic calculations · validation · database state ·
permissions · actual execution · workflow state transitions · metrics · safety constraints.

**AI must never independently decide to execute a dangerous or irreversible business action.**

Four AI roles (keep them separate, prompt them separately):

| Role | Input | Output |
|---|---|---|
| `extract` | request document/event text | structured fields (supplier, items, amount, …) |
| `understand` | event sequence | step name, purpose, actor role |
| `explain` | step + retrieved evidence | answer + citations + confidence |
| `classify` | step description + context | SAFE / HUMAN REVIEW / HUMAN REQUIRED + reason |

Every output is parsed against a Pydantic schema. Invalid output → `AI_OUTPUT_INVALID` (422) or a
declared fallback. Never pass raw model text straight to the frontend as if it were product data.

---

# 12. AI PROVIDER STRATEGY

Do **not** permanently assume one provider is best. Benchmark at the start of the hackathon.

Candidates (whichever are officially available to the team): Groq, Cerebras, Gemini, NVIDIA,
OpenRouter, others.

**Benchmark design:** one fixed set of ~10 test cases spanning the four roles. Same cases for
every provider. Measure:

- correctness (field-level, checked against expected values)
- reasoning quality (reviewed against a rubric by a human)
- structured output reliability (schema validity rate)
- latency (p50 and p95)
- failure rate (timeouts, 5xx, empty responses)
- rate-limit behaviour (observed, not assumed)
- consistency (run twice, compare)

**Role specialisation** is allowed but must be evidence-based.

**Never invent** API limits, RPM/RPD, context windows, pricing, or model capabilities. If exact
numbers are needed, verify them from official current documentation during the hackathon or omit
them entirely.

**Fallback chain:** primary → secondary → typed error with a clean UI state. Test it by killing
the primary provider.

**Model lock at 15:50** (PHASE 4). No provider switching after that.

---

# 13. AUTOMATION SAFETY

Three classes:

| Class | Meaning | Backend behaviour |
|---|---|---|
| `SAFE` | Deterministic, reversible, verifiable | Execute automatically |
| `HUMAN_REVIEW` | AI can propose, human must confirm | Produce a proposal, require confirmation |
| `HUMAN_REQUIRED` | Judgment / financial commitment / irreversible | Hard stop; only an approval record can advance it |

**Examples:** extraction → SAFE · supplier identification → SAFE · price verification → SAFE ·
policy verification → SAFE · historical decision interpretation → HUMAN REVIEW ·
manager approval → HUMAN REQUIRED · purchase order creation → SAFE **after** approval.

**Enforcement rules (backend, not frontend):**

1. A `HUMAN REQUIRED` step cannot be completed by any execution endpoint. Only
   `POST /approvals/{id}` with `decision=approve` advances it.
2. Illegal transitions return `409 INVALID_STATE_TRANSITION`.
3. The backend re-derives the class; it never trusts a class sent by the frontend.
4. Deterministic business overrides the AI: e.g. amount above a threshold forces
   `HUMAN REQUIRED` regardless of the model's answer.
5. Purchase order creation requires an approved approval record for the same run.
6. Rejecting an approval moves the run to `rejected` and no PO is created.

The product must clearly communicate that **AI is not replacing human judgment**.

---

# 14. QUALITY TESTING (worth 20 points — first-class, not an afterthought)

Minimum test set, executed and recorded:

| ID | Name |
|---|---|
| TEST-001 | Normal purchase request |
| TEST-002 | Missing supplier |
| TEST-003 | Duplicate request |
| TEST-004 | Unusual price |
| TEST-005 | Missing information |
| TEST-006 | Conflicting policy |
| TEST-007 | Ambiguous historical decision |
| TEST-008 | Unsafe automation attempt |

Test dimensions: workflow discovery accuracy · step classification accuracy · automation
classification · explanation correctness · evidence relevance · structured output validity ·
latency · AI failure behaviour · backend validation · human approval enforcement · duplicate
handling · missing-data behaviour · invalid AI output · provider failure · API failure ·
frontend loading/error states · end-to-end workflow completion.

For each case record: what was tested · expected result · **actual result** · pass/fail · what
broke · what was fixed · what remains a limitation.

Detail lives in `06_TESTING/TEST_PLAN.md` and `06_TESTING/TEST_CASES.md`.

---

# 15. BASELINE COMPARISON ("MEASURE")

Compare the **human-only** process against the **AI-assisted** process.

Metrics: total processing time · number of manual steps · number of human interventions ·
automation rate · error count · review points · operator effort.

**How this is done honestly:**

| Block | Method | `source` value |
|---|---|---|
| Baseline (human-only) | Deterministic replay of the synthetic dataset: for each historical purchase request, sum the gaps between consecutive related events | `replayed_from_dataset` |
| AI-assisted | Live instrumentation during real runs: per-step start/finish timestamps recorded by the backend | `measured_in_this_run` |

Both are real, reproducible computations over real data. Neither is invented. If a metric was
not measured, it is `null` with `source:"none"` and the UI says "not measured".

**Never fabricate.** No "73% faster" or "34 minutes → 9 minutes" unless those exact numbers came
from a recorded measurement run.

---

# 16. UI STRATEGY / DESIGN HANDOFF

Six screens:

1. **Dashboard** — workflows discovered, automation opportunities, potential time saved,
   recent workflows.
2. **Workflow Detail** — the timeline: Request → Supplier → Price → Policy → Decision →
   Approval → PO.
3. **Step Intelligence** — selected step, automation potential, explanation, evidence,
   confidence, company context. Contains the "Why does this step exist?" interaction.
4. **Automation Analysis** — SAFE / HUMAN REVIEW / HUMAN REQUIRED per step.
5. **Automation Run** — progress with ✓ / ⏸, then Approve / Reject, then ✓ PO created.
6. **Results** — baseline vs AI-assisted, measured.

Every screen needs: loading, error, and empty states.

**Asset handoff:** the designer's screenshots live in `04_FRONTEND/ui/`:

```
04_FRONTEND/ui/
├── README.md          ← how to read, naming convention, MVP screens, states required
├── screens/           ← full-page designs, named NN-screen_name.png
├── components/        ← component-level designs
├── references/        ← mood/inspiration, not to be implemented literally
└── assets/            ← logos, icons, fonts, images
```

Naming: `NN-<screen-name>.png`, NN = the screen number. Desktop vs mobile suffixed
`(-desktop)` / `(-mobile)` if both exist. Status suffix `-final` / `-ref` if it matters.
If a difference between screenshot and implementation is unavoidable, the implementation wins and
the difference is noted in the UI README or reported to the team — do not silently diverge.

---

# 17. TIME STRATEGY

Development until ~16:50. **Release/freeze mode from 17:00.** Official freeze 20:00.

| Phase | Time | Focus |
|---|---|---|
| 0 | 09:00–09:35 | Environment verification, credentials, anchors |
| 1 | 09:35–10:45 | Skeleton + **API contract freeze** |
| 2 | 10:45–14:15 | Parallel core development |
| 3 | 14:15–15:15 | Vertical slice integration |
| 4 | 15:15–15:50 | AI/provider validation + **model lock** |
| 5 | 15:50–16:20 | P1/P2 feature completion only |
| 6 | 16:20–17:00 | Quality testing sprint #1 |
| 7 | 16:20–17:00 | Release preparation (parallel with 6) |
| 8 | **17:00–19:30** | **Protected freeze window (T-180 → T-30)** |
| 9 | 19:30–20:00 | Final submission verification + final freeze |

The final 3 hours are **not** for feature development. They are for integration, full E2E
testing, critical bug fixes, deployment, production verification, final quality testing,
demo recording (≤2 min), filling missing submission fields, disclosures (models/data/components),
setup instructions, source/export link, demo link, quality-testing results, presentation
readiness, final freeze verification.

**No major architectural changes after 17:00.**

---

# 18. PRIORITIES

| P | Meaning |
|---|---|
| **P0** | Absolutely required for the demo |
| **P1** | Important |
| **P2** | Useful if time allows |
| **P3** | Optional — cut first |

**MVP (all P0):** Dashboard → Purchase Request workflow → timeline → Step Intelligence →
"Why does this step exist?" → evidence → automation analysis → safe execution → human approval
→ completion → measured results.

**Everything else is explicitly secondary.** See `00_MASTER_PLAN.md` §4.

---

# 19. SCOPE CONTROL

**Cut order when behind schedule:**

1. Cosmetic polish
2. Secondary workflows
3. Advanced filtering
4. Non-essential dashboard metrics
5. Additional connectors
6. Advanced visualizations
7. Secondary AI features

**Never cut:** core workflow · "Why does this step exist?" · evidence · automation classification ·
human approval · working execution · quality testing · result measurement.

**Rule:** if someone proposes something new during the hackathon, it goes on a "LATER" list.
Adding scope requires all three developers to agree *and* to identify equal work being removed.
Do not expand scope because an idea seems interesting.

---

# 20. EMERGENCY STRATEGY / FALLBACK PLAN

**Principle: a smaller working vertical slice is better than a larger broken product.**

| Failure | Response |
|---|---|
| AI provider fails | Switch to the configured fallback; if all fail, return a typed error and show a clean UI state; if necessary use a controlled, clearly-disclosed deterministic response |
| Rate limit hit | Backoff + retry + fallback provider; show "AI temporarily unavailable" in the UI |
| Malformed AI output | Schema validation rejects it → retry once → then fallback or `AI_OUTPUT_INVALID` |
| Backend unstable | Restart; pin dependencies; if not fixed in 15 minutes, degrade the frontend to fixtures and disclose it |
| Frontend cannot reach backend | Check CORS/base URL; verify deployed URL; last resort = run both locally and expose a local URL |
| Deployment fails | Fall back to the last known-good deploy or a locally runnable build with setup instructions |
| Database fails | Regenerate from the deterministic seed script; keep a checked-in copy of the generated dataset |
| A developer is blocked | Say so within 15 minutes; the team reassigns that task; nobody waits silently for hours |
| Integration causes a regression | Revert to the last working commit/state; a working slice beats a broken feature |
| Time critically low | Ship the MVP only; write "known limitations" instead of fixing; never fake results |

**If any mock/fallback behaviour is used in the demo, it must be disclosed in the submission.**

Details: `08_EMERGENCY/FALLBACK_PLAN.md`, `08_EMERGENCY/TROUBLESHOOTING.md`.

---

# 21. DEVELOPER WORKFLOW (how the human devs work)

1. 09:00 read `00_MASTER_PLAN.md` §1, §4 and §18 (demo path, MVP).
2. Open their own folder: `02_BACKEND_CORE/`, `03_BACKEND_AI/`, `04_FRONTEND/`.
3. Paste their `MASTER_PROMPT.md` into OpenCode as the system/task prompt.
4. Work the task list in priority order; P0 first.
5. Report status at 12:30 and 16:50 in the format: **done / not done / blocked**.
6. From 14:15 work as one team on integration, testing, deployment, demo, submission.
7. From 17:00 no new features, ever.

---

# 22. CODING-AGENT WORKFLOW (how OpenCode/Gemini works in the repo)

- Inspect the existing project before changing anything.
- Implement incrementally; small verified steps.
- Keep code simple; avoid unnecessary dependencies.
- Avoid speculative architecture.
- Write tests for important logic (discovery, classification, state machine, metrics).
- Validate behaviour by running the tests, not by asserting success.
- Preserve existing interfaces; never rewrite another developer's area.
- **Do NOT perform any Git operations.** No `git init`, `git add`, `git commit`, `git push`,
  no branch work, no reverts, no history rewriting. The humans handle all Git manually.
- Do not modify unrelated files or reformat other people's code.
- Do not write documentation for its own sake; the repository should stay clean.
- Report clearly: what changed, what was verified, what remains, what is blocked.
- Stop when the assigned scope is done. Do not expand scope.

---

# 23. SUBMISSION REQUIREMENTS (drafted; confirm on the day)

- Project name and tagline.
- Team members and roles.
- **Demo link** (must work from a logged-out browser).
- **Source / export link.**
- **Setup instructions** — literal steps, verified by following them exactly.
- **Demo video**, ≤2 minutes, telling the story: problem → discovery → intelligence → why the
  step exists → automation safety → human approval → measurable result.
- **Model disclosure** — every AI model/provider used, with versions.
- **Data disclosure** — the dataset is fully synthetic/fictional; no real company data.
- **Components disclosure** — all third-party libraries, frameworks and services used. Never
  claim something was built from scratch when a third-party component was used.
- **Architecture / API description** (short).
- **Quality testing results** — the real recorded results, including what failed.
- **Known limitations.**

**The team must not discover missing submission requirements at T-10 minutes.** The submission
skeleton is drafted in PHASE 7 (16:20–17:00).

---

# 24. THINGS THAT MUST NEVER BE FABRICATED

- Performance numbers, speedups, percentages, time savings.
- AI provider limits, RPM/RPD, context windows, pricing, or model capabilities.
- "Accuracy" claims without a measured test.
- Real company data or real customers (the dataset is synthetic).
- Evidence that does not exist in the seeded dataset.
- Custom-built claims for third-party components.
- Automated-run claims for steps a human actually performed.
- Any statement that implies a metric was achieved when it was only estimated.

If a number is unknown, show it as unknown.

---

# 25. CURRENT ASSUMPTIONS (validate or correct on the day)

1. Hackathon starts 09:00 Baku on 9 October 2026.
2. Official freeze is 20:00 Baku.
3. Three developers, all available for the full day.
4. At least one working AI provider API key is available; more is better.
5. A deployment target exists (one host serving both frontend and backend preferred).
6. A Git repository is managed manually by the humans; AI agents never touch Git.
7. SQLite is acceptable as the database.
8. The designer will deliver screenshots into `04_FRONTEND/ui/`.
9. Quality testing carries 20 points in the judging rubric.
10. No real company data is available or permitted.

---

# 26. WHAT MAY CHANGE DURING THE HACKATHON

- Technology choices (framework, ORM, styling approach).
- Endpoint shapes — **only before the contract freeze at 10:45, and only with all three agreeing.**
- Dataset size and exact entity counts.
- The number of steps in the discovered workflow.
- The specific step names and their automation classifications.
- Provider and model per role (decided by benchmark, locked at 15:50).
- Which P1/P2 features get built.
- Deployment target.
- UI details where the designer's screenshot and a working implementation conflict.

---

# 27. WHAT MUST REMAIN STABLE

1. The product loop: OBSERVE → UNDERSTAND → AUTOMATE → MEASURE.
2. The Purchase Request Processing demo workflow.
3. The 13-step demo path.
4. The "Why does this step exist?" moment with real, retrievable evidence.
5. SAFE / HUMAN REVIEW / HUMAN REQUIRED classification, enforced by the backend.
6. Human approval before any irreversible action.
7. Real measurements only, with `source` labels.
8. The 17:00 freeze-mode entry and the 20:00 official freeze.
9. Synthetic-data disclosure.
10. P0 = the MVP; everything else is secondary.
11. No Git operations performed by AI agents.

---

# 28. PLANNING PACKAGE MAP

```
workflowplan/
├── 00_MASTER_PLAN.md                    complete chronological plan, phases 0–9
├── 01_GEMINI_HANDOVER_MASTER_PROMPT.md  this file — full context handover
├── 02_BACKEND_CORE/
│   ├── TASKS.md                         D1 task list with priorities + acceptance
│   └── MASTER_PROMPT.md                 D1 prompt for OpenCode
├── 03_BACKEND_AI/
│   ├── TASKS.md                         D2 task list
│   └── MASTER_PROMPT.md                 D2 prompt for OpenCode
├── 04_FRONTEND/
│   ├── TASKS.md                         D3 task list
│   ├── MASTER_PROMPT.md                 D3 prompt for OpenCode
│   └── ui/README.md                     designer handoff instructions
│       ui/screens/ ui/components/ ui/references/ ui/assets/
├── 05_INTEGRATION_QA/MASTER_PROMPT.md   integration, E2E, bug fixing
├── 06_TESTING/
│   ├── TEST_PLAN.md                     testing strategy
│   └── TEST_CASES.md                    concrete cases with result columns
├── 07_RELEASE/RELEASE_CHECKLIST.md      T-180 → T-0 freeze window
└── 08_EMERGENCY/
    ├── FALLBACK_PLAN.md                 what to do when things break
    └── TROUBLESHOOTING.md               under-pressure debugging checklists
```

---

# 29. INSTRUCTIONS TO THE INCOMING ASSISTANT

You are now the planning/technical copilot for Hososhi. Do not blindly redesign the project.
Preserve the core product story. Help the team execute the plan, resolve blockers, review
implementation, improve testing, and prepare the final submission. Prefer a working MVP over
speculative complexity.

Specifically:

- Be concrete and practical. Give code-level or command-level help, not motivational talk.
- Never encourage scope growth during the hackathon.
- Always check the priority and cut order before agreeing to any new work.
- Always insist that a claim be backed by a measurement or a recorded test result.
- Never invent provider limits, model capabilities, or performance figures. If asked for one,
  say it must be verified from official documentation.
- Never perform Git operations on behalf of the team.
- Keep the three developers unblocked; if one is stuck, reduce the scope for that person rather
  than adding complexity elsewhere.
- Before the freeze at 17:00, favour working, tested, disclosed functionality over polish.
- After the freeze, help with verification, deployment, video and submission only.