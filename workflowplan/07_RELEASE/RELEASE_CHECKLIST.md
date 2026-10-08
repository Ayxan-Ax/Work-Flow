# RELEASE CHECKLIST — FINAL 3-HOUR WINDOW

**Release / freeze mode begins: 17:00 Baku, 9 October 2026.**
**Official freeze: 20:00 Baku.** Hard, immovable.

**This window is protected. No feature development. No architectural changes. No new endpoints,
no new screens, no refactors, no dependency upgrades.**

| Mark | Baku | Block | Owner |
|---|---|---|---|
| T-180 | 17:00 | Feature freeze + final bug triage | All |
| T-150 | 17:30 | Integration + production build | D1 + D3 |
| T-120 | 18:00 | Deploy + production smoke test | D1 + D3 |
| T-90 | 18:30 | Full E2E + critical bug fixes only | All |
| T-60 | 19:00 | Demo video recording + submission content | D3 + D1 |
| T-45 | 19:15 | Video finalise, disclosures, setup instructions | All |
| T-30 | 19:30 | Final submission verification (PHASE 9) | All |
| T-15 | 19:45 | Final checks + last corrections | All |
| T-0 | 20:00 | **FREEZE. Stop all edits.** | All |

> If the official start time differs from 09:00, the phase *order* and the 17:00 / 20:00 anchors
> never change.

---

## THE ONE SENTENCE THAT MATTERS

**A smaller working vertical slice is better than a larger broken product.**

When in doubt at any point in this window: prefer the version that works.

---

# T-180 (17:00) — FEATURE FREEZE

**The most important block. Everything after this is protection, not progress.**

- [ ] **Announce the freeze out loud.** No new features from this moment.
- [ ] Close the bug list. One list. Everything known goes on it.
- [ ] Sort the bug list into three buckets:
  - **P0 — on the 13-step demo path:** must fix
  - **P1 — visible but not blocking the demo:** fix only if trivially fixable
  - **P2 — everything else:** becomes a "known limitation" in the submission. Do not fix.
- [ ] Delete or disable half-finished experimental features (hidden flags, dead routes, dead nav
      items). A broken link during a live demo is far more expensive than a missing nice-to-have.
- [ ] Remove all debug logging, `console.log`, test endpoints, and any TODO stubs from the running
      app.
- [ ] Confirm no real API keys, tokens or `.env` contents are anywhere they could be served to the
      browser.
- [ ] Confirm **fixture mode is OFF** in the deployed build.
- [ ] Freeze the AI provider/model configuration (set at 15:50). No more switching.

**Done when:** the bug list has three buckets, the app has no dead routes or debug output, and
nobody is adding anything.

---

# T-150 (17:30) — INTEGRATION & BUILD

## Backend (D1)
- [ ] Run the full backend test suite one final time. Record the output.
- [ ] Seed the production database from the deterministic seed script. Verify the data is present.
- [ ] Production configuration check: env vars set on the platform, CORS locked to the deployed
      origin, no dev-only settings.
- [ ] `GET /api/v1/health` → 200 locally in production mode.
- [ ] Walk the 8 endpoints D1 owns once, confirming each returns the contracted shape.

## AI (D2)
- [ ] Confirm the production provider key is present and the call succeeds.
- [ ] Confirm the fallback provider is configured.
- [ ] Warm the cache for every step of the Purchase Request workflow (so the demo has no AI latency
      risk).
- [ ] Confirm `/meta` exposes the real provider/model ids.

## Frontend (D3)
- [ ] `npm run build` succeeds with production settings.
- [ ] Type-check clean.
- [ ] Confirm the production build points at the deployed backend base URL.
- [ ] Confirm no default framework branding (title, favicon, 404).

**Done when:** production artefacts build cleanly on both sides and the local production-mode
stack runs the demo path.

---

# T-120 (18:00) — DEPLOY & SMOKE TEST

- [ ] Deploy the backend.
- [ ] Deploy the frontend.
- [ ] Open the deployed URL in a **clean, logged-out browser profile**.
- [ ] Smoke test checklist:
  - [ ] Page loads with no console errors
  - [ ] Dashboard loads and shows Purchase Request Processing
  - [ ] Clicking through to Workflow Detail works
  - [ ] Step Intelligence loads (AI call succeeds on production keys)
  - [ ] Automation Analysis loads
  - [ ] Automation Run starts and stops at approval
  - [ ] Approve → PO created
  - [ ] Results render with real numbers
- [ ] Confirm CORS: the browser console shows no CORS errors.
- [ ] Confirm the API key is server-side only (not visible in the browser network tab payload).

**If the deploy fails:** go to `08_EMERGENCY/FALLBACK_PLAN.md` → "Deployment fails". Restore the
last known-good deploy. Do not attempt a novel fix at this hour.

**Done when:** the deployed URL completes the smoke test from a clean browser.

---

# T-90 (18:30) — FULL E2E + CRITICAL BUG FIXES ONLY

- [ ] Run the complete **13-step E2E** against the deployed URL (`06_TESTING/TEST_CASES.md` §6).
- [ ] Record pass/fail per step.
- [ ] Run the safety tests SAFE-01 … SAFE-08.
- [ ] Run TEST-001 … TEST-008 against the deployed environment.
- [ ] Fill **Actual result** and **Pass/Fail** in `TEST_CASES.md`.
- [ ] Fix only P0 defects on the demo path. Each fix is small and verified immediately.
- [ ] Any P1/P2 defect: record it as a known limitation. Do not start it.
- [ ] Verify the AI fallback path once: simulate the primary provider failing.

