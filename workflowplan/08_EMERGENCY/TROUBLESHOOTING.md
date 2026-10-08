# TROUBLESHOOTING — UNDER PRESSURE CHECKLISTS

Short, scannable, ordered. Use top to bottom. Do not skip to random ideas.

**Universal first 60 seconds:**

```
1. What exactly fails?  → exact error message + status code + which step
2. Where?               → frontend / backend / AI / DB / integration / deploy
3. Reproduce?           → curl the endpoint, or reload the page
4. Worked before?       → if yes: what changed? if no: is it on the demo path?
```

**If it is not on the 13-step demo path, it does not get fixed right now.** Log it as a limitation.

---

# FRONTEND

| Symptom | Check | Fix |
|---|---|---|
| Page is blank | Browser console → first error | Usually a runtime error from `undefined` data; check the API response shape |
| Page is blank, no console error | Network tab → did any request fire? | Base URL missing or the component never fetched |
| `undefined` in a rendered field | Network tab → actual response | Field-name mismatch with the contract — report to D1/D2, do not paper over it with `?.` everywhere |
| Data never loads | DevTools Network → request URL | `NEXT_PUBLIC_API_BASE_URL` wrong, or not set at **build** time |
| Change to base URL has no effect | — | Most Next.js vars are inlined at build → rebuild |
| Loading spinner forever | Network tab → request pending | Backend down, or the request never resolves → check backend health |
| Error state not showing | — | Non-2xx responses are not being checked — check status codes in the client |
| "not measured" shows as 0 | — | `null` coerced to 0 by `Number(x) || 0`. Guard null explicitly |
| Layout breaks at 768px | Resize | Missing responsive rules; fix only if the demo laptop needs it |
| Fonts/icons missing | Network tab → 404s | Asset path wrong, or asset was never delivered — use a neutral placeholder and report |
| Hydration error | Console | Server and client rendered different values (e.g. `Date.now()` or `Math.random()` at render) |
| Buttons fire twice | Network tab → two requests | Missing in-flight disable; add a pending flag |
| Polling floods the backend | Network tab → many requests | Interval too short; 1–2 s is enough |

---

# BACKEND

| Symptom | Check | Fix |
|---|---|---|
| Server won't start | Terminal error | Missing env var, missing dependency, wrong working directory |
| `ModuleNotFoundError` | — | Activate the venv; reinstall from `requirements.txt` |
| DB error on startup | — | DB file path wrong or unwritable; delete and re-seed |
| Endpoint 404 | Path | Check the `/api/v1` prefix and the exact route string |
| Endpoint 500 | Server log | Read the traceback **in the log**, not the response |
| Response shape is wrong | Compare with `schemas.py` | The contract is frozen — fix the backend, do not change the contract silently |
| Works locally, not on the server | Env vars | Missing production env var (keys, CORS origin, DB path) |
| 409 `INVALID_STATE_TRANSITION` | Which transition | Working as designed — inspect the run's current state before retrying |
| Approval does nothing | Run state | The approval may already be decided; re-fetch `GET /runs/{id}` |
| Duplicate runs created | DB | Missing idempotency check — dedupe on `request_id` |
| Slow response | Where is the time spent | Likely the AI call — it does not belong in a synchronous core endpoint |
| Test suite fails | Which test | Fix the test if the test is wrong; fix the code if the code is wrong — never delete a test to make it green |

---

# API

| Symptom | Check | Fix |
|---|---|---|
| CORS error in console | Response headers | Backend must allow the exact frontend origin (scheme + host + port) |
| CORS passes locally, fails deployed | Origins | The deployed origin is different — add it explicitly |
| Mixed content blocked | — | HTTPS page calling HTTP API → use HTTPS everywhere |
| 401/403 where none was expected | — | No auth is implemented; check for a stray proxy/host rule |
| 422 from an AI endpoint | Response body | `AI_OUTPUT_INVALID` — expected behaviour, the schema rejected the output |
| 429 | Response body | `RATE_LIMITED` — back off and use the fallback provider / cache |
| Error body shape is wrong | — | Must be `{"error":{"code","message","retryable","request_id"}}` |
| `request_id` missing | — | Add it — it is what makes a demo failure debuggable |
| Endpoint works with curl, fails from the browser | Headers | CORS preflight, or a header the browser blocks |
| Intermittent failures | Repeat 20× | Look for a race in run/approval state handling |

**Fast check loop:**
```bash
curl -i http://localhost:8000/api/v1/health
curl -i http://localhost:8000/api/v1/workflows
curl -s http://localhost:8000/api/v1/workflows | head -c 400
```

---

# AI

