# HOSOSHI — EXECUTION PLANNING PACKAGE

Planning package for the Hososhi hackathon (AI Enterprise Solutions track), **9 October 2026**.
**This folder contains plans only — no product code, no Git repository, no commits.**

| Anchor | Time (Baku) |
|---|---|
| Development ends | 16:50 |
| **Release / freeze mode begins** | **17:00** |
| **Official freeze** | **20:00** |

---

## START HERE

| You are… | Open this, in this order |
|---|---|
| **Anyone, first thing in the morning** | `00_MASTER_PLAN.md` → §1 (project) → §4 (MVP + demo path) → §5 (PHASE 0) |
| **Developer 1 — Backend/Core** | `02_BACKEND_CORE/MASTER_PROMPT.md` (paste into OpenCode) → `02_BACKEND_CORE/TASKS.md` |
| **Developer 2 — Backend/AI** | `03_BACKEND_AI/MASTER_PROMPT.md` (paste into OpenCode) → `03_BACKEND_AI/TASKS.md` |
| **Developer 3 — Frontend** | `04_FRONTEND/ui/README.md` (design handoff) → `04_FRONTEND/MASTER_PROMPT.md` → `04_FRONTEND/TASKS.md` |
| **The whole team from 14:15** | `05_INTEGRATION_QA/MASTER_PROMPT.md` |
| **From 16:20** | `06_TESTING/TEST_PLAN.md` + `06_TESTING/TEST_CASES.md` |
| **From 17:00** | `07_RELEASE/RELEASE_CHECKLIST.md` (T-180 → T-0) |
| **Anything goes wrong** | `08_EMERGENCY/FALLBACK_PLAN.md` → `08_EMERGENCY/TROUBLESHOOTING.md` |
| **A new AI assistant takes over** | `01_GEMINI_HANDOVER_MASTER_PROMPT.md` — the full project context in one document |

---

## CONTENTS

```
workflowplan/
├── 00_MASTER_PLAN.md                    phases 0–9, timeline, priorities, MVP, cut order
├── 01_GEMINI_HANDOVER_MASTER_PROMPT.md  full context handover for a new AI assistant
├── 02_BACKEND_CORE/
│   ├── TASKS.md                         D1 task list with priorities and acceptance criteria
│   └── MASTER_PROMPT.md                 D1 prompt to paste into OpenCode
├── 03_BACKEND_AI/
│   ├── TASKS.md                         D2 task list
│   └── MASTER_PROMPT.md                 D2 prompt to paste into OpenCode
├── 04_FRONTEND/
│   ├── TASKS.md                         D3 task list
│   ├── MASTER_PROMPT.md                 D3 prompt to paste into OpenCode
│   └── ui/
│       ├── README.md                    design handoff: naming, states, MVP screens
│       ├── screens/                     full-page designs  (NN-<screen-name>.png)
│       ├── components/                  component designs
│       ├── references/                  inspiration only — not specs
│       └── assets/                      logos, icons, fonts, images
├── 05_INTEGRATION_QA/
│   └── MASTER_PROMPT.md                 integration, E2E, deployment, submission
├── 06_TESTING/
│   ├── TEST_PLAN.md                     testing philosophy, layers, dimensions
│   └── TEST_CASES.md                    TEST-001…008 + safety/API/AI/FE/E2E cases to fill in
├── 07_RELEASE/
│   └── RELEASE_CHECKLIST.md             T-180 → T-0 protected freeze window
└── 08_EMERGENCY/
    ├── FALLBACK_PLAN.md                 what to do when things break
    └── TROUBLESHOOTING.md               under-pressure debugging checklists
```

---

## THE DEMO PATH — THE ONE THING THAT MATTERS

```
Dashboard → Purchase Request Processing → timeline → Step Intelligence
  → "Why does this step exist?" → evidence
    → Automation Analysis (SAFE / HUMAN REVIEW / HUMAN REQUIRED)
      → Automation Run → stops at Human Approval → Approve → PO created
        → Results (measured baseline vs AI-assisted)
```

13 steps. Everything in this package exists to make these 13 steps work.

---

## FIVE RULES THAT NEVER BEND

1. **Never fabricate a metric.** Unmeasured → `null` → the UI shows "not measured".
2. **Never invent provider limits, pricing, context windows or model capabilities.** Verify from
   official documentation or omit.
3. **Human judgment stays under human control.** The backend enforces approval; the frontend only
   reflects it.
4. **The dataset is synthetic.** Disclose it in the submission.
5. **No Git operations by AI agents.** The humans handle all Git.

---

## AT 17:00

Release mode begins. No features, no refactors, no new dependencies. Follow
`07_RELEASE/RELEASE_CHECKLIST.md` from T-180 to T-0 and stop all edits at 20:00.