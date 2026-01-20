export type LifePlanQuestionType =
  | "single_choice"
  | "multi_choice"
  | "short_text"
  | "long_text"
  | "numeric";

export type LifePlanOption = {
  value: string;
  label: string;
};

export type LifePlanQuestion = {
  question_id: string;
  group_id: string;
  label: string;
  type: LifePlanQuestionType;
  options?: LifePlanOption[];
  required: boolean;
  helper_text?: string; // Optional helper text for context
};

export type LifePlanQuestionGroup = {
  group_id: string;
  title: string;
  description?: string;
  questions: LifePlanQuestion[];
};

/**
 * NEW ONBOARDING QUESTIONNAIRE - 10 Questions
 * Pattern: Current State → Desired State → Willingness to Act
 *
 * This structure enables:
 * 1. GAP ANALYSIS (current vs desired)
 * 2. PERSONALIZED RECOMMENDATIONS (AI knows exact goals)
 * 3. CONVERSION QUALIFICATION (willingness = buying intent)
 */
export const lifePlanQuestionnaire: LifePlanQuestionGroup[] = [
  {
    group_id: "employment_income",
    title: "Employment & Income",
    description: "Help us understand where you are financially and where you want to be.",
    questions: [
      {
        question_id: "q1_current_employment",
        group_id: "employment_income",
        label: "Which best describes your current employment situation?",
        type: "single_choice",
        required: true,
        options: [
          { value: "unemployed_looking", label: "Unemployed / Looking for work" },
          { value: "part_time_odd_jobs", label: "Working part-time / Odd jobs" },
          { value: "full_time_w2", label: "Working full-time (W2 employment)" },
          { value: "self_employed_hustling", label: "Self-employed / Hustling independently" },
          { value: "zero_income", label: "I have zero income right now" },
        ],
      },
      {
        question_id: "q2_desired_employment",
        group_id: "employment_income",
        label: "What would you like your employment situation to be (realistically)?",
        type: "single_choice",
        required: true,
        helper_text: "This helps us create a plan that aligns with your actual goals",
        options: [
          { value: "full_time_enjoy_good_money", label: "Working full-time at something I enjoy and making good money" },
          { value: "full_time_own_business", label: "Working full-time at a business I created" },
          { value: "part_time_family_time", label: "Working part-time and spending more time with my family" },
          { value: "full_time_plus_side_hustle", label: "Working full-time but building a side hustle to turn into a business" },
          { value: "any_stable_job_survive", label: "Just need any stable job right now to survive" },
        ],
      },
      {
        question_id: "q3_current_income",
        group_id: "employment_income",
        label: "What is your current estimated monthly income?",
        type: "single_choice",
        required: true,
        options: [
          { value: "0_500", label: "$0 – $500" },
          { value: "500_1500", label: "$500 – $1,500" },
          { value: "1500_3000", label: "$1,500 – $3,000" },
          { value: "3000_5000", label: "$3,000 – $5,000" },
          { value: "5000_plus", label: "$5,000+" },
        ],
      },
    ],
  },
  {
    group_id: "barriers_solutions",
    title: "Barriers & Solutions",
    description: "Let's identify what's stopping you and how we can help you overcome it.",
    questions: [
      {
        question_id: "q4_biggest_barrier",
        group_id: "barriers_solutions",
        label: "What is the single biggest barrier stopping you from making money right now?",
        type: "single_choice",
        required: true,
        options: [
          { value: "criminal_record", label: "My criminal record / Background checks" },
          { value: "lack_skills", label: "Lack of high-income skills" },
          { value: "no_capital", label: "No startup capital (money)" },
          { value: "lack_discipline", label: "Lack of discipline or direction" },
          { value: "addiction_mental_health", label: "Addiction or mental health struggles" },
        ],
      },
      {
        question_id: "q5_willingness_level",
        group_id: "barriers_solutions",
        label: "How willing are you to take action to overcome your barriers?",
        type: "single_choice",
        required: true,
        helper_text: "Be honest - this helps us give you realistic recommendations",
        options: [
          { value: "5", label: "5 - I will do whatever it takes, no excuses" },
          { value: "4", label: "4 - I am very willing to work hard" },
          { value: "3", label: "3 - I am somewhat willing" },
          { value: "2", label: "2 - I am hesitant but I know I need to change" },
          { value: "1", label: "1 - I am not ready for heavy commitment" },
        ],
      },
      {
        question_id: "q6_willingness_strategies",
        group_id: "barriers_solutions",
        label: "Which strategies are you willing to use to overcome your barriers? (Choose all that apply)",
        type: "multi_choice",
        required: true,
        helper_text: "Select everything you're open to trying",
        options: [
          { value: "training_courses", label: "Upgrade my skills through paid or free training courses" },
          { value: "follow_experts", label: "Follow instructions from people who are where I want to be" },
          { value: "life_coach", label: "Work with a life coach to improve my daily habits" },
          { value: "invest_tools", label: "Invest money in myself using tools and resources" },
          { value: "strict_routine", label: "Commit to a strict routine and accountability system" },
          { value: "none_figure_out_myself", label: "None of the above - I need to figure it out myself" },
        ],
      },
    ],
  },
  {
    group_id: "living_stability",
    title: "Living Situation & Stability",
    description: "Your living situation affects what opportunities are realistic for you.",
    questions: [
      {
        question_id: "q7_current_housing",
        group_id: "living_stability",
        label: "What is your living situation right now?",
        type: "single_choice",
        required: true,
        options: [
          { value: "stable_housing", label: "Stable housing (Rent/Own)" },
          { value: "transitional_halfway", label: "Transitional / Halfway house" },
          { value: "staying_family_friends", label: "Staying with family/friends" },
          { value: "unstable_couch_surfing", label: "Unstable / Couch surfing" },
          { value: "homeless_no_address", label: "Homeless / No fixed address" },
        ],
      },
      {
        question_id: "q8_housing_goal",
        group_id: "living_stability",
        label: "What is your housing goal for the next 90 days?",
        type: "single_choice",
        required: true,
        options: [
          { value: "maintain_stable", label: "Already stable - just maintain what I have" },
          { value: "unstable_to_stable", label: "Move from unstable to stable housing" },
          { value: "family_to_own_place", label: "Move from family/friends to my own place" },
          { value: "get_transitional", label: "Get into transitional housing program" },
          { value: "safe_place_sleep", label: "Just need a safe place to sleep consistently" },
        ],
      },
    ],
  },
  {
    group_id: "goals_commitment",
    title: "Your Goals & Commitment",
    description: "These final questions help us create your personalized Life Plan.",
    questions: [
      {
        question_id: "q9_30_day_goal",
        group_id: "goals_commitment",
        label: "What is your #1 most important goal for the next 30 days?",
        type: "short_text",
        required: true,
        helper_text: "Example: 'Get my driver's license back and find a warehouse job'",
      },
      {
        question_id: "q10_commitment_level",
        group_id: "goals_commitment",
        label: "On a scale of 1-5, how committed are you to achieving this goal?",
        type: "single_choice",
        required: true,
        options: [
          { value: "5", label: "5 - I will make this happen no matter what" },
          { value: "4", label: "4 - Very committed, but I might face challenges" },
          { value: "3", label: "3 - Somewhat committed, I'll try my best" },
          { value: "2", label: "2 - Not very committed, just exploring options" },
          { value: "1", label: "1 - Just browsing, not ready to commit yet" },
        ],
      },
    ],
  },
];