| Symptom | Check | Fix |
|---|---|---|
| 401/403 from the provider | Key + env var name | Key missing, wrong, or not loaded in the environment |
| Timeout | Time taken | Reduce timeout, add retry, use the fallback provider; never let the UI hang |
| Rate limited | Status + provider docs | Back off, retry once, switch provider. **Never quote limits from memory** |
| Malformed JSON | Raw response | Repair path → retry once → `AI_OUTPUT_INVALID`. Never pass it through |
| Wrong schema | Validation error | Fix the prompt's schema description; do not loosen the schema to make it pass |
| Hallucinated evidence id | Compare ids against the DB | Add/strengthen the grounding instruction; add a post-check that validates ids |
| Ignores the provided context | Prompt | Strengthen "use only the provided context" + "return insufficient_context instead of guessing" |
| Inconsistent answers across runs | Repeat 10× | Expected to some degree — record the real consistency rate; do not hide it |
| Prompt is enormous | Token/char count | You are sending too much context — tighten the retrieval cap |
| Model says SAFE on an irreversible step | Classification | Safety override must force the correct class regardless of the model |
| Everything slow | Time per call | Cache demo responses; consider a faster provider if the benchmark showed one |

---

# DATABASE

| Symptom | Check | Fix |
|---|---|---|
| Table missing | Tables present | Run create_all / re-seed |
| DB empty after start | Row counts | Re-run the seed script |
| Wrong data | Seed version | Deterministic seed → identical output. If not, the seeder is not deterministic |
| Seeder produces different data each run | — | Missing fixed random seed |
| DB file locked | Processes | Another process holds it; kill the old process |
| Cannot write DB | Path/permissions | Wrong working directory or read-only mount |
| Data looks unrealistic | Values | Check the generator's ranges; realistic data is what makes discovery credible |
| Migration blew up | — | For a hackathon: delete the DB and re-seed. Do not build a migration history now |

---

# INTEGRATION

| Symptom | Check | Fix |
|---|---|---|
| Frontend field is `undefined` | Both sides | Compare the actual response with the frontend type — name the exact field |
| Status text differs | Both sides | `completed` vs `COMPLETED` etc. — pick one vocabulary and align |
| Enum mismatch | Both sides | `SAFE` / `SAFE_TO_AUTOMATE` — agree on the wire format and change it on **both** sides |
| Workflow loads, intelligence fails | AI layer | Partial state is expected — verify the UI handles it gracefully |
| Run stops early | Run object | Check the automation class of the step it stopped at — likely `HUMAN REQUIRED` (correct) |
| Run does not stop | — | **Critical bug.** The class is not being enforced server-side |
| Approve succeeds, PO not created | DB + run state | PO step condition or ordering bug |
| Double PO created | DB | Duplicate execution — idempotency bug on the PO step |
| Results empty | Runs count | No completed run yet, or metrics not persisted |
| Regression after a fix | Recent changes | Revert the last change; never fix forward under time pressure |
| Works in fixtures, not live | Network tab | Shape mismatch — fixtures are not the source of truth |

---

# DEPLOYMENT

| Symptom | Check | Fix |
|---|---|---|
| Build fails | Build log | Fix the build; a failed build cannot ship |
| App starts, 404 on all routes | Start command / output dir | Wrong entry point or wrong static output directory |
| Env var missing at runtime | Platform settings | Add it; many platforms inject at runtime — restart after changing |
| Works locally, 500 on deploy | Runtime log | Missing dependency, wrong Python version, or an absolute local path |
| Frontend loads, API calls fail | CORS + URL | Origin not allowed, or the API URL is the local one |
| Data missing on the deployed instance | DB | Seed the production DB explicitly |
| Deploy succeeded, site is old | Cache | Hard reload / incognito; check the build actually re-ran |
| Platform error page | Platform logs | Read the full log, not the banner |
| Platform is down | — | Use the fallback: local run, or the recorded demo. Document it |
| Redeploy makes it worse | — | Roll back to the last known-good deploy immediately |

---

# THREE-MINUTE "IS IT THE DEMO PATH?" CHECK

Before debugging anything, answer these:

```
[ ] Does Dashboard load?
[ ] Does Purchase Request Processing open?
[ ] Does the timeline show 7 steps?
[ ] Does Step Intelligence open?
[ ] Does "Why does this step exist?" show with evidence?
[ ] Does Automation Analysis show three classes?
[ ] Does the run start and stop at approval?
[ ] Does Approve complete it?
[ ] Is the PO created?
[ ] Do Results show real numbers?
```

**If 9–10 pass:** the demo works. The bug is elsewhere → log it as a limitation, move on.
**If fewer than 9 pass:** you are in emergency mode → `08_EMERGENCY/FALLBACK_PLAN.md` §10.

---

# ESCALATION

| When | Who | Action |
|---|---|---|
| Blocked < 15 min | — | Continue other work |
| Blocked > 15 min | The team | Announce, reassign |
| Critical, demo path broken | Everyone, one leader | Enter emergency mode, apply the fallback |
| Provider key lost | Whoever holds credentials | Switch provider immediately (if before 15:50) or use the cache (after) |
| Time below 30 min and the path is broken | Everyone | Ship the smallest working slice. Cut everything else. |

---

**Remember:** a working prototype with honest limitations beats a broken one with good slides.
Record every problem you did not fix as a known limitation — that is a strength in the
submission, not a weakness.