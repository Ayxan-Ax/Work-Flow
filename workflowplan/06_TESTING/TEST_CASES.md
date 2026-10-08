# HOSOSHI — TEST CASES

**Status legend:** `Actual result` and `Pass/Fail` are intentionally blank. Fill them in as you run
the cases. A blank row at submission time is a lost mark.

**Rules for filling this in:**
1. Only write PASS if you actually executed the case and observed the expected behaviour.
2. Write FAIL honestly. A recorded failure with a written limitation is worth more than a
   fabricated pass.
3. `Notes` must say what broke, what was fixed, or what remains a limitation — not "ok".
4. Record the date/time and who ran it in the summary table at the top.

---

## 0. EXECUTION LOG

| Round | Date/time (Baku) | By | Environment | Cases run | Passed | Failed | Notes |
|---|---|---|---|---|---|---|---|
| 1 — PHASE 6 | | | local | | | | |
| 2 — PHASE 8 (T-90) | | | deployed URL | | | | |
| 3 — final (T-45) | | | deployed URL, clean browser | | | | |

---

## 1. MANDATORY SCENARIOS (TEST-001 … TEST-008)

These eight are the minimum required set. They map to rows in the seeded synthetic dataset — if a
scenario has no corresponding data, that is a bug in the seeder, not an excuse to skip the test.

---

### TEST-001 — Normal purchase request

| Field | Value |
|---|---|
| **Layer** | E2E + AI |
| **Input** | A valid `purchase_request` with all fields present: employee, department, items, supplier, amount within normal range |
| **Expected behaviour** | Discovery returns the full workflow; all steps classified; `Verify Price` returns a grounded explanation with ≥1 evidence item whose id exists in the DB; automation run executes SAFE steps and stops at manager approval; approve → PO created; results return measured numbers with `source` labels |
| **Actual result** | |
| **Pass/Fail** | |
| **Notes** | |

---

### TEST-002 — Missing supplier

| Field | Value |
|---|---|
| **Layer** | Backend validation + AI |
| **Input** | `purchase_request` with `supplier_id = null` |
| **Expected behaviour** | Backend does not fabricate a supplier. The `Identify Supplier` step either resolves from items or is marked as requiring input; the run either stops with a clear "missing information" state or fails that step cleanly. No invented supplier name anywhere in the UI |
| **Actual result** | |
| **Pass/Fail** | |
| **Notes** | |

---

### TEST-003 — Duplicate request

| Field | Value |
|---|---|
| **Layer** | Backend logic |
| **Input** | Submit the same `purchase_request_id` twice |
| **Expected behaviour** | No second run is created; the second submission returns a clean, typed response (e.g. `409 INVALID_STATE_TRANSITION` or an explicit "already processed" response); no duplicate PO |
| **Actual result** | |
| **Pass/Fail** | |
| **Notes** | |

---

### TEST-004 — Unusual price

| Field | Value |
|---|---|
| **Layer** | AI + business rules |
| **Input** | `purchase_request` whose amount is far above the supplier's usual range for that item |
| **Expected behaviour** | `Verify Price` explanation references the price-variance policy evidence; the step is not silently auto-approved; the amount threshold rule forces `HUMAN REQUIRED` (or `HUMAN REVIEW`) even if the model would say SAFE |
| **Actual result** | |
| **Pass/Fail** | |
| **Notes** | |

---

### TEST-005 — Missing information

| Field | Value |
|---|---|
| **Layer** | Backend validation + UI |
| **Input** | `purchase_request` missing a required field (e.g. no items, or no department) |
| **Expected behaviour** | `400 VALIDATION_ERROR` with a readable message; the UI shows an error state with Retry; no partial run is left in an inconsistent state |
| **Actual result** | |
| **Pass/Fail** | |
| **Notes** | |

---

### TEST-006 — Conflicting policy

| Field | Value |
|---|---|
| **Layer** | AI reasoning + evidence synthesis |
| **Input** | A step for which two policies apply with contradictory rules (e.g. one permits an amount, another forbids it) |
| **Expected behaviour** | The explanation states the conflict explicitly and cites both policies with their ids; the step is classified at least `HUMAN REVIEW`; the product does not silently pick one policy |
| **Actual result** | |
| **Pass/Fail** | |
| **Notes** | |

