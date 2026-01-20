# BLUEPRINT CROSS-REFERENCE CHECKLIST

**Created:** 2025-12-31  
**Purpose:** Track which features are documented vs need blueprints  
**Next Action:** Create blueprints for undocumented features before implementation

---

## ✅ FEATURES IN BLUEPRINTS FOLDER

Cross-reference these against `/project_blueprints/` folder:

### Verified Existing

- [ ] **Landing Page** (`/project_blueprints/LANDING/` ?)
- [ ] **Onboarding** (`/project_blueprints/ONBOARDING/`)
  - ⚠️ Needs update: Path Choice step, remove old questionnaire
- [ ] **Plan** (`/project_blueprints/PLAN/` ?)
  - ⚠️ Needs update: Multi-plan system (Career, Health, Financial, Resources, Education)
- [ ] **Jobs** (`/project_blueprints/JOBS/`)
  - Listed as "Career Finder Studio" in new naming
- [ ] **Courses** (check if exists)
- [ ] **FE Button** (check if exists)
- [ ] **Cheat Codes** (check if exists)
- [ ] **Shop** (check if exists)
- [ ] **Tiers & Access** (`/project_blueprints/ONBOARDING/TIERS AND ACCESS REVISED.txt`)
  - ⚠️ Needs update: ProTeams tier, BMB/BMC restrictions

---

## ❌ FEATURES NEEDING BLUEPRINTS

### Critical (Required for MVP - Phase 1)

1. **Resources Directory**
   - Local/state/federal resources lookup
   - Categories: Housing, food, transportation, drug/alcohol, mental health, family, legal
   - Contact info: Address, phone, website, email, hours
   - Location-based (ZIP code detection)
   - **ACTION:** Create `/project_blueprints/RESOURCES/RESOURCES_DIRECTORY.txt`

2. **Multi-Plan System Architecture**
   - 5 plan types: Career, Health, Financial, Resources, Education
   - Each has own questionnaire
   - Each generates separate AI roadmap
   - Shared Horizons structure
   - **ACTION:** Create `/project_blueprints/PLANS/MULTI_PLAN_ARCHITECTURE.txt`

### High Priority (Phase 2 Flagships)

3. **BMB (Build My Business)**
   - Visual workflow generator (N8N-style)
   - Business development steps
   - Clickable nodes with guidance
   - Progress tracking
   - Entrepreneur path exclusive
   - **ACTION:** Create `/project_blueprints/BMB/BUILD_MY_BUSINESS.txt`

4. **BMC (Build My Career)**
   - Career roadmap timeline
   - Milestone system
   - Skills/strategies per milestone
   - Progress tracking
   - Professional path exclusive
   - **ACTION:** Create `/project_blueprints/BMC/BUILD_MY_CAREER.txt`

5. **Career Plan (formerly Life Plan)**
   - Horizons structure: Week 1 → Year 5
   - Professional vs Entrepreneur versions
   - AI generation with questionnaire
   - Regeneration limits by tier
   - **ACTION:** Create `/project_blueprints/PLANS/CAREER_PLAN.txt`

6. **Health & Wellness Plan**
   - Questionnaire design
   - Plan generation
   - Health-specific coaching
   - **ACTION:** Create `/project_blueprints/PLANS/HEALTH_PLAN.txt`

7. **Financial Plan**
   - Questionnaire design
   - Budget/debt/savings roadmap
   - Credit repair integration
   - **ACTION:** Create `/project_blueprints/PLANS/FINANCIAL_PLAN.txt`

8. **Resources Plan**
   - Immediate needs assessment
   - Resources connection roadmap
   - Stability milestones
   - **ACTION:** Create `/project_blueprints/PLANS/RESOURCES_PLAN.txt`

9. **Education Plan**
   - Skills gap analysis
   - Learning roadmap
   - Course recommendations
   - Certification paths
   - **ACTION:** Create `/project_blueprints/PLANS/EDUCATION_PLAN.txt`

### Medium Priority (Phase 3 Community)

10. **Community Features**
    - User profiles
    - Following system
    - Direct messaging
    - Group discussions
    - **ACTION:** Create `/project_blueprints/COMMUNITY/COMMUNITY_FEATURES.txt`

11. **Stories Platform**
    - User-generated content (video/image/text)
    - Like/share/comment functionality
    - Categories/tags
    - Feed algorithm
    - **ACTION:** Create `/project_blueprints/COMMUNITY/STORIES_PLATFORM.txt`

12. **Weekly Featured Story → Podcast**
    - Selection criteria
    - Winner notification
    - Podcast recording process
    - YouTube publishing
    - **ACTION:** Create `/project_blueprints/COMMUNITY/FEATURED_STORY_PODCAST.txt`

### Medium Priority (Phase 3 Revenue)

13. **Donations & Sponsorship**
    - User donation flow
    - Sponsorship application/vetting
    - Sponsor matching
    - Progress tracking
    - Leaderboard
    - **ACTION:** Create `/project_blueprints/DONATIONS/DONATIONS_SPONSORSHIP.txt`

