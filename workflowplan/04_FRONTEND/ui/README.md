# UI ASSETS — DESIGN HANDOFF

This folder is the handoff point between the designer and the frontend developer (Developer 3).
Keep it simple. It exists so that a developer can look in here and immediately know **which image
is which screen**, **whether it is a reference or a final design**, and **what to do with it**.

---

## 1. FOLDER STRUCTURE

```
04_FRONTEND/ui/
├── README.md          ← you are reading it
├── screens/           ← full-page designs, one file per screen
├── components/        ← component-level designs (cards, badges, tables, timeline node…)
├── references/        ← mood boards, inspiration, competitor screenshots — NOT specs
└── assets/            ← logos, icons, fonts, images to copy into the app
```

**Do not build an asset pipeline, manifest, or asset system.** Filenames and this README are the
whole system.

---

## 2. NAMING CONVENTION

```
NN-<screen-or-component-name>.png
```

| Part | Rule | Example |
|---|---|---|
| `NN` | Two digits = screen number (01–06) or `c1`, `c2`… for components | `03` |
| name | lowercase, hyphen-separated, matching the product's screen name | `step-intelligence` |
| variant | optional suffix | `-desktop`, `-mobile`, `-dark`, `-variant-b` |
| status | optional suffix, only if it matters | `-final`, `-ref` |

**Examples**

```
screens/01-dashboard-desktop.png
screens/02-workflow-detail-desktop.png
screens/03-step-intelligence-desktop.png
screens/04-automation-analysis-desktop.png
screens/05-automation-run-desktop.png
screens/06-results-desktop.png
screens/03-step-intelligence-mobile.png
components/c1-step-card.png
components/c2-evidence-item.png
components/c3-class-badge-safe.png
components/c4-class-badge-human-review.png
components/c5-class-badge-human-required.png
references/moodboard-enterprise-clean.png
assets/logo-hososhi.svg
assets/icon-timeline-node.svg
```

---

## 3. HOW TO IDENTIFY WHAT A FILE IS

Read the filename first, then open the file. The rules:

| Question | How to answer it |
|---|---|
| **Is it a screen or a component?** | `screens/` = screen · `components/` = component · `references/` = neither |
| **Which screen?** | `NN-` prefix = screen number (see §5) |
| **Is it a reference or a final design?** | `references/` folder = reference. In `screens/`, a `-ref` suffix = reference; no suffix or `-final` = design intent to implement |
| **Desktop or mobile?** | `-desktop` / `-mobile` suffix. If absent, assume desktop |
| **Which state does it show?** | Look at the image. If a state is not covered by a design, follow the existing visual language and note the gap |

---

## 4. HOW THE FRONTEND DEVELOPER SHOULD USE EACH FILE

1. Open `screens/` **first**, before writing any component. Understand the whole product's visual
   language before building one screen.
2. Match layout, spacing, typography scale, colour usage and density.
3. Where a component is reused across screens, prefer `components/` as the source of truth.
4. Copy assets from `assets/` into the app. **Do not hotlink.** Do not invent artwork — no
   AI-generated images, no random stock.
5. **When the screenshot and a working implementation conflict, the working implementation wins.**
   Report the difference to the team; do not silently diverge from the design.
6. If an asset you need is missing, use a neutral placeholder, note it in your status report, and
   move on. Do not spend more than 10 minutes hunting for one.

---

## 5. THE SIX SCREENS (MVP)

All six are MVP. If a design is missing for one, build it from the product's visual language and
report the gap.

| # | Screen | Name in filenames | MVP? |
|---|---|---|---|
| 1 | Dashboard | `01-dashboard-*` | **Yes** |
| 2 | Workflow Detail (timeline) | `02-workflow-detail-*` | **Yes** |
| 3 | Step Intelligence (includes "Why does this step exist?" + evidence) | `03-step-intelligence-*` | **Yes** |
| 4 | Automation Analysis (SAFE / HUMAN REVIEW / HUMAN REQUIRED) | `04-automation-analysis-*` | **Yes** |
| 5 | Automation Run (progress + human approval) | `05-automation-run-*` | **Yes** |
| 6 | Results (baseline vs AI-assisted) | `06-results-*` | **Yes** |

**Non-MVP / optional designs** (P1–P3): settings, login, profile, reports, admin, notifications,
onboarding. Do not build them unless the team explicitly promotes them.

---

## 6. STATES THAT MUST EXIST (design or not)

Every screen needs these four states. If the designer provides a design for one of them, it
overrides the defaults below.

| State | Default behaviour if no design exists |
|---|---|
| **Loading** | Skeleton blocks matching the final layout's shape. Especially important on Step Intelligence — the AI call may take a few seconds. |
| **Error** | Plain, readable message + a "Retry" action. If the API returns `request_id`, show it small and muted. No red-alert shouting. |
| **Empty** | A real sentence, e.g. "No evidence found for this step." Never an empty container. |
| **Partial** | If the workflow loaded but the AI explanation failed, show the workflow and the AI error locally — do not blank the page. |

Also required:

- **Automation class badges**: three visually distinct treatments, **each with a text label**
  (`SAFE`, `HUMAN REVIEW`, `HUMAN REQUIRED`). Not colour-only — it must survive a projector and a
  colour-blind viewer.
- **Automation run progress**: completed (`✓`), waiting (`⏸`), pending, and the human approval
  prompt with **Approve / Reject**.
- **Approval feedback**: an approved run and a rejected run must look clearly different.
- **Results with no data**: "not measured" text. Never a zero, never a placeholder number.

---

## 7. RESPONSIVE CONSIDERATIONS

- **Desktop first.** The demo runs on one laptop; design for ~1280px width.
- **Minimum usable at 768px.** Stack columns, keep the timeline vertical, keep buttons reachable.
- The workflow timeline must remain readable vertically on narrow screens — do not let it scroll
  horizontally.
- Evidence lists stack into a single column below ~900px.
- Touch targets for Approve / Reject should be comfortably large — this is a human-in-the-loop
  moment and it should feel deliberate, not twitchy.

---

## 8. DESIGN LANGUAGE RULES (what to reject if a design violates them)

Hososhi must look enterprise-grade and trustworthy.

| Do | Do not |
|---|---|
| Use restrained, professional colour | Neon, cyberpunk, "AI magic" gradients |
| Use whitespace and clear hierarchy | Glowing borders, pulsing "AI thinking" animations |
| Show data and evidence prominently | Robot icons, brain icons, sparkles as decoration |
| Use typography and layout for structure | Futuristic display fonts |
| Be explicit that a human decides | Make automation look like magic |

The one place a bit of emphasis is appropriate is the **human approval** step — it should look
like the most important moment in the product, because it is.

---

## 9. IF YOU ARE THE DESIGNER, ADDING FILES

- Drop the file in the right folder (`screens/`, `components/`, `assets/`, `references/`).
- Name it per §2.
- Do not delete existing files; add a version suffix instead (`-v2`, `-final`).
- Nothing else is required. No manifest, no JSON, no tool.

---

## 10. HANDOFF CHECKLIST (frontend developer)

- [ ] Opened every file in `screens/` before writing components
- [ ] Confirmed which screens have designs and which do not
- [ ] Copied needed assets into the app from `assets/`
- [ ] Noted any design/implementation conflicts and reported them
- [ ] Confirmed loading / error / empty / partial states exist on all six screens
- [ ] Confirmed the three automation classes are text-labelled, not colour-only
- [ ] Confirmed "not measured" appears wherever metrics are `null`