---

### TEST-007 — Ambiguous historical decision

| Field | Value |
|---|---|
| **Layer** | AI reasoning |
| **Input** | A step whose relevant decisions conflict or whose outcome is unclear |
| **Expected behaviour** | The explanation surfaces the ambiguity, cites the decision ids, and returns a lowered confidence; the step is `HUMAN REVIEW` or `HUMAN REQUIRED`; no confident fabricated answer |
| **Actual result** | |
| **Pass/Fail** | |
| **Notes** | |

---

### TEST-008 — Unsafe automation attempt

| Field | Value |
|---|---|
| **Layer** | Safety (the most important test in the project) |
| **Input** | Direct API attempt to execute the `Manager Approval` step (`HUMAN REQUIRED`) without an approval; plus a forged client payload claiming `automation_class: "SAFE"` |
| **Expected behaviour** | Both attempts rejected with `409 INVALID_STATE_TRANSITION`; the backend re-derives the class and ignores the client-supplied one; no PO created; no state advance |
| **Actual result** | |
| **Pass/Fail** | |
| **Notes** | |

---

## 2. SAFETY TESTS (SAFE-01 … SAFE-08)

| ID | Test | Input | Expected behaviour | Actual | P/F | Notes |
|---|---|---|---|---|---|---|
| SAFE-01 | Execute a `HUMAN REQUIRED` step directly | `POST` to the run/execute endpoint for `stp_approval` | Rejected, 409 | | | |
| SAFE-02 | Approve a non-pending approval | `POST /approvals/{id}` on a completed/decided approval | 409, no state change | | | |
| SAFE-03 | Approve the same approval twice | two identical `POST /approvals/{id}` | first succeeds, second rejected | | | |
| SAFE-04 | Create PO without an approved approval | run advanced past approval by any means | rejected, no PO | | | |
| SAFE-05 | Forged client automation class | body contains `automation_class: "SAFE"` for approval step | backend re-derives, still blocks | | | |
| SAFE-06 | Amount threshold override | amount above configured threshold | forced `HUMAN_REQUIRED` regardless of AI class | | | |
| SAFE-07 | Reject an approval | `POST /approvals/{id}` with `decision: "reject"` | run → `rejected`, no PO, no partial execution | | | |
| SAFE-08 | Frontend cannot advance without approval | inspect the UI while run is `waiting_approval` | no path to advance except Approve/Reject | | | |

---

## 3. API TESTS (API-01 … API-13)

Repeat for each endpoint: success shape, 400, 404, and 409 where applicable.

| ID | Endpoint | Expected success | Error codes to verify | Actual | P/F | Notes |
|---|---|---|---|---|---|---|
| API-01 | `GET /health` | 200 `{status, version}` | — | | | |
| API-02 | `GET /dashboard` | contracted dashboard object in ONE call | — | | | |
| API-03 | `GET /workflows` | list with `discovery` metadata | — | | | |
| API-04 | `GET /workflows/{id}` | workflow + ordered steps | 404 unknown id | | | |
| API-05 | `GET /workflows/{id}/steps/{sid}` | step object | 404 unknown id | | | |
| API-06 | `GET /workflows/{id}/steps/{sid}/intelligence` | answer + evidence[] + confidence + model | 404, 422 invalid AI output, 503 provider down | | | |
| API-07 | `GET /workflows/{id}/evidence` | evidence[] filtered by `step_id`/`type` | 404 | | | |
| API-08 | `POST /workflows/{id}/automation/analyze` | class + reason + confidence per step | 404, 422 | | | |
| API-09 | `POST /workflows/{id}/automation/run` | run in `waiting_approval` with `approval_id` | 404, 409 | | | |
| API-10 | `GET /runs/{id}` | run state + per-step states + `blocked_on` | 404 | | | |
| API-11 | `POST /approvals/{id}` | updated run (`completed` / `rejected`) | 404, 409 | | | |
| API-12 | `GET /results/{id}` | baseline + ai_assisted + delta + `source` per block | 404 | | | |
| API-13 | `GET /meta` | dataset + model/provider disclosure | — | | | |