**Bug-fix discipline:**
1. Smallest possible change.
2. No refactoring while fixing a bug.
3. Re-run the affected part of the E2E immediately after each fix.
4. If a fix takes more than 10 minutes, revert it and record the defect as a limitation.

**Done when:** the 13-step path passes on the deployed URL, or every remaining failure is written
down as a limitation.

---

# T-60 (19:00) — DEMO VIDEO + SUBMISSION CONTENT

## Video (D3) — **hard limit 2 minutes**

- [ ] Record the demo path with a clean browser, logged out, on the deployed URL.
- [ ] Hide anything that leaks credentials, personal data, or provider keys.
- [ ] Follow this narrative (do not explain architecture):

| Time | Content | On screen |
|---|---|---|
| 0:00–0:10 | Problem statement, one line | Title card |
| 0:10–0:20 | "The workflow we documented vs what actually happens" | Workflow timeline |
| 0:20–0:45 | "Why does this step exist?" + evidence | Step Intelligence |
| 0:45–1:00 | Automation analysis: SAFE / REVIEW / HUMAN | Automation Analysis |
| 1:00–1:25 | Run → stops at approval → human approves → PO created | Automation Run |
| 1:25–1:50 | Measured results | Results |
| 1:50–2:00 | Close: OBSERVE → UNDERSTAND → AUTOMATE → MEASURE | End card |

- [ ] Fallback: the 3-minute safety-net capture from PHASE 3 exists on disk.

## Submission content (D1 + D2)

- [ ] Project name + tagline
- [ ] Team members and roles
- [ ] **Demo link** — verify from a private/logged-out window
- [ ] **Source / export link** — verify from a logged-out browser
- [ ] Short architecture description
- [ ] Quality testing results (real, from `TEST_CASES.md`, including failures)
- [ ] Known limitations

**Done when:** the video exists and the submission skeleton has no empty section.

---

# T-45 (19:15) — FINALISE, DISCLOSE, DOCUMENT

## Disclosures (D2 + D1) — **never skip these**

- [ ] **AI models / providers used** — exact provider and model ids, per role.
- [ ] Whether role specialisation was used, and the evidence for it.
- [ ] **Synthetic data disclosure** — the dataset is entirely fictional; no real company data.
- [ ] **Third-party components** — every library, framework and service used.
- [ ] Any external models or third-party APIs used.
- [ ] **Any fallback or mock behaviour used in the demo** — and where.
- [ ] Provider benchmark numbers, if included — **measured values only**.
- [ ] Never describe a third-party component as built from scratch.

## Setup instructions (D1)

- [ ] Literal, copy-pasteable steps: prerequisites, install, configure, seed, run backend, run
      frontend, verify.
- [ ] **Verified by following them from scratch** on a clean shell — by someone other than the
      author.
- [ ] Note the known-good Python and Node versions.

## Quality testing results (All)

- [ ] `TEST_CASES.md` has no unexplained blanks.
- [ ] Summary of findings written: what was tested, what passed, what failed, what was fixed,
      what remains a limitation.
- [ ] Screenshots or logs of key evidence attached if useful.

## Presentation readiness (All)
- [ ] One person can run the demo unaided (dry run it once).
- [ ] Presenter knows the fallback story if the network dies (see FALLBACK_PLAN).
- [ ] Team can answer, in one sentence each: what problem, how it works, what was measured, what
      was built by whom, what the limitations are.

**Done when:** the submission is complete enough to submit at T-30 with only verification left.

---

# T-30 (19:30) — FINAL SUBMISSION VERIFICATION

- [ ] Run the 13-step demo path once more on the deployed URL from a clean browser.
- [ ] Open the demo link from a logged-out window. It works.
- [ ] Open the source/export link from a logged-out window. It works.
- [ ] Video plays and is ≤ 2 minutes.
- [ ] Every required submission field is filled or explicitly marked N/A.
- [ ] One person reads the entire submission text aloud for typos and false claims.
- [ ] **Fact-check every claim in the submission against reality:**
  - [ ] Every number traces to a recorded measurement
  - [ ] Every "we built X" that used a third-party component is disclosed
  - [ ] No invented provider limits, pricing, or capabilities
  - [ ] No claim of a capability that was not demonstrated
- [ ] Submit.

---

# T-15 (19:45) — FINAL CHECKS

- [ ] Confirm the submission was accepted and a confirmation is recorded.
- [ ] Take a final screenshot of the running demo as evidence.
- [ ] Confirm the deployed URL still works (do not deploy again after this).
- [ ] Silence notifications / stop background jobs that could break something.

---

# T-0 (20:00) — FINAL FREEZE

- [ ] **Stop all edits. All of them.**
- [ ] No new deploys, no commits, no config changes.
- [ ] Confirm the submission is in.
- [ ] Record the final state: what was submitted, where, and any known limitations.

---

# WHAT MUST NEVER HAPPEN IN THIS WINDOW

- ❌ A new feature "because we have 20 minutes left"
- ❌ A refactor "while we're in there"
- ❌ A dependency upgrade
- ❌ A provider switch after 15:50
- ❌ A metric typed in by hand into a component
- ❌ A claim in the submission that was not verified
- ❌ Discovering a missing submission field at T-10 (the skeleton was drafted at 16:20)
- ❌ Spending the last hour on styling

---

# IF YOU ARE BEHIND AT 17:00

Cut immediately, in this order:

1. Cosmetic polish
2. Secondary workflows
3. Advanced filtering
4. Non-essential dashboard metrics
5. Additional connectors
6. Advanced visualisations
7. Secondary AI features

**Never cut:** the core workflow · "Why does this step exist?" · evidence · automation
classification · human approval · working execution · quality testing · result measurement.