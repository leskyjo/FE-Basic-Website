# 🎯 START HERE - Felon Entrepreneur

**Read this first every session**

---

## 🚀 Quick Start

**To begin work:**
1. Say: **"Let's use the new workflow"**
2. AI reads: `WORKFLOW.md` → Understands process
3. AI determines phase: PLANNING / EXECUTION / VERIFICATION
4. AI creates appropriate artifact and proceeds

---

## 📋 New Workflow System

We now use **Google Conductor-style workflow** with 3 clear phases:

### Phase 1: PLANNING 🧠
- AI researches your request
- Creates `planning.md` with proposed solution
- **YOU review and approve**
- AI does NOT code without approval

### Phase 2: EXECUTION ⚙️
- AI creates `task.md` checklist
- Codes systematically
- Updates progress
- Documents decisions in `decisions.md`

### Phase 3: VERIFICATION ✅
- AI tests the changes
- Creates `verification_report.md`
- **YOU review test results**
- Approve or request fixes

**See:** [`WORKFLOW.md`](file:///home/leskyjo/Documents/FE%20WebApp/web-app-antigravity-2/WORKFLOW.md) for full details

---

## 📁 Project Structure

```
/home/leskyjo/Documents/FE WebApp/web-app-antigravity-2/
├── START_HERE.md           ← You are here
├── WORKFLOW.md             ← How we work (read this!)
├── PRODUCT_VISION.md       ← What we're building
│
├── app/                    ← Next.js application
├── components/             ← React components
├── lib/                    ← Utilities & helpers
├── supabase/              ← Database schemas
│
└── docs/
    ├── specs/              ← Feature specifications
    ├── decisions/          ← Architecture decisions
    └── testing/            ← Test plans
```

**Artifacts (per conversation):**
```
/home/leskyjo/.gemini/antigravity/brain/[conversation-id]/
├── planning.md             ← Phase 1 output
├── task.md                 ← Phase 2 checklist
├── decisions.md            ← Important choices
└── verification_report.md  ← Phase 3 results
```

---

## 🎯 Current Status

**Project:** Felon Entrepreneur (FE) Web App  
**Tech Stack:** Next.js 15, Supabase, TypeScript, Tailwind CSS  
**Workflow:** Google Conductor (3 phases)

**Latest Work:**
- Path-specific questionnaires (entrepreneur vs professional)
- Tier system (Starter/Trial/Plus/Pro)
- FE Coach AI integration
- Life Plan generation

---

## 🔧 Development Environment

```bash
# Start Supabase
supabase start

# Start Next.js dev server
npm run dev
# Access: http://localhost:3001

# Supabase Studio UI
# http://localhost:54323
```

**Environment Files:**
- `.env.local` - Local dev secrets (Supabase, OpenAI)
- `.env.example` - Template for new developers

---

## 📖 Key Documents

**Must-Read:**
- [`WORKFLOW.md`](file:///home/leskyjo/Documents/FE%20WebApp/web-app-antigravity-2/WORKFLOW.md) - How we work together
- [`PRODUCT_VISION.md`](file:///home/leskyjo/Documents/FE%20WebApp/web-app-antigravity-2/PRODUCT_VISION.md) - Product strategy

**Reference:**
- `docs/specs/` - Feature specifications
- `docs/decisions/` - Archived decision logs
- `docs/testing/` - Test strategies

---

## 💬 How to Work with AI

### Starting New Work
```
YOU: "I want to add a notifications feature"

AI: (Enters PLANNING mode)
    - Researches codebase
    - Creates planning.md
    - "Here's my proposed approach. Approve?"

YOU: "Looks good, proceed"

AI: (Enters EXECUTION mode)
    - Creates task.md
    - Codes systematically
    - Updates progress

AI: (Enters VERIFICATION mode)
    - Tests changes
    - Creates verification_report.md
    - "Testing complete. Ready for review?"

YOU: Reviews → Approves

AI: Marks complete, archives artifacts
```

### Checking Progress
```
YOU: "How's it going?"

AI: Shows task.md with:
    [x] Step 1 - Complete
    [x] Step 2 - Complete
    [/] Step 3 - In progress
    [ ] Step 4 - Todo
```

### Making Decisions
```
AI: "I can approach this 2 ways:
     A) Use Context API (simpler)
     B) Use Zustand (more scalable)
     
     Which do you prefer?"

YOU: "Use Zustand"

AI: Documents in decisions.md → Continues
```

---

## 🎯 Workflow Benefits

**For YOU:**
- ✅ Review plans before costly work starts
- ✅ Always know what phase AI is in
- ✅ Clear test results before approval
- ✅ Documented decisions for future reference

**For AI:**
- ✅ Clear structure to follow
- ✅ Explicit approval points
- ✅ Systematic task execution
- ✅ Quality verification built-in

---

## ⚡ Common Commands

**General:**
- "Let's use the new workflow" - Start workflow-based work
- "Show me the task checklist" - View current progress
- "What decisions have we made?" - View decisions.md

**Phase-Specific:**
- "I approve the plan" - PLANNING → EXECUTION
- "Run verification" - EXECUTION → VERIFICATION
- "Looks good, mark complete" - VERIFICATION → DONE

---

## 🔄 Workflow Phases

```
┌─────────────┐
│   START     │
│  (Request)  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  PLANNING   │ ← AI researches, proposes solution
│  planning.md│   YOU review and approve
└──────┬──────┘
       │ (approved)
       ▼
┌─────────────┐
│ EXECUTION   │ ← AI codes systematically
│   task.md   │   Updates checklist
└──────┬──────┘
       │ (complete)
       ▼
┌─────────────┐
│VERIFICATION │ ← AI tests, reports results
│   report.md │   YOU review and approve
└──────┬──────┘
       │ (approved)
       ▼
┌─────────────┐
│  COMPLETE   │ ← Artifacts archived
│   (Done!)   │   Ready for next feature
└─────────────┘
```

---

## 📚 Next Steps

**New to the project?**
1. Read [`WORKFLOW.md`](file:///home/leskyjo/Documents/FE%20WebApp/web-app-antigravity-2/WORKFLOW.md)
2. Review [`PRODUCT_VISION.md`](file:///home/leskyjo/Documents/FE%20WebApp/web-app-antigravity-2/PRODUCT_VISION.md)
3. Say: "Let's use the new workflow"

**Ready to build?**
- Just say what feature you want
- AI will enter PLANNING mode automatically
- Review and approve the plan
- AI executes and verifies
- You review final results

---

**Last Updated:** 2026-01-05  
**Workflow Version:** Google Conductor v1.0
