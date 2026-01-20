# 🎯 Google Conductor Workflow

**Last Updated:** 2026-01-05

This document defines our development workflow based on Google's Conductor methodology: clear planning, focused execution, thorough verification.

---

## 📋 Core Principles

1. **Plan Before You Build** - Never code without a clear plan
2. **Single Source of Truth** - One active task at a time
3. **Explicit State Transitions** - Clear handoffs between phases
4. **Verification Required** - Test before declaring complete
5. **Continuous Documentation** - Capture decisions as you go

---

## 🔄 Three-Phase Workflow

### Phase 1: PLANNING 🧠

**When:** Starting new features or major changes

**AI Actions:**
1. Read and understand user request
2. Research codebase (grep, view files, check dependencies)
3. Create `planning.md` artifact with:
   - Problem statement
   - Proposed solution
   - Files to modify
   - Risks and unknowns
   - Success criteria
4. Request user approval

**Output:** `planning.md` ← User reviews and approves

**Handoff:** Once approved → Transition to EXECUTION

---

### Phase 2: EXECUTION ⚙️

**When:** Plan is approved, ready to code

**AI Actions:**
1. Create `task.md` checklist from approved plan
2. Work through checklist systematically
3. Update `task.md` as items complete
4. Make code changes
5. Document unexpected issues in `decisions.md`

**Output:** 
- Code changes
- `task.md` with progress tracking
- `decisions.md` for significant choices

**Handoff:** All checklist items complete → Transition to VERIFICATION

---

### Phase 3: VERIFICATION ✅

**When:** Code complete, need to validate

**AI Actions:**
1. Run tests (if exist)
2. Check for TypeScript/lint errors
3. Verify builds successfully
4. Test core user flows (via guidance or browser automation)
5. Create `verification_report.md` with:
   - What was tested
   - What passed/failed
   - Screenshots/evidence
   - Known issues
6. Request user sign-off

**Output:** `verification_report.md` ← User reviews results

**Handoff:** Verified → Archive artifacts, mark complete

---

## 📁 Artifact Structure

**Active Work (in brain/):**
```
/home/leskyjo/.gemini/antigravity/brain/[conversation-id]/
├── planning.md              # Phase 1: Solution design
├── task.md                  # Phase 2: Execution checklist
├── decisions.md             # Phase 2: Why we chose X over Y
└── verification_report.md   # Phase 3: Test results
```

**Project Docs (in repo):**
```
/home/leskyjo/Documents/FE WebApp/web-app-antigravity-2/
├── START_HERE.md            # Entry point
├── WORKFLOW.md              # This file
└── docs/
    ├── specs/               # Feature specifications
    ├── decisions/           # Archived ADRs
    └── testing/             # Test plans
```

---

## 🎬 Example: Building a New Feature

### User Request:
"Add a dark mode toggle to the app"

---

### Phase 1: PLANNING

**AI creates `planning.md`:**

```markdown
# Feature: Dark Mode Toggle

## Problem
Users want ability to switch between light/dark themes

## Proposed Solution
1. Add theme context provider
2. Store preference in localStorage
3. Create toggle component in navbar
4. Update CSS variables

## Files to Modify
- `app/layout.tsx` - Add ThemeProvider
- `components/navbar.tsx` - Add toggle
- `globals.css` - Add dark mode variables

## Risks
- May conflict with existing glass/cyber theme
- Need to test all 50+ components

## Success Criteria
- Toggle works
- Preference persists
- No visual regressions
```

**User:** "Approved, but use Zustand not Context"

**AI updates plan** → NOW move to EXECUTION

---

### Phase 2: EXECUTION

**AI creates `task.md`:**

```markdown
# Task: Implement Dark Mode

## Checklist
- [ ] Install Zustand
- [ ] Create theme store
- [ ] Add toggle to navbar
- [ ] Update CSS variables
- [ ] Test all pages
```

**AI works through checklist, updating as it goes:**

```markdown
- [x] Install Zustand
- [x] Create theme store
- [/] Add toggle to navbar  ← Currently working
- [ ] Update CSS variables
- [ ] Test all pages
```

**AI encounters decision:**
Creates `decisions.md`:

```markdown
# Decision: Theme Toggle Placement

**Decision:** Placed toggle in navbar-right next to user menu

**Why:** 
- Most discoverable location
- Consistent with other apps (GitHub, Twitter)

**Alternatives Considered:**
- Settings page: Too buried
- Footer: Not visible enough
```

**All items complete** → Move to VERIFICATION

---

### Phase 3: VERIFICATION

**AI creates `verification_report.md`:**

```markdown
# Verification: Dark Mode Feature

## Tests Performed

### ✅ Functional Tests
- Toggle switches themes: PASS
- Preference persists on reload: PASS
- Works while logged out: PASS

### ✅ Visual Tests
- Checked 15 key pages
- All cyber-red highlights visible in dark mode
- Glass effects work correctly

### ⚠️ Known Issues
- Settings page: slight contrast issue on dark cards
  (Filed as minor bug, not blocking)

## Screenshots
[dark_mode_toggle.png]
[dashboard_dark.png]

## Recommendation
✅ READY TO MERGE - One minor CSS tweak needed
```