**Contract consistency:** one check that each response contains exactly the fields the frontend
types expect. `Actual: ______  P/F: ____`

---

## 4. AI TESTS (AI-01 … AI-10)

| ID | Test | Input | Expected behaviour | Actual | P/F | Notes |
|---|---|---|---|---|---|---|
| AI-01 | Structured output validity | eval set (≥10 cases) × chosen provider × 2 runs | 100% parse+validate after repair path; raw validity rate recorded | | | |
| AI-02 | Correctness | eval set | field-level match percentage recorded (no invented target) | | | |
| AI-03 | Evidence grounding | demo workflow steps | every returned evidence id exists in the DB; zero fabricated ids | | | |
| AI-04 | Explanation quality | "Verify Price" | answers *why*, cites evidence, no unsupported claims (rubric review) | | | |
| AI-05 | Classification correctness | known steps | expected class per step; deviations explained | | | |
| AI-06 | Insufficient context | a step with deliberately empty evidence | returns `insufficient_context`, invents nothing | | | |
| AI-07 | Context cap | all AI calls | items per prompt ≤ configured maximum (test must fail if exceeded) | | | |
| AI-08 | Provider failure | mock timeout / 429 / 500 / malformed / empty | typed error, no crash, `retryable` flag correct | | | |
| AI-09 | Fallback chain | kill the primary provider | fallback provider used; `fallback_used: true`; non-AI endpoints unaffected | | | |
| AI-10 | Latency | eval set | p50 / p95 recorded with sample size — **not asserted against an unmeasured SLA** | | | |

---

## 5. FRONTEND STATE TESTS (FE-01 … FE-06, per screen)

For each of the six screens: Dashboard, Workflow Detail, Step Intelligence, Automation Analysis,
Automation Run, Results.

| ID | Screen | Loading | Error | Empty | Partial | Actual | P/F | Notes |
|---|---|---|---|---|---|---|---|---|
| FE-01 | Dashboard | ☐ | ☐ | ☐ | ☐ | | | |
| FE-02 | Workflow Detail | ☐ | ☐ | ☐ | ☐ | | | |
| FE-03 | Step Intelligence | ☐ | ☐ | ☐ | ☐ | | | |
| FE-04 | Automation Analysis | ☐ | ☐ | ☐ | ☐ | | | |
| FE-05 | Automation Run | ☐ | ☐ | ☐ | ☐ | | | |
| FE-06 | Results | ☐ | ☐ | ☐ | ☐ | | | |

How to force each state: Loading = throttle the network. Error = stop the backend.
Empty = return an empty list from the endpoint. Partial = fail only the AI call.

Additional frontend checks:

| ID | Check | Expected | Actual | P/F | Notes |
|---|---|---|---|---|---|
| FE-07 | "Why does this step exist?" visible on open | yes, no click needed | | | |
| FE-08 | Automation classes text-labelled (not colour-only) | yes | | | |
| FE-09 | Approve/Reject disable while in flight | yes | | | |
| FE-10 | `rejected` vs `completed` visually distinct | yes | | | |
| FE-11 | `null` metric renders "not measured" | yes, never `0` | | | |
| FE-12 | No console errors on the demo path | none | | | |
| FE-13 | 1280px and 768px: no horizontal scroll | both | | | |
| FE-14 | No fabricated number in any component | none | | | |
| FE-15 | `tsc --noEmit` clean; `npm run build` succeeds | yes | | | |

---

## 6. END-TO-END DEMO PATH (E2E-01 … E2E-13)

Run three times: local (PHASE 3), PHASE 6, deployed URL (PHASE 8). Record pass/fail per step each
time.

| ID | Step | Expected | Actual | P/F | Notes |
|---|---|---|---|---|---|
| E2E-01 | Open Dashboard | loads, shows Purchase Request Processing | | | |
| E2E-02 | Select Purchase Request Processing | detail loads | | | |
| E2E-03 | Timeline visible | 7 steps in order | | | |
| E2E-04 | Select "Verify Price" | Step Intelligence loads | | | |
| E2E-05 | "Why does this step exist?" visible | visible on open | | | |
| E2E-06 | Explanation + evidence | ≥1 evidence item with a real id | | | |
| E2E-07 | Open Automation Analysis | classes listed per step | | | |
| E2E-08 | SAFE / HUMAN REVIEW / HUMAN REQUIRED | all three distinct + labelled | | | |
| E2E-09 | Run automation | SAFE steps execute | | | |
| E2E-10 | Stops at manager approval | ⏸ + approve/reject visible | | | |
| E2E-11 | Approve | run advances | | | |
| E2E-12 | Purchase order created | ✓ shown | | | |
| E2E-13 | Results | baseline vs AI-assisted with real numbers + sources | | | |

---

## 7. MEASUREMENT TESTS (M-01 … M-06)

| ID | Test | Expected | Actual | P/F | Notes |
|---|---|---|---|---|---|
| M-01 | Baseline replay produces non-zero durations | realistic values from dataset timestamps | | | |
| M-02 | Baseline `source` = `replayed_from_dataset` | exact string | | | |
| M-03 | AI-assisted `source` = `measured_in_this_run` | exact string | | | |
| M-04 | ≥5 AI-assisted runs measured; `runs_count` honest | ≥5 | | | |
| M-05 | Unmeasured metric → `null` + `source: "none"` | preserved, never `0` | | | |
| M-06 | No hardcoded performance claim anywhere in repo/UI | none found | | | |

**Recorded measurement values (fill in — real numbers only):**

| Metric | Baseline | AI-assisted | Source label | Measured at |
|---|---|---|---|---|
| total_duration_ms | | | | |
| manual_steps | | | | |
| human_decisions | | | | |
| automation_rate | | | | |
| errors | | | | |
| runs_count | — | | | |
| AI latency p50 / p95 (ms) | — | | | |

---

## 8. FAILURE / ROBUSTNESS TESTS (F-01 … F-09)

| ID | Scenario | Expected | Actual | P/F | Notes |
|---|---|---|---|---|---|
| F-01 | AI provider down | non-AI endpoints keep working; AI calls typed retryable error; UI clean | | | |
| F-02 | AI rate limit | backoff → retry → fallback → typed `RATE_LIMITED` | | | |
| F-03 | AI malformed output | repair → retry → `AI_OUTPUT_INVALID`; never a crash | | | |
| F-04 | Backend restart mid-run | state survives or fails cleanly; no corruption | | | |
| F-05 | DB missing/corrupt | reseed from deterministic seed; recovery documented | | | |
| F-06 | Frontend loses backend mid-run | error with Retry; run recoverable | | | |
| F-07 | Duplicate approval click | second rejected cleanly | | | |
| F-08 | Browser refresh mid-run | state recoverable from `GET /runs/{id}` | | | |
| F-09 | Deployed URL unreachable | last-known-good deploy restored (see FALLBACK_PLAN) | | | |

---

## 9. DISCLOSURE CHECKLIST (fill at T-45)

| ID | Item | Recorded value | Done |
|---|---|---|---|
| D-01 | AI providers/models used (exact ids) | | ☐ |
| D-02 | Whether role specialisation was used, and why | | ☐ |
| D-03 | Dataset is fully synthetic — no real company data | | ☐ |
| D-04 | Third-party libraries / frameworks / services | | ☐ |
| D-05 | Any fallback or mock behaviour used in the demo (and where) | | ☐ |
| D-06 | Any measured benchmark numbers included in the submission | | ☐ |
| D-07 | Known limitations (honest, specific) | | ☐ |

---

## 10. SUMMARY OF FINDINGS (write this up for the submission)

Fill this in as a short paragraph. Judges read this.

> **What we tested:** <layers, counts>
> **What passed:** <summary>
> **What failed:** <list, or "none at final release">
> **What we fixed during testing:** <list>
> **Known limitations we did not fix:** <list>
> **Measurement method:** <how baseline and AI-assisted numbers were obtained>

---

**END OF TEST CASES.** Every blank must be filled or explicitly marked "not run" before submission.