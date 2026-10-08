# HOSOSHI — TEST PLAN

**Owner:** all three developers (D1 backend/core, D2 backend/AI, D3 frontend)
**Quality testing is worth 20 points.** It is a first-class deliverable of this hackathon, not a
formality.
**Companion file:** `06_TESTING/TEST_CASES.md` (the concrete, fill-in-able cases)
**Windows:** first pass in PHASE 6 (16:20–17:00), full E2E in PHASE 8 (freeze window).

---

## 1. TESTING PHILOSOPHY

1. **Test what the demo does, first.** The 13-step demo path is the highest-value test target in
   the whole project. If that fails, nothing else matters.
2. **Real over synthetic.** Test against the real seeded database and the real provider, not only
   mocks. Mocks prove wiring, not behaviour.
3. **Honest results beat green results.** A recorded failure with a written limitation is worth
   more than an unverified pass. Never mark a test PASS that you did not execute.
4. **Evidence over assertion.** Every test result must be reproducible: the command that ran, the
   input used, the output observed.
5. **Small and fast.** Do not build a testing framework. Use `pytest` for the backend, `tsc` + a
   production build + a short manual script for the frontend, and a documented manual procedure
   for E2E.
6. **No new test frameworks.** If a tool is not already in the stack, use a shell command and a
   markdown table instead.

---

## 2. TEST LAYERS

| Layer | What it covers | Who | Tool | When |
|---|---|---|---|---|
| **L1 Unit** | Pure logic: discovery grouping, state machine transitions, safety rules, metrics maths, relevance scoring, prompt parsing | D1, D2 | `pytest` | continuously during PHASE 2 |
| **L2 API / integration** | Every endpoint: success + error codes, schema validation, cross-component wiring | D1 | `pytest` + FastAPI test client | end of PHASE 2 |
| **L3 AI** | Structured output validity, evidence grounding, classification correctness, context cap, provider failure paths, latency | D2 | `pytest` + benchmark script | end of PHASE 2 |
| **L4 Safety** | Approval enforcement, irreversible-action protection, backend override of AI classification | D1 + D2 | `pytest` + manual API probe | PHASE 6 |
| **L5 Frontend** | Screen rendering, loading/error/empty/partial states, approval interaction, responsive | D3 | `tsc`, `npm run build`, manual script | continuously + PHASE 6 |
| **L6 E2E** | The complete 13-step demo path, on the deployed URL | All | documented manual procedure (+ Playwright only if already installed) | PHASE 3 and PHASE 8 |
| **L7 Measurement** | Baseline replay + live AI-assisted measurement, ≥5 runs | D1 | `pytest` + the run script | PHASE 6 and PHASE 8 |

---

## 3. L1 — UNIT TESTS (what must exist)

### D1 — Backend/Core
| Area | Must test |
|---|---|
| Discovery | correct grouping of events into sequences; consolidation of repeated action patterns; stable ordering; empty input; a noisy dataset |
| State machine | every legal transition; **every illegal transition returns 409** |
| Safety rules | amount threshold forces `HUMAN_REQUIRED`; PO cannot be created without an approved approval record |
| Duplicate handling | a repeated request does not create a second run |
| Metrics | baseline replay maths; live instrumentation maths; **null preserved when unmeasured** |
| Validation | invalid input rejected before touching the DB |

### D2 — Backend/AI
| Area | Must test |
|---|---|
| Output schemas | each of the 4 roles' output validates against its Pydantic schema |
| Parsing | fenced JSON, extra whitespace, extra keys, missing keys, wrong types |
| Context cap | evidence and event counts never exceed the configured maximum |
| Evidence grounding | every returned evidence id exists in the DB |
| Classification | known steps get the expected class; irreversible steps are never SAFE |
| Provider failures | timeout, HTTP 429, HTTP 500, malformed body, empty body, refusal |
| Fallback chain | primary fails → fallback used → `fallback_used: true` |
| Latency | record p50/p95 — **do not assert a limit you have not measured** |

### D3 — Frontend
| Area | Must test |
|---|---|
| Types | `tsc --noEmit` clean |
| Build | `npm run build` succeeds |
| API client | typed error parsing for 400/404/409/422/429/500 |
| Null handling | a `null` metric renders "not measured", never `0` |
| Approval UI | buttons disable in flight; `rejected` and `completed` render differently |

---

## 4. L2 — API / INTEGRATION TESTS

Every endpoint in the frozen contract gets at least:

| Case | Expected |
|---|---|
| Happy path | contracted response shape, 200 |
| Unknown id | `404 NOT_FOUND`, error envelope |
| Invalid body | `400 VALIDATION_ERROR`, error envelope |
| Illegal state transition | `409 INVALID_STATE_TRANSITION`, error envelope |
| Invalid AI output (AI endpoints) | `422 AI_OUTPUT_INVALID`, error envelope |

