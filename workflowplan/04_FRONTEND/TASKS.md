# Developer 3 — FRONTEND — TASK LIST

**Role owner:** Developer 3
**Working window:** 09:00 → 20:00 Baku (feature work ends 16:50; release mode from 17:00)
**Owns these paths:** `frontend/**`, `data/fixtures/**`
**Must not touch:** `backend/**`, `data/seed/**`, `data/benchmark/**`, `data/evidence/**`

> Open `04_FRONTEND/MASTER_PROMPT.md` in OpenCode first. This file is your checklist.
> Your UI handoff instructions are in `04_FRONTEND/ui/README.md` — read it, then look in the
> folders before you build.

---

## 1. YOUR MISSION IN ONE LINE

Build the six screens that make a judge understand the product in 90 seconds — Dashboard →
workflow → Step Intelligence → "Why does this step exist?" → Automation Analysis → Run →
Human Approval → Results — with real loading/error/empty states and no fabricated numbers.

---

## 2. THE 13-STEP DEMO PATH (your screens must support this, in this order)

```
1  Dashboard
2  Purchase Request Processing selected
3  discovered workflow timeline
4  "Verify Price" step selected
5  "Why does this step exist?"
6  AI explanation + cited evidence
7  Automation Analysis opened
8  SAFE / HUMAN REVIEW / HUMAN REQUIRED shown
9  Run automation
10 execution stops at manager approval
11 Approve
12 purchase order created
13 Results with measured comparison
```

**If these 13 steps do not work, everything else is decoration.**

---

## 3. API CONTRACT YOU CONSUME

Base URL from `NEXT_PUBLIC_API_BASE_URL`. **You never hardcode a URL.**

| # | Method & path | Pri | Screen |
|---|---|---|---|
| 1 | `GET /health` | P0 | (optional status) |
| 2 | `GET /dashboard` | P0 | Dashboard — **one call only** |
| 3 | `GET /workflows` | P0 | Dashboard / workflow list |
| 4 | `GET /workflows/{id}` | P0 | Workflow Detail |
| 5 | `GET /workflows/{id}/steps/{sid}` | P0 | Step Intelligence |
| 6 | `GET /workflows/{id}/steps/{sid}/intelligence` | P0 | Step Intelligence |
| 7 | `GET /workflows/{id}/evidence?step_id=&type=` | P0 | Evidence panel |
| 8 | `POST /workflows/{id}/automation/analyze` | P0 | Automation Analysis |
| 9 | `POST /workflows/{id}/automation/run` | P0 | Automation Run |
| 10 | `GET /runs/{run_id}` | P0 | Automation Run (polling) |
| 11 | `POST /approvals/{approval_id}` | P0 | Human Approval |
| 12 | `GET /results/{run_id}` | P0 | Results |
| 13 | `GET /meta` | P1 | Transparency footer |

**Error envelope** (every non-2xx): `{"error":{"code":"…","message":"…","retryable":bool,"request_id":"…"}}`
Codes: `VALIDATION_ERROR` 400 · `NOT_FOUND` 404 · `INVALID_STATE_TRANSITION` 409 ·
`AI_OUTPUT_INVALID` 422 · `RATE_LIMITED` 429 · `INTERNAL_ERROR` 500.

**Frontend responsibilities:** render states; validate nothing that only the backend knows; never
enforce safety client-side as if it were a security layer.

---

## 4. SCREENS

### Screen 1 — Dashboard (P0)
Show: workflows discovered · automation opportunities · potential time saved · recent workflows ·
**Purchase Request Processing** must be the obvious entry point.
Note: "potential time saved" is an *estimate*, so label it as such. Never show it as a measured
result.

### Screen 2 — Workflow Detail (P0)
The timeline: Request → Supplier → Price → Policy → Decision → Approval → PO.
Each step is clickable and shows its automation class as a small badge.
Use the designer's screenshot as the reference for layout and visual weight.

### Screen 3 — Step Intelligence (P0) — the important screen
Show: selected step · automation potential · explanation · **evidence** · confidence · relevant
company context.
**Critical interaction:** "Why does this step exist?"
- Default view shows the explanation inline (the demo must not depend on a click working).
- Include the explicit question affordance if the design has one.
- Evidence items show: `ref` (e.g. `POL-PR-07`), type, title, snippet, relevance.
- Long AI latency is expected here → show a loading state with skeleton, not a spinner over blank
  space.

### Screen 4 — Automation Analysis (P0)
Classify each step with a clearly differentiated visual treatment for
`SAFE` / `HUMAN REVIEW` / `HUMAN REQUIRED`. No colour-only signalling — include text labels.
Show the reason and confidence per step. Show the counts summary.

### Screen 5 — Automation Run (P0)
- Progress list: `✓ request extracted`, `✓ supplier verified`, `✓ price checked`,
  `✓ policy checked`, `⏸ human approval required`.
- Then **Approve / Reject**. Disable both while the request is in flight.
- After approval: `✓ purchase order created`.
- Poll `GET /runs/{run_id}` (a 1–2 s interval is enough; do not build a websocket layer).
- Handle `rejected` visibly — the run must look different from `completed`.

### Screen 6 — Results (P0)
Compare baseline vs AI-assisted: processing time · manual steps · human decisions ·
automation rate · effort.
**Hard rule:** render `null` + `source:"none"` as the text **"not measured"**. Never render `0`,
never render a placeholder number, never hardcode "73% faster" or "34 minutes → 9 minutes".
Every number must trace to the API response.

### States required on every screen (P0)
| State | Requirement |
|---|---|
| Loading | skeleton or spinner per the design; never a blank screen |
| Error | readable message, a Retry action, and the request id if available |
| Empty | a real empty state ("No evidence found for this step"), not a blank area |
| Partial | e.g. workflow loaded but intelligence failed → show the workflow, show the AI error locally |

