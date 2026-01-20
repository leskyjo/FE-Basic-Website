# PATH SWITCHING & TIER STRATEGY

**Updated:** 2025-12-31  
**Purpose:** Optimal path switching rules + tier monetization strategy  
**Based on:** User feedback on PIVOT_PLAN.md

---

## 🎯 THE CORE CHALLENGE

**User Reality:**
- Employee → starts business (needs Entrepreneur path)
- Entrepreneur → business fails → gets job (needs Professional path)
- Some users want BOTH (side hustle + day job)

**Business Reality:**
- Need clear tier differentiation (Starter → Plus → Pro)
- Don't want to alienate users with restrictive rules
- Can't leave money on the table

---

## 💡 RECOMMENDED TIER STRATEGY

### Option A: "Switch Once, Upgrade for Both" (RECOMMENDED)

**Starter (Free):**
- ✅ Choose ONE path during onboarding
- ✅ Can switch paths ONE TIME (no going back)
- ❌ Cannot have both paths simultaneously
- **Upgrade Prompt:** "Want access to both Professional AND Entrepreneur features? Upgrade to Plus for dual-path access."

**Plus ($15/mo):**
- ✅ Full access to PRIMARY path (all features)
- ✅ Access to SECONDARY path with limitations:
  - ✅ Can view content (courses, plan, jobs)
  - ✅ Can use basic tools (free features)
  - ❌ Secondary path premium tools locked (BMB, Resume Builder for secondary, etc.)
- **Upgrade Prompt:** "Unlock full access to both paths + all premium tools. Upgrade to Pro."

**Pro ($25/mo):**
- ✅ Full universal access to BOTH paths
- ✅ All features unlocked on both paths
- ✅ Can switch between paths anytime
- ✅ All premium tools (BMB, Resume Builder, Interview Prep, etc.) on both

**Why This Works:**
- Starter users don't feel trapped (can switch once if they chose wrong)
- Plus users get value (access to both paths, but limited secondary features)
- Pro users get premium experience (full dual-path access)
- Clear monetization ladder (Starter → Plus → Pro)
- Doesn't alienate users who made a mistake or whose situation changed

---

### Option B: "Career Pivot Insurance" (Alternative)

**Starter (Free):**
- ONE path only
- Can request path switch via Support (manual approval, limited to once)

**Plus ($15/mo):**
- ONE path with full access
- "Career Pivot Insurance" → Can switch paths 1x per year (automated)

**Pro ($25/mo):**
- BOTH paths, unlimited switching

**Why This is Weaker:**
- More restrictive (Plus only gets 1 switch/year)
- Less clear value prop for Plus
- Manual approval on Starter is friction

**Verdict: Option A is better.**

---

## 🏗️ UPDATED HORIZONS STRUCTURE

### New Timeline Breakdown

**Current in PIVOT_PLAN:** Day 1 → Year 5  
**Your Feedback:** Too sparse, need more granular near-term focus

**Updated "Horizons" Structure:**

```json
{
  "horizons": {
    "week_1": {
      "headline": "Your first week starts now",
      "focus": "immediate_action",
      "actions": [
        {
          "title": "...",
          "category": "employment" | "mindset" | "skills",
          "estimated_time": "15-30 min",
          "priority": "critical",
          // ...
        }
      ]
    },
    "month_1": {
      "headline": "Where you'll be in 30 days",
      "focus": "momentum_building",
      "milestones": [...],
      "key_habits": [...]
    },
    "quarter_1": {
      "headline": "Your 90-day transformation",
      "focus": "sustainable_progress",
      "milestones": [...],
      "success_indicators": [...]
    },
    "month_6": {
      "headline": "Six months from now",
      "focus": "visible_results",
      "milestones": [...],
      "lifestyle_changes": [...]
    },
    "year_1": {
      "headline": "One year milestone",
      "focus": "major_achievements",
      "milestones": [...],
      "career_transformation": "..."
    },
    "year_5": {
      "headline": "Your long-term vision",
      "focus": "legacy_building",
      "vision_statement": "...",
      "aspirational_milestones": [...],
      // More vague, more inspirational
    }
  }
}
```