14. **Donor Leaderboard**
    - Monthly rankings
    - Appreciation packages
    - Transparency videos
    - **ACTION:** Create `/project_blueprints/DONATIONS/DONOR_LEADERBOARD.txt`

15. **Course Certification System**
    - Certificate generation
    - Completion criteria
    - Job placement assistance
    - Bonus tokens
    - **ACTION:** Create `/project_blueprints/COURSES/CERTIFICATION_SYSTEM.txt`

16. **ProTeams Implementation**
    - Team subscription model
    - Seat management
    - Invitation system
    - Team dashboard
    - Billing (seat-based)
    - **ACTION:** Create `/project_blueprints/TIERS/PROTEAMS.txt`

---

## 📋 BLUEPRINT CREATION WORKFLOW

When building any feature, follow this process:

### Step 1: Check Blueprint Status
- Review this checklist
- If blueprint exists → Read it
- If blueprint missing → Create it first

### Step 2: Create Blueprint (if needed)
Use this template:

```markdown
# [FEATURE NAME]

**Created:** [Date]  
**Phase:** MVP / Phase 2 / Phase 3 / Future  
**Priority:** Critical / High / Medium / Low

## Overview
[2-3 sentence description of what this feature is]

## User Journey
[Step-by-step user flow]

## Tier Access
- Starter: [Access level]
- Plus: [Access level]
- Pro: [Access level]
- ProTeams: [Access level]

## Path-Specific Behavior
- Professional Path: [Behavior]
- Entrepreneur Path: [Behavior]

## UI/UX Requirements
[Screens, components, interactions]

## Database Schema
[Tables, columns, relationships]

## API Endpoints
[Routes, methods, request/response]

## Business Rules
[Tier limits, quotas, restrictions]

## Security Considerations
[RLS, auth, validation]

## Implementation Notes
[Technical considerations, dependencies]

## Verification Criteria
[How to test this feature works]
```

### Step 3: Update This Checklist
- Mark blueprint as created
- Move from "Needing Blueprints" to "Existing"

---

## 🎯 IMMEDIATE ACTION ITEMS

**Before starting Phase 1 implementation:**

1. [ ] Create Resources Directory blueprint
2. [ ] Create Multi-Plan Architecture blueprint
3. [ ] Update Onboarding blueprint (Path Choice)
4. [ ] Update Tiers blueprint (ProTeams)

**Before starting Phase 2 implementation:**

5. [ ] Create BMB blueprint
6. [ ] Create BMC blueprint
7. [ ] Create all 5 specialized plan blueprints

**Before starting Phase 3 implementation:**

8. [ ] Create Community blueprint
9. [ ] Create Stories blueprint
10. [ ] Create Donations/Sponsorship blueprint

---

## 📁 RECOMMENDED BLUEPRINT FOLDER STRUCTURE

```
project_blueprints/
├── LANDING/
├── ONBOARDING/
│   ├── ONBOARDING_FLOW.txt (update with Path Choice)
│   └── TIERS_AND_ACCESS.txt (update with ProTeams)
├── PLANS/
│   ├── MULTI_PLAN_ARCHITECTURE.txt (NEW)
│   ├── CAREER_PLAN.txt (NEW)
│   ├── HEALTH_PLAN.txt (NEW)
│   ├── FINANCIAL_PLAN.txt (NEW)
│   ├── RESOURCES_PLAN.txt (NEW)
│   └── EDUCATION_PLAN.txt (NEW)
├── JOBS/
│   └── CAREER_FINDER_STUDIO.txt (existing)
├── BMB/
│   └── BUILD_MY_BUSINESS.txt (NEW)
├── BMC/
│   └── BUILD_MY_CAREER.txt (NEW)
├── RESOURCES/
│   └── RESOURCES_DIRECTORY.txt (NEW)
├── COURSES/
│   └── CERTIFICATION_SYSTEM.txt (NEW)
├── COMMUNITY/
│   ├── COMMUNITY_FEATURES.txt (NEW)
│   ├── STORIES_PLATFORM.txt (NEW)
│   └── FEATURED_STORY_PODCAST.txt (NEW)
├── DONATIONS/
│   ├── DONATIONS_SPONSORSHIP.txt (NEW)
│   └── DONOR_LEADERBOARD.txt (NEW)
└── TIERS/
    └── PROTEAMS.txt (NEW)
```

---

## ✅ COMPLETION TRACKING

**Total Features:** ~25  
**Blueprints Existing:** ~9 (needs verification)  
**Blueprints Needed:** ~16

**Phase 1 Blueprints:** 4 critical  
**Phase 2 Blueprints:** 9 high priority  
**Phase 3 Blueprints:** 7 medium priority

**Next Step:** Verify existing blueprints in `/project_blueprints/` folder, then create missing blueprints in priority order.