---

## 5. TASK LIST

| ID | Task | Pri | Est | Dep | Done when |
|---|---|---|---|---|---|
| F1 | Project setup: Next.js + TypeScript app, dev server runs | P0 | 20m | — | `npm run dev` serves the shell |
| F2 | Layout: header, nav, container, page title; base styling per the design | P0 | 30m | F1, `ui/` | shell matches design intent |
| F3 | Typed API client + typed error handling + base URL from env | P0 | 30m | D1 schemas | every call goes through it |
| F4 | Fixtures in `data/fixtures/` mirroring every response shape + a mock-mode switch | P0 | 25m | F3 | full UI works with no backend running |
| F5 | Screen 1 Dashboard | P0 | 35m | F3/F4 | renders from fixtures and from the API |
| F6 | Screen 2 Workflow Detail timeline | P0 | 45m | F4 | steps clickable, class badges visible |
| F7 | Screen 3 Step Intelligence + evidence + confidence | P0 | 55m | F4 | "Why does this step exist?" visible on open |
| F8 | Screen 4 Automation Analysis | P0 | 30m | F4 | three classes visually distinct + labelled |
| F9 | Screen 5 Automation Run + progress + Approve/Reject | P0 | 45m | F4 | full run lifecycle works against the API |
| F10 | Screen 6 Results with measured values and "not measured" handling | P0 | 30m | F4 | no hardcoded numbers anywhere |
| F11 | Loading / error / empty / partial states on all six screens | P0 | 35m | F5–F10 | every state manually verified |
| F12 | Responsive: usable at 1280px (demo laptop) and 768px | P1 | 25m | F2 | no horizontal scroll on the demo path |
| F13 | `/meta` transparency footer (models/providers, synthetic data notice) | P1 | 20m | F3 | judges can see the disclosure on screen |
| F14 | Favicon, page title, meta description, friendly 404 | P1 | 15m | F1 | no default Next.js branding |
| F15 | Production build works and serves correctly with the backend base URL | P0 | 25m | F1–F11 | `npm run build` + preview works |
| F16 | Record the 3-minute safety-net capture of the working path (PHASE 3) and the ≤2 min final video (T-60) | P0 | 30m | — | files on disk |

---

## 6. UI ASSETS — WORKING RULES

Read `04_FRONTEND/ui/README.md` first. Then:

- `ui/screens/` — full-page designs. Filename `NN-<screen-name>.png`, NN = screen number.
- `ui/components/` — component-level designs.
- `ui/references/` — mood/inspiration only; **not** to be implemented literally.
- `ui/assets/` — logos, icons, fonts, images to copy into the app.

Rules:
1. If a `ui/screens/03-step-intelligence*.png` exists, that is your Step Intelligence design.
2. If a screenshot conflicts with a working implementation, the working implementation wins and
   you report the difference — do not silently diverge.
3. Never invent assets. If an icon or logo is missing, use a neutral placeholder and report it.
4. Do not spend more than 10 minutes hunting for a missing asset; move on and report.

---

## 7. ACCEPTANCE CRITERIA (your area)

- [ ] All six screens exist and render from the API.
- [ ] The 13-step demo path completes in a real browser without a manual reload.
- [ ] Every screen has a distinct loading, error and empty state.
- [ ] AI latency shows a loading state on Step Intelligence.
- [ ] The three automation classes are visually distinct **and** text-labelled (not colour-only).
- [ ] Approve and Reject both work, buttons disable while in flight, and the resulting state is
      visibly different.
- [ ] Results renders `null` metrics as "not measured" and never invents a number.
- [ ] No hardcoded performance claims anywhere in the code.
- [ ] Usable at 1280px and 768px on the demo laptop.
- [ ] No console errors during the demo path.
- [ ] UI matches the designer's intent; any deviation is reported.
- [ ] Production build succeeds and runs against the deployed backend.

---

## 8. DEPENDENCIES ON OTHER DEVELOPERS

| Depends on | What | When | If blocked |
|---|---|---|---|
| D1 | Response shapes, error envelope, CORS, `/dashboard` | PHASE 1–2 | Build against the contract; use fixtures; report mismatches rather than guessing shapes |
| D2 | `/intelligence`, `/evidence`, `/automation/analyze` payloads | PHASE 2–3 | Use realistic fixtures with `model: "…"` and `fallback_used: false`; wire live when available |

**D1 and D2 are blocked on you for nothing.** If you report field-name mismatches early, you are
helping, not complaining.

---

## 9. WHAT NOT TO BUILD

Chat UI or chat input · auth/login · user profiles/settings pages · dark/light theme toggle ·
i18n · state-management library beyond what the app needs · component library added late ·
animation library · data-grid library · charting library beyond one simple comparison ·
virtualised lists · a second workflow's screens · storybook · e2e-test framework setup ·
service worker / PWA · analytics · cookie banner · marketing pages · blog/docs pages ·
screenshot tooling in the product.

---

## 10. STOP CONDITIONS

Stop and report when:
- All six screens work with the API, **or**
- 16:50 — stop feature work. 17:00 — release mode only (fix, deploy, record, submit).
- You are blocked for more than 15 minutes — report it.

---

## 11. REPORTING FORMAT (at 12:30, 16:50, and on any blocker)

```
D3 STATUS
DONE:      <screen/task ids + one line each>
NOT DONE:  <ids + why>
BLOCKED:   <what> — needs from: <D1|D2|All> — since: <time>
UI GAPS:   <missing assets or design questions>
RISK:      <one line>
NEXT:      <next 2 tasks>
```