/**
 * JOBS SECTION QUESTIONNAIRE - 6 Questions
 * Triggered when user first visits Jobs tab
 */
export const jobsQuestionnaire: LifePlanQuestionGroup[] = [
  {
    group_id: "career_direction",
    title: "Career Direction",
    description: "Let's find jobs that match what you actually want to do.",
    questions: [
      {
        question_id: "q11_desired_industries",
        group_id: "career_direction",
        label: "What type of work do you ACTUALLY want to do? (Pick your top 2)",
        type: "multi_choice",
        required: true,
        helper_text: "Select up to 2 industries that interest you most",
        options: [
          { value: "healthcare_medical", label: "Healthcare / Medical" },
          { value: "logistics_warehousing", label: "Logistics / Warehousing / Delivery" },
          { value: "trades", label: "Trades (Construction, HVAC, Plumbing, Electrical, Welding)" },
          { value: "food_hospitality", label: "Food Service / Hospitality" },
          { value: "retail_sales", label: "Retail / Sales / Customer Service" },
          { value: "technology_it", label: "Technology / IT / Software" },
          { value: "creative", label: "Creative (Design, Video, Writing)" },
          { value: "open_anything", label: "I'm open to anything that pays well and will hire me" },
        ],
      },
      {
        question_id: "q12_desired_salary",
        group_id: "career_direction",
        label: "What is your desired salary range within 90 days?",
        type: "single_choice",
        required: true,
        options: [
          { value: "1000_2000", label: "$1,000 – $2,000/month ($12-24k/year)" },
          { value: "2500_4000", label: "$2,500 – $4,000/month ($30-48k/year)" },
          { value: "5000_8000", label: "$5,000 – $8,000/month ($60-96k/year)" },
          { value: "10000_plus", label: "$10,000+/month ($120k+/year)" },
        ],
      },
    ],
  },
  {
    group_id: "legal_barriers",
    title: "Legal Barriers",
    description: "This helps us filter jobs appropriately for your situation.",
    questions: [
      {
        question_id: "q13_incarceration_timeline",
        group_id: "legal_barriers",
        label: "Have you been incarcerated?",
        type: "single_choice",
        required: true,
        options: [
          { value: "never", label: "Never" },
          { value: "last_90_days", label: "Released within last 90 days" },
          { value: "3_12_months", label: "Released 3–12 months ago" },
          { value: "1_5_years", label: "Released 1–5 years ago" },
          { value: "5_plus_years", label: "Released 5+ years ago" },
        ],
      },
      {
        question_id: "q14_legal_restrictions",
        group_id: "legal_barriers",
        label: "Do your charges legally restrict you from specific industries?",
        type: "multi_choice",
        required: true,
        helper_text: "Select all that apply (this keeps us from recommending jobs you can't get)",
        options: [
          { value: "no_restrictions", label: "No restrictions" },
          { value: "driving_restrictions", label: "Yes, driving restrictions (no CDL, delivery, rideshare)" },
          { value: "interaction_restrictions", label: "Yes, interaction restrictions (no kids/vulnerable people - no childcare, healthcare)" },
          { value: "financial_restrictions", label: "Yes, financial/fiduciary restrictions (no banking, accounting, handling money)" },
          { value: "not_sure", label: "Not sure what my restrictions are" },
        ],
      },
    ],
  },
  {
    group_id: "practical_constraints",
    title: "Practical Constraints",
    description: "These final questions ensure we only show you realistic job opportunities.",
    questions: [
      {
        question_id: "q15_transportation",
        group_id: "practical_constraints",
        label: "Do you currently have reliable transportation?",
        type: "single_choice",
        required: true,
        options: [
          { value: "own_vehicle", label: "Yes, my own vehicle" },
          { value: "public_transit_rides", label: "Yes, reliable public transit or rides" },
          { value: "sometimes_unreliable", label: "Sometimes / Unreliable" },
          { value: "no_transportation", label: "No transportation at all" },
        ],
      },
      {
        question_id: "q16_supervision_status",
        group_id: "practical_constraints",
        label: "Are you currently on probation or parole?",
        type: "single_choice",
        required: true,
        options: [
          { value: "no_supervision", label: "No supervision" },
          { value: "probation", label: "Yes, probation" },
          { value: "parole", label: "Yes, parole" },
          { value: "federal_supervised_release", label: "Yes, federal supervised release" },
        ],
      },
    ],
  },
];