Endpoints: `/health`, `/dashboard`, `/workflows`, `/workflows/{id}`,
`/workflows/{id}/steps/{sid}`, `…/intelligence`, `…/evidence`, `…/automation/analyze`,
`…/automation/run`, `/runs/{id}`, `/approvals/{id}`, `/results/{id}`, `/meta`.

**Contract consistency check:** a single test that asserts each response contains exactly the
fields the frontend types expect. This is the cheapest way to prevent a PHASE 3 integration
mismatch.

---

## 5. L3 — AI TESTS

| Test | Method | Pass condition |
|---|---|---|
| Structured output validity | run the eval set (≥10 cases × chosen provider × 2 runs) | 100% parse-and-validate after the repair path; record the raw validity rate |
| Correctness | field-level match against the eval set's expected values | record the actual percentage; no invented target |
| Evidence grounding | for every demo step, verify each evidence id exists in the DB | zero fabricated ids |
| Explanation quality | rubric review: does it answer "why does this step exist?", does it cite evidence, does it avoid unsupported claims | human judgement, recorded per step |
| Classification correctness | expected class per known step | matches; deviations explained |
| Insufficient context | query a step with deliberately empty evidence | returns `insufficient_context`, does not invent evidence |
| Context cap | assert items-per-prompt ≤ configured maximum | test fails if exceeded |
| Provider failure | mock timeout / 429 / 500 / malformed | typed error, no crash |
| Fallback | kill the primary provider | fallback provider used, `fallback_used: true` |
| Latency | measure p50/p95 over the eval set | recorded, not asserted |
| Consistency | same case twice | record the difference |

**Never state a provider's rate limits, context size or pricing unless verified from official
current documentation during the hackathon.**

---

## 6. L4 — SAFETY TESTS (these prove the product's core promise)

| ID | Test | Expected |
|---|---|---|
| SAFE-01 | Execute a `HUMAN REQUIRED` step directly via any endpoint | rejected, 409 |
| SAFE-02 | POST an approval for an approval id that is not pending | 409 |
| SAFE-03 | Approve the same approval twice | second rejected, 409 |
| SAFE-04 | Create a PO without an approved approval record in the same run | rejected |
| SAFE-05 | Client sends a forged `automation_class: "SAFE"` for the manager approval step | backend re-derives and still blocks |
| SAFE-06 | Amount above the configured threshold | forced `HUMAN_REQUIRED` even if the AI said SAFE |
| SAFE-07 | Reject an approval | run → `rejected`, no PO, no partial execution |
| SAFE-08 | Verify the frontend cannot advance a run without a successful approval POST | UI shows waiting state |

These eight are the difference between "an AI demo" and "an enterprise AI product". Run them and
record them.

---

## 7. L5 — FRONTEND STATES (all six screens)

For each of the six screens verify:

| State | How to force it | Expected |
|---|---|---|
| Loading | throttle the network / delay the response | skeleton or spinner, no blank screen |
| Error | stop the backend, or point at a bad URL | readable message + Retry + request id |
| Empty | return an empty evidence/step list | a real sentence, not an empty box |
| Partial | load the workflow, fail only the AI call | workflow still visible, AI error shown locally |

Also verify:

- [ ] No console errors on the demo path
- [ ] Automation classes are text-labelled, not colour-only
- [ ] "Why does this step exist?" is visible on open (demo does not depend on a click)
- [ ] Results shows "not measured" for `null` metrics
- [ ] 1280px and 768px: no horizontal scroll on the demo path
- [ ] Favicon, page title and meta description are not the framework defaults

---

## 8. L6 — END-TO-END TEST (the 13-step demo path)

Run this procedure **three times**: once in PHASE 3 (local), once in PHASE 6, once in PHASE 8
against the deployed URL from a clean, logged-out browser.

| Step | Action | Pass condition |
|---|---|---|
| 1 | Open Dashboard | loads, shows Purchase Request Processing |
| 2 | Select Purchase Request Processing | detail loads |
| 3 | Timeline visible | 7 steps in order |
| 4 | Select "Verify Price" | Step Intelligence loads |
| 5 | "Why does this step exist?" visible | visible on open |
| 6 | Explanation + evidence | ≥1 evidence item with a real id |
| 7 | Open Automation Analysis | classes listed per step |
| 8 | SAFE / HUMAN REVIEW / HUMAN REQUIRED | all three visually distinct + labelled |
| 9 | Run automation | SAFE steps execute |
| 10 | Stops at manager approval | `⏸ human approval required`, approve/reject visible |
| 11 | Approve | run advances |
| 12 | Purchase order created | `✓ purchase order created` |
| 13 | Results | baseline vs AI-assisted with real numbers + sources |

**Record a pass/fail row per step every time you run it.** A failed step at T-90 is the most
valuable piece of information you can have.

