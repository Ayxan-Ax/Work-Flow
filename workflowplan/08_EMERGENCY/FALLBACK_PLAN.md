# FALLBACK / EMERGENCY PLAN

**Core principle:**

> **A smaller working vertical slice is better than a larger broken product.**

**Second principle:** if AI becomes unreliable, preserve the product experience with a **controlled,
clearly-disclosed** fallback — never fake a measured result, never invent evidence.

**Third principle:** nobody fixes an emergency alone. The three developers act as one team, and the
person closest to the problem leads the fix.

---

## 0. THE FIRST 5 MINUTES OF ANY EMERGENCY

1. **Stop the clock-panic.** Name the failure out loud.
2. **Decide: is the demo path broken?** If yes → this is P0, everything else stops.
3. **Pick the fallback from this document** and execute it. Do not improvise a new architecture.
4. **Tell the team** what you are doing in one line.
5. **If not resolved in 15 minutes**, apply the "shrink the slice" rule below and move on.

---

## 1. AI PROVIDER FAILS (down, 5xx, refusing, or consistently malformed)

| Step | Action |
|---|---|
| 1 | Confirm the failure: one manual call, check the HTTP status and body |
| 2 | Check the API key and the env var name |
| 3 | Switch to the **configured fallback provider** (set in PHASE 4) |
| 4 | If no fallback works: return a **typed error** (`PROVIDER_UNAVAILABLE` / `TIMEOUT`) with `retryable: true` |
| 5 | The frontend shows a clean "AI analysis temporarily unavailable" state with Retry |
| 6 | **All non-AI endpoints must keep working** — dashboard, workflow, steps, automation run |
| 7 | If the demo cannot depend on a live AI call: use a **pre-generated, validated response cache** |
| 8 | **Disclose it** in the submission: "a cached/pre-generated AI response was used for the demo" |

### Controlled fallback for `explain` (last resort, must be disclosed)
A deterministic template that assembles the answer from the **actually retrieved** evidence items:

```
"This step exists because <top evidence title> (<ref>) applies to <entity>, and <second evidence
title> (<ref>) shows the historical decision <outcome>. Evidence retrieved: <refs>."
```

Set `"fallback_used": true` in the response so the UI and the submission can disclose it.

### What is NEVER allowed
- ❌ Inventing evidence that is not in the dataset
- ❌ A confident answer with no evidence
- ❌ Hiding that the AI was not live

---

## 2. API RATE LIMIT REACHED

| Step | Action |
|---|---|
| 1 | Back off (exponential, short) and retry **once** |
| 2 | Switch to the fallback provider |
| 3 | If exhausted: typed `RATE_LIMITED` (429), `retryable: true` |
| 4 | Serve the cached/pre-generated response for the demo workflow |
| 5 | Do not switch providers after the 15:50 model lock — caching is the answer, not switching |

**Note:** observed rate-limit behaviour is recorded during the PHASE 2 benchmark. **Never state a
provider's limits from memory** — verify from official documentation or say nothing.

---

## 3. AI RESPONSE IS MALFORMED

| Step | Action |
|---|---|
| 1 | Schema validation rejects it automatically (this is designed to happen) |
| 2 | Attempt one repair (extract JSON from fenced/blocked text) |
| 3 | Retry the request once |
| 4 | Still invalid → `AI_OUTPUT_INVALID` (422), `retryable: true` |
| 5 | UI shows a partial state: the step renders, the explanation shows the error + Retry |
| 6 | Record the failure in `TEST_CASES.md` — malformed output is a required test case |

**Never** pass raw model text through to the frontend as if it were valid product data.

---

## 4. BACKEND IS UNSTABLE (crashes, hangs, 500s)

| Step | Action |
|---|---|
| 1 | Restart the process |
| 2 | Check the log for the actual exception |
| 3 | Check DB connectivity |
| 4 | If it crashes within 5 minutes of restarting: **revert to the last known-good state** |
| 5 | Disable the offending feature/endpoint rather than shipping a 500 to judges |
| 6 | If not fixed in 15 minutes → point the frontend at a stable deploy, or run both locally |
| 7 | Never deploy a version that has not passed the demo path |

**Disabling a broken feature is always better than shipping a broken one.** If a screen is broken,
remove it from navigation rather than showing an error to judges.

---

## 5. FRONTEND CANNOT CONNECT TO BACKEND

| Check | Command / action |
|---|---|
| Is the backend running? | `curl http://localhost:8000/api/v1/health` |
| Is the URL right? | `NEXT_PUBLIC_API_BASE_URL` / production env var |
| CORS? | Browser console → look for a CORS error; backend must allow the frontend origin |
| Wrong origin? | The deployed frontend origin must be listed in the backend CORS config |
| Mixed content? | An HTTPS page calling an HTTP backend is blocked — use HTTPS for both |
| Build-time variable? | Most Next.js vars are baked in at build time — rebuild after changing the URL |