/**
 * COURSES SECTION QUESTIONNAIRE - 8 Questions
 * Triggered when user first visits Courses tab
 */
export const coursesQuestionnaire: LifePlanQuestionGroup[] = [
  {
    group_id: "current_skills",
    title: "Current Skills",
    description: "Let's see what you already know so we can build on it.",
    questions: [
      {
        question_id: "q17_computer_literacy",
        group_id: "current_skills",
        label: "What is your current computer/internet skill level?",
        type: "single_choice",
        required: true,
        options: [
          { value: "advanced", label: "Advanced (Can code, use complex software)" },
          { value: "proficient", label: "Proficient (Can use Office, Zoom, basic tools comfortably)" },
          { value: "basic", label: "Basic (Social media, email, browsing only)" },
          { value: "low", label: "Low (I struggle with technology)" },
        ],
      },
      {
        question_id: "q18_existing_skills",
        group_id: "current_skills",
        label: "Do you have any of these existing skills or certifications? (Choose all that apply)",
        type: "multi_choice",
        required: true,
        options: [
          { value: "cdl", label: "CDL (Commercial Driver's License)" },
          { value: "forklift", label: "Forklift certification" },
          { value: "trade_skills", label: "Trade skills (Carpentry, Electrical, Plumbing, HVAC, Welding)" },
          { value: "medical_certs", label: "Medical certifications (CNA, EMT, Phlebotomy, etc.)" },
          { value: "sales_customer_service", label: "Sales or customer service experience (2+ years)" },
          { value: "management_leadership", label: "Management or leadership experience" },
          { value: "marketing_social_media", label: "Marketing, social media, or content creation" },
          { value: "none", label: "None of the above" },
        ],
      },
    ],
  },
  {
    group_id: "skill_goals",
    title: "Skill Goals",
    description: "What do you want to learn?",
    questions: [
      {
        question_id: "q19_digital_skill_interest",
        group_id: "skill_goals",
        label: "Which DIGITAL skill are you most interested in learning?",
        type: "single_choice",
        required: true,
        options: [
          { value: "social_media_video", label: "Social Media Growth & Video Production (become influencer or marketer)" },
          { value: "web_dev_coding", label: "Web Development & App Coding (build websites/apps)" },
          { value: "ai_prompting", label: "Artificial Intelligence (AI) Prompting & Tools (use AI to make money)" },
          { value: "graphic_design", label: "Graphic Design & Branding (design for businesses)" },
          { value: "none_prefer_physical", label: "None - I prefer physical/hands-on work" },
        ],
      },
      {
        question_id: "q20_physical_skill_interest",
        group_id: "skill_goals",
        label: "Which PHYSICAL or TRADE skill are you most interested in?",
        type: "single_choice",
        required: true,
        options: [
          { value: "construction", label: "Construction / General Contracting" },
          { value: "cdl_logistics", label: "Commercial Driving (CDL) / Logistics" },
          { value: "culinary", label: "Culinary / Food Service" },
          { value: "automotive", label: "Automotive Repair / Detailing" },
          { value: "hvac_plumbing_electrical", label: "HVAC / Plumbing / Electrical" },
          { value: "none_prefer_digital", label: "None - I prefer digital/computer work" },
        ],
      },
    ],
  },
  {
    group_id: "learning_capacity",
    title: "Learning Capacity",
    description: "How do you learn best?",
    questions: [
      {
        question_id: "q21_learning_style",
        group_id: "learning_capacity",
        label: "What is your preferred learning style?",
        type: "single_choice",
        required: true,
        options: [
          { value: "visual", label: "Visual (Watching videos/tutorials)" },
          { value: "auditory", label: "Auditory (Listening to podcasts/audiobooks)" },
          { value: "hands_on", label: "Hands-on (Doing it while learning - project-based)" },
          { value: "reading", label: "Reading (Articles, books, written guides)" },
        ],
      },
      {
        question_id: "q22_hardware_access",
        group_id: "learning_capacity",
        label: "What hardware do you have access to for learning?",
        type: "single_choice",
        required: true,
        options: [
          { value: "smartphone_only", label: "Smartphone only" },
          { value: "smartphone_tablet", label: "Smartphone + Tablet" },
          { value: "laptop_desktop", label: "Laptop or Desktop computer" },
          { value: "library_access", label: "Public library access only" },
        ],
      },
    ],
  },
  {
    group_id: "business_ambition",
    title: "Business Ambition",
    description: "Are you interested in starting a business?",
    questions: [
      {
        question_id: "q23_business_model",
        group_id: "business_ambition",
        label: "If you were to start a business, which model fits you best?",
        type: "single_choice",
        required: true,
        options: [
          { value: "service_based", label: "Service-based (Cleaning, Detailing, Landscaping, Handyman)" },
          { value: "digital_tech", label: "Digital/Tech (Marketing agency, Web design, AI services)" },
          { value: "ecommerce", label: "E-Commerce (Selling products online - Amazon, Shopify)" },
          { value: "skilled_trade", label: "Skilled Trade (HVAC, Carpentry, Welding business)" },
          { value: "consulting_coaching", label: "Consulting/Coaching (Teaching others what you know)" },
          { value: "no_business_want_job", label: "I don't want to start a business, just want a good job" },
        ],
      },
      {
        question_id: "q24_business_experience",
        group_id: "business_ambition",
        label: "Have you ever started a business or sold a product/service before?",
        type: "single_choice",
        required: true,
        options: [
          { value: "registered_business", label: "Yes, a legitimate registered business" },
          { value: "informal_hustles", label: "Yes, informal 'hustles' or side jobs (lawn care, detailing, etc.)" },
          { value: "idea_ready", label: "No, but I have a specific business idea ready to launch" },
          { value: "want_to_learn", label: "No, but I want to learn how to start one" },
          { value: "no_interest", label: "No interest in business at all" },
        ],
      },
    ],
  },
];