**User reviews:** "Looks good, merge it!"

**AI archives artifacts** → COMPLETE

---

## 🚦 State Transitions

```
USER REQUEST
     ↓
  PLANNING ──→ (user approves) ──→ EXECUTION
                                       ↓
                               (checklist done)
                                       ↓
                                 VERIFICATION ──→ (tests pass) ──→ COMPLETE
                                       ↓
                                  (tests fail)
                                       ↓
                             ← Back to EXECUTION (fix bugs)
```

---

## 📝 Artifact Templates

### planning.md Template

```markdown
# [Feature Name]

## Problem Statement
[What user need are we solving?]

## Proposed Solution
[High-level approach]

## Implementation Plan
1. [Step 1]
2. [Step 2]
...

## Files to Modify
- `path/to/file.ts` - [What changes]
- `path/to/other.tsx` - [What changes]

## Dependencies
- [ ] Install X package?
- [ ] Database migration needed?

## Risks & Unknowns
- [What could go wrong?]
- [What don't we know yet?]

## Success Criteria
- [ ] [Specific, testable outcome]
- [ ] [Another outcome]

## Estimated Complexity
[Low / Medium / High - why?]
```

---

### task.md Template

```markdown
# Task: [Feature Name]

**Status:** In Progress  
**Phase:** EXECUTION

## Checklist

### Setup
- [ ] Install dependencies
- [ ] Create database migrations

### Implementation
- [ ] File 1 changes
- [ ] File 2 changes
- [ ] File 3 changes

### Testing
- [ ] Unit tests
- [ ] Manual testing

## Progress Notes
- [Timestamp] - Started implementation
- [Timestamp] - Encountered issue with X, solved by Y
- [Timestamp] - Complete, moving to verification
```

---

### decisions.md Template

```markdown
# Decisions Log

## Decision: [Title]
**Date:** [Date]  
**Context:** [Why did we need to decide?]

**Decision:** [What we chose]

**Rationale:**
- [Reason 1]
- [Reason 2]

**Alternatives Considered:**
- Option A: [Why not this]
- Option B: [Why not this]

**Consequences:**
- ✅ Benefit 1
- ⚠️ Trade-off 1
```

---

### verification_report.md Template

```markdown
# Verification Report: [Feature Name]

**Date:** [Date]  
**Tested By:** AI + User

## Test Results

### Functional Tests
- [ ] [Test case 1]: PASS/FAIL
- [ ] [Test case 2]: PASS/FAIL

### Build & Lint
- [ ] TypeScript: PASS/FAIL
- [ ] Build: PASS/FAIL

### Visual/Manual Tests
- [ ] [User flow 1]: PASS/FAIL
- [ ] [User flow 2]: PASS/FAIL

## Evidence
[Screenshots, terminal output, etc.]

## Issues Found
- **Blocker:** [Critical bugs]
- **Minor:** [Non-critical issues]
- **Future:** [Nice-to-haves]

## Recommendation
✅ READY / ⚠️ NEEDS FIXES / ❌ MAJOR REWORK REQUIRED

[Explanation]
```

---

## 🤝 AI-Human Collaboration

### What AI Does
- ✅ Research code, propose solutions
- ✅ Execute implementation
- ✅ Run automated tests
- ✅ Document decisions
- ✅ Create artifacts

### What User Does
- ✅ Approve/reject plans
- ✅ Make strategic decisions
- ✅ Final verification
- ✅ Provide domain expertise

### Clear Handoffs
- 🛑 AI STOPS at end of each phase
- 🔔 AI notifies user for review
- ✅ User approves → AI proceeds
- 🔄 User requests changes → AI updates and re-submits

---

## ⚡ Quick Reference

**Starting Work:**
```
User: "Build X feature"
AI: Creates planning.md → Requests approval
User: Approves
AI: Creates task.md → Executes → Creates verification_report.md
User: Reviews → Approves
AI: Archives → Complete
```

**Mid-Work:**
```
User: "How's it going?"
AI: Shows task.md checklist with [x] completed, [/] in-progress, [ ] todo
```

**Stuck:**
```
AI: Adds decision to decisions.md with options
AI: Asks user "Should I use A or B?"
User: Picks B
AI: Updates decision, continues
```

---

## 🎯 Benefits of This System

1. **Clarity:** Always know what phase you're in
2. **Transparency:** User can review plan before costly execution
3. **Traceability:** decisions.md captures "why" for future reference
4. **Quality:** Explicit verification step catches issues
5. **Efficiency:** No wasted work on wrong approach

---

## 🔧 Integration with Existing Tools

- **task_boundary tool:** Use at phase transitions
  - PLANNING mode for research/design
  - EXECUTION mode for coding
  - VERIFICATION mode for testing

- **notify_user tool:** Required at phase handoffs
  - Planning → get approval
  - Execution issues → ask questions
  - Verification → get sign-off

---

**Next:** When AI starts working, it will:
1. Read this workflow document
2. Determine which phase is appropriate
3. Create the relevant artifact
4. Follow the process systematically