**AI Prompt Instructions:**

```
Week 1: HYPER-SPECIFIC actions (exact URLs, phone numbers, step-by-step)
Month 1: Specific milestones with clear success criteria
Quarter 1 (90 days): Detailed but slightly more strategic
6 Months: Strategic goals with some flexibility
1 Year: Major milestones, less tactical detail
5 Years: Vision-oriented, aspirational language
```

**Why This is Better:**
- Matches how people actually think about time
- Week 1 = urgency + clarity (no procrastination)
- 30/90 days = standard goal-setting frameworks
- 6 months = far enough to see real change
- 1 year = major milestone
- 5 years = optional long-term vision

---

## 🚀 EXCLUSIVE FEATURES BREAKDOWN

### Entrepreneur Path Exclusives

**1. BMB (Build My Business) - FLAGSHIP FEATURE**

**Tier Availability:**
- ❌ Starter: Locked (teaser only)
- ✅ Plus: Full access
- ✅ Pro: Full access + advanced analytics

**Core Functionality:**
- User explains business idea via chat
- AI generates visual workflow (N8N-style illustration)
- Each workflow step is clickable
- Click = detailed explanation + resources + links (e.g., irs.gov for EIN)
- Right-click → Mark as complete (checkmark appears)
- AI continues assisting post-launch (marketing, optimization, etc.)

**Implementation Notes:**
- Use image generation API (DALL-E or similar) for workflow visualization
- Or use programmatic SVG generation (nodes + edges, like a flowchart)
- Store business workflow state in database (`user_business_workflows` table)
- Track completion status per step
- AI context includes entire workflow + current step

**Example Workflow Steps:**
1. Validate Business Idea
2. Register Business Name
3. Get EIN (irs.gov)
4. Open Business Bank Account
5. Create Basic Website
6. Set Up Payment Processing
7. First Marketing Campaign
8. First Customer Acquisition
9. Optimize Operations
10. Scale Revenue

---

### Professional Path Exclusives

**1. Application Assistant**
- Starter: 1 sample use
- Plus: 15/month
- Pro: 30/month

**2. Interview Prep**
- Starter: Locked
- Plus: 3/month
- Pro: 6/month

**3. BMC (Build My Career) - NEW FLAGSHIP FOR PROFESSIONALS**

**Tier Availability:**
- ❌ Starter: Locked (teaser only)
- ✅ Plus: Full access
- ✅ Pro: Full access + advanced analytics

**Core Functionality:**
- User explains current role + career goals via chat
- AI generates visual career roadmap (similar to BMB workflow)
- Each career milestone is clickable
- Click = skills needed, timeline, actionable steps, resources
- Right-click → Mark as complete (track progress)
- AI adapts roadmap as user progresses

**Example Career Roadmap (Junior Engineer → VP Engineering):**
1. Master Current Role (6 months)
2. Lead a Project (3 months)
3. Get First Direct Report (12 months)
4. Become Senior Engineer (18 months)
5. Transition to Engineering Manager (24 months)
6. Manage Multiple Teams (3 years)
7. Director of Engineering (4 years)
8. VP of Engineering (5+ years)

**For Each Step, AI Provides:**
- Skills to develop (technical + soft skills)
- Certifications/courses to take
- networking strategies (who to connect with)
- Salary negotiation tactics
- company size/industry considerations
- Estimated timeline + success indicators

**Why This is Brilliant:**
- Comparable to BMB (visual, interactive, AI-powered)
- Addresses employed professionals (not just job hunters)
- Creates long-term engagement (multi-year roadmap)
- Upsell opportunity (Advanced Career Analytics on Pro)

---

## 📊 ADVANCED QUESTIONNAIRE STRATEGY

### Pro-Only "Power Profile"

**Availability:**
- ❌ Starter: Not available
- ❌ Plus: Not available
- ✅ Pro: Unlocks after choosing path

**Two Versions:**

**Professional Power Profile (20-30 questions):**
- Deep dive into work history
- Leadership aspirations
- Conflict resolution style
- Negotiation comfort level
- Networking habits
- Industry-specific challenges
- Manager quality assessment
- Career blockers (imposter syndrome, etc.)
- Long-term ambitions (C-suite? Consultant? Entrepreneur pivot?)

**Entrepreneur Power Profile (20-30 questions):**
- Business idea clarity (stage of development)
- Risk tolerance
- Funding strategy
- Team building experience
- Marketing knowledge
- Sales comfort level
- Financial literacy
- Product vs service preference
- Exit strategy (lifestyle business vs acquisition)
- Previous entrepreneurial attempts (failures + learnings)

**What It Unlocks:**
- Advanced AI coaching (deeper personalization)
- Pro-only courses (curated based on answers)
- Weekly check-ins (AI proactively messages user)
- Advanced analytics dashboard
- Peer matching (connect with similar users)

**Why This Works:**
- Pro users get exclusive value
- Deeper data → better AI recommendations
- Optional (doesn't block core features)
- Natural upsell from Plus → Pro

---

## 🎯 SUB-CATEGORIZATION: PROFESSIONAL PATH

### Current Problem
Professional path has 2 very different user states:
1. **Employed** (wants to level up OR switch jobs)
2. **Unemployed** (needs to find a job)

### Solution: Mini-Questionnaire on First Visit

**When user first visits Jobs page (Professional path):**

```
🏢 Let's personalize your professional journey

Quick question: What's your current employment status?

[ ] I'm employed (want to advance my career)
[ ] I'm employed (looking for a new job)
[ ] I'm unemployed (actively job hunting)
[ ] I'm unemployed (not ready to search yet)
```

**Based on Answer:**

**Employed + Advancing:**
- Hide Jobs search (not relevant)
- Redirect to BMC (Build My Career) tool
- Focus on skill development, promotions, certifications

**Employed + New Job:**
- Show Jobs search (curated to their seniority level)
- Offer Resume Builder
- Offer Application Assistant

**Unemployed + Hunting:**
- Show Jobs search (all levels)
- Offer Resume Builder
- Offer Application Assistant
- Offer Interview Prep

**Unemployed + Not Ready:**
- Hide Jobs search
- Offer skill-building courses
- Offer confidence-building content
- Gentle nudge to BMC (career planning for when ready)

**Storage:**
```sql
ALTER TABLE user_path_preferences ADD COLUMN employment_status_professional text CHECK (
  employment_status_professional IN ('employed_advancing', 'employed_new_job', 'unemployed_hunting', 'unemployed_not_ready')
);
```

---

## 💰 MONETIZATION SUMMARY

### Clear Value Ladder

**Starter → Plus:**
- "Unlock Resume Builder (5/month) + Application Assistant (15/month)"
- OR: "Access secondary path features + premium tools"

**Plus → Pro:**
- "Get full dual-path access + unlimited premium tools"
- "Unlock Advanced Power Profile + weekly AI check-ins"
- "Get BMB/BMC advanced analytics"

**Revenue Impact:**
- Starter users don't feel trapped (1 path switch allowed)
- Plus users get solid value (dual-path access, limited secondary features)
- Pro users get premium experience (worth $25/mo)
- Clear differentiation at each tier

---

## 🚧 CLARIFICATIONS ON BACKWARD COMPATIBILITY

**You said:** "We don't have existing users, we're in development phase"

**My Understanding Now:**
- No need for backward compatibility with old questionnaire data
- Current onboarding is 10-12 questions (not 20)
- We're replacing current onboarding entirely with path choice

**Updated Migration Strategy:**
- No dual-mode needed (no existing users to support)
- Can fully replace current onboarding
- No need to infer paths from old data

**This Simplifies Everything!** 

We can:
1. Remove current 10-12 question flow entirely
2. Replace with: Name → Zip → Path Choice → Welcome → Generating
3. No backward compatibility code needed
4. Clean slate architecture

---

## 🎨 VISUAL DESIGN NOTES

### BMB Workflow Visualization

**Option 1: Programmatic SVG (Recommended)**
- Generate flowchart dynamically (nodes + arrows)
- Each node = step in business development
- Color-coded by category (legal, marketing, operations, etc.)
- Checkmark overlay when marked complete
- Click → highlight + show details below
- **Pro:** No image API costs, infinitely customizable
- **Con:** Need to build SVG generator

**Option 2: DALL-E Image Generation**
- Prompt: "Business workflow diagram with steps: [step 1], [step 2], etc."
- **Pro:** Quick to implement
- **Con:** Not interactive (can't click individual steps), costs per generation

**Recommendation:** Option 1 (SVG) for interactivity + cost savings

### BMC Career Roadmap Visualization

Same approach as BMB but styled differently:
- Vertical timeline instead of workflow
- Each milestone = node on timeline
- Color-coded by career stage (junior, mid, senior, leadership, executive)
- Checkmarks for completed milestones
- Click → detailed breakdown

---

## 📋 UPDATED IMPLEMENTATION CHECKLIST

### Phase 1: Foundation (Week 1)

- [ ] Remove current 10-12 question onboarding flow
- [ ] Create path choice step (Professional vs Entrepreneur)
- [ ] Add `user_path` column to profiles table
- [ ] Add `user_path_preferences` table with tier-aware fields
- [ ] Implement path switch logic with tier enforcement

### Phase 2: Horizons (Week 2)

- [ ] Update Life Plan generation with new timeline structure:
  - Week 1 (hyper-specific)
  - Month 1 (specific milestones)
  - Quarter 1 (90 days, strategic)
  - 6 Months (goals)
  - 1 Year (major milestones)
  - 5 Years (optional vision)
- [ ] Create `HorizonsView` component for Plan page
- [ ] Update AI prompts for granular detail at each timeline

### Phase 3: Exclusive Features (Week 3-4)

**Entrepreneur Features:**
- [ ] BMB (Build My Business)
  - [ ] Visual workflow generator (SVG)
  - [ ] Database: `user_business_workflows` table
  - [ ] Click handling + detail display
  - [ ] Mark as complete functionality
  - [ ] AI chat with step context

**Professional Features:**
- [ ] BMC (Build My Career)
  - [ ] Career roadmap generator (SVG timeline)
  - [ ] Database: `user_career_roadmaps` table
  - [ ] Milestone tracking
  - [ ] Skills matrix per milestone
  - [ ] AI career coaching with roadmap context

- [ ] Application Assistant (move to Professional-only)
- [ ] Interview Prep (move to Professional-only)

### Phase 4: Professional Sub-Categorization (Week 5)

- [ ] Employment status mini-questionnaire on Jobs page
- [ ] Route users appropriately:
  - Employed + Advancing → BMC
  - Employed + New Job → Jobs search + tools
  - Unemployed + Hunting → Jobs search + tools
  - Unemployed + Not Ready → Courses + BMC

### Phase 5: Advanced Power Profile (Week 6)

- [ ] Create Pro-only Advanced Questionnaire
- [ ] Two versions (Professional vs Entrepreneur)
- [ ] 20-30 deep questions per version
- [ ] Store in `user_power_profile` table
- [ ] Unlock advanced features based on completion

---

## 🎯 FINAL RECOMMENDATIONS

1. **Path Switching:** Use Option A ("Switch Once, Upgrade for Both")
2. **Horizons:** Week 1 → Month 1 → 90 Days → 6 Months → 1 Year → 5 Years
3. **BMB:** Entrepreneur flagship (visual workflow with AI coaching)
4. **BMC:** Professional flagship (career roadmap with AI coaching)
5. **Power Profile:** Pro-only, unlocks advanced features
6. **Professional Sub-Categorization:** Mini-questionnaire on Jobs page

**This strategy:**
- ✅ Doesn't alienate users (can switch paths)
- ✅ Clear tier differentiation (Starter → Plus → Pro)
- ✅ Balanced exclusive features (BMB for Entrepreneur, BMC for Professional)
- ✅ Maximizes revenue (compelling upgrade paths)
- ✅ Focused on near-term action (Week 1 → 90 days is primary)

**Ready to implement?**