---

## 9. L7 — MEASUREMENT / BASELINE COMPARISON

| Metric | Baseline source | AI-assisted source |
|---|---|---|
| total duration | `replayed_from_dataset` | `measured_in_this_run` |
| manual steps | derived from the replay | counted during the run |
| human decisions | derived from the replay | counted during the run |
| automation rate | 0 for human-only | computed from executed SAFE steps |
| errors | from the dataset | observed during the run |

Rules:
1. Run the AI-assisted path **at least 5 times**; record `runs_count` honestly.
2. Report the method in `measurement_method`, in plain words a judge can understand.
3. Unmeasured → `null` + `source: "none"` → UI shows "not measured".
4. **Never fabricate.** No "73% faster". No "34 minutes → 9 minutes" unless that exact number came
   from a recorded run.

---

## 10. PERFORMANCE / LATENCY

| Measurement | Method | Reported as |
|---|---|---|
| AI call latency (per role) | measured over the eval set | p50 and p95, with the sample size |
| Backend endpoint latency | measured for the demo endpoints | p50 |
| Full demo path duration | timed once end to end | real seconds |

**Do not assert a performance SLA you have not measured.** Report what you observed. If you want
to claim "under N seconds", you must have measured it at least 5 times and reported the worst or
median case honestly.

---

## 11. FAILURE / ROBUSTNESS TESTS

| Scenario | Expected |
|---|---|
| AI provider down | non-AI endpoints keep working; AI calls return a typed retryable error; UI shows a clean error |
| AI rate limit | backoff, single retry, fallback provider, then typed `RATE_LIMITED` |
| AI malformed output | repair attempt → retry → `AI_OUTPUT_INVALID` |
| Backend process restart | run state either survives or fails cleanly; no corrupt state |
| Database missing/corrupt | reseed from the deterministic seed script; document the recovery |
| Frontend loses backend mid-run | polling shows an error with Retry; run recoverable |
| Duplicate approval click | second rejected cleanly |
| Browser refresh mid-run | state recoverable from `GET /runs/{id}` |
| Deployed URL unreachable | last-known-good deploy restored (see `08_EMERGENCY/FALLBACK_PLAN.md`) |

---

## 12. MANUAL ACCEPTANCE CHECKLIST (run at 16:50 and again at T-90)

- [ ] The 13-step demo path passes with no manual reload
- [ ] Evidence ids resolve against the seeded database
- [ ] The AI explanation actually answers *why*, with citations
- [ ] The three automation classes are shown for every step with a reason
- [ ] The run stops at the human approval step and cannot skip it
- [ ] Approve completes the run; Reject does not
- [ ] Results show real numbers with sources; unmeasured values say "not measured"
- [ ] All six screens have loading, error and empty states
- [ ] `/meta` shows the real provider/model and the synthetic-data notice
- [ ] Nothing in the UI claims a metric that was not measured
- [ ] No console errors
- [ ] 1280px and 768px usable

---

## 13. EVIDENCE COLLECTION FOR THE SUBMISSION

Assemble before T-45. Keep it in one place.

| Item | Source |
|---|---|
| This plan + `TEST_CASES.md` with all columns filled | testing record |
| Automated test output (backend) | saved log |
| Provider benchmark table (measured values only) | `data/benchmark/` |
| ≥5-run measurement summary | `GET /results` output + run log |
| The 13-step E2E pass/fail record from the deployed URL | PHASE 8 log |
| Safety test results SAFE-01…08 | test output |
| Frontend state checklist | §12 above, signed off with a name |
| Known limitations list | honest, specific |
| Disclosures: models, synthetic data, third-party components, fallback behaviour | submission section |

**Submission text must state what was tested, what passed, what failed, and what remains a
limitation.** Failing tests that are honestly disclosed are better than a suspiciously perfect
report.

---

## 14. TEST OWNERSHIP

| Area | Primary | Secondary | Verified by |
|---|---|---|---|
| L1/L2 backend | D1 | D2 | all |
| L3 AI | D2 | D1 | all |
| L4 safety | D1 | D2 | all |
| L5 frontend | D3 | — | all |
| L6 E2E | all three | — | all |
| L7 measurement | D1 | D2 | all |
| Final report | D1 compiles | all contribute | all sign off verbally |

---

## 15. TIME BUDGET FOR TESTING

| Window | Time | Focus |
|---|---|---|
| PHASE 2 (written with the code) | included in each task | L1 + L2 + L3 |
| PHASE 6 (16:20–17:00) | 40 min | run automated suites; execute TEST-001…008; L4 safety probes |
| PHASE 8 (T-90 → T-60) | 30 min | full E2E on the deployed URL; fix only P0 defects |
| T-45 → T-30 | 15 min | assemble the submission evidence |

**If testing is squeezed, cut polish — never cut tests.** Quality testing is 20 points.