**Fallback order:** fix the URL/CORS → rebuild → redeploy frontend → as a last resort serve the
frontend from the same origin as the backend (proxy).

**Last resort:** deploy the frontend as a static build pointing at a working backend URL, and
document the exact setup in the submission.

---

## 6. DEPLOYMENT FAILS

| Step | Action |
|---|---|
| 1 | Read the platform error message carefully |
| 2 | Check: build command, output directory, env vars, port binding, start command |
| 3 | Check the logs, not just the error banner |
| 4 | Try the previous known-good deploy |
| 5 | If the platform is down: run locally and expose the port, or share a screen recording as the demo |
| 6 | **Record it honestly** in the submission if the demo link is degraded |

**Never spend more than 30 minutes on a deploy failure.** Switch to the fallback and submit.

---

## 7. DATABASE FAILS (corrupt, missing, empty)

| Step | Action |
|---|---|
| 1 | Delete the DB file and re-run the deterministic seed script |
| 2 | Verify counts (workflows, steps, events, policies, decisions) |
| 3 | If the seeder is broken: keep a checked-in copy of the generated dataset and load it directly |
| 4 | If neither works: the demo cannot use real data → fall back to fixtures and **disclose it** |
| 5 | Never hand-edit DB rows to make the demo look good. That is fabricated data. |

**Prevention:** the seed must be deterministic and one command. Verify this at PHASE 1.

---

## 8. ONE DEVELOPER IS BLOCKED

| Situation | Response |
|---|---|
| Blocked < 15 min | Continue on other tasks; say so at the next update |
| Blocked > 15 min | Announce it. The team reassigns the blocked task |
| Provider key unavailable | Switch to a different provider immediately — this is a blocking risk |
| Machine/deployment issues | Another developer takes over the deploy |
| Knowledge gap in an area | The other two pair on it for 15 minutes, then simplify the approach |
| Personal emergency | The team re-scopes immediately: cut P1/P2, protect the P0 demo path |

**Nobody grinds silently.** A silent blocker costs more time than the blocker itself.

---

## 9. INTEGRATION CAUSES A REGRESSION

| Step | Action |
|---|---|
| 1 | Identify when it broke (which change) |
| 2 | Revert that specific change — **do not** try to fix forward under time pressure |
| 3 | If the revert loses a feature, the feature is cut; the working slice is protected |
| 4 | Re-run the 13-step path immediately |
| 5 | Record the regression in `TEST_CASES.md` |

**Rule:** after the 12:30 checkpoint, **no refactors**. Most late regressions come from
"improvements" made while integrating.

---

## 10. TIME IS CRITICALLY LOW

### The 60-minute emergency cut

If you are at T-60 and the demo does not work end to end:

1. **Cut to the absolute minimum vertical slice:** Dashboard → Purchase Request workflow →
   timeline → Step Intelligence → "Why does this step exist?" + evidence → Automation Analysis →
   Run → approval → PO → Results.
2. Remove every screen, endpoint, and component not on that path.
3. Reduce the dataset if it slows startup (fewer events, same structure).
4. Pre-compute/cache every AI response for the demo workflow.
5. Disable anything that can fail at runtime (animations, polling, non-essential fetches).
6. Record a fresh video once it works — do not submit a video of a different version.

### The last-resort product (only if everything else is broken)

A single-page walkthrough using **cached, disclosed** AI responses and the real backend for
execution. It is still a working Hososhi demo — it is just not fully live. Disclose it.

---

## 11. NEVER DO THESE, NO MATTER THE PRESSURE

| ❌ Forbidden | Why |
|---|---|
| Fabricate a performance number | Destroys credibility if caught; judges check |
| Invent evidence that isn't in the dataset | Same |
| State a provider limit from memory | Usually wrong, and it is a factual claim |
| Claim a metric "was measured" when it was estimated | Unethical |
| Describe a third-party component as custom-built | Unethical and easily checked |
| Leave fixture mode on for judges without disclosure | Misrepresentation |
| Hide a fallback/mock from the submission | Misrepresentation |
| Claim a capability that was not demonstrated | Will be caught in Q&A |
| Spend the last hour on styling instead of fixing the demo | Bad trade |

---

## 12. EMERGENCY CONTACT SHEET (fill in at PHASE 0)

| Item | Value |
|---|---|
| Submission portal URL | |
| Submission deadline (hard) | |
| Deploy platform + project | |
| Deploy command / dashboard | |
| Backend deploy logs URL | |
| Frontend deploy logs URL | |
| Repo URL (human-managed) | |
| Demo URL | |
| Primary AI provider + key env var name | |
| Fallback AI provider + key env var name | |
| Who can redeploy | |
| Who can submit the form | |

**Fill this table in at PHASE 0 and keep it visible for the whole day.**
At 19:00 nobody should be searching for a URL.