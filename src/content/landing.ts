export type Cta = { label: string; href: string };

export type MediaItem = {
  type: "image" | "video";
  src?: string;
  alt?: string;
  label?: string;
  caption?: string;
};

export type BulletItem = {
  text: string;
  expandedTitle: string;
  expandedContent: string;
};

export type FeatureConfig = {
  id: string;
  title: string;
  description: string;
  bullets: BulletItem[];
  media: MediaItem[];
  cta: Cta;
  flip?: boolean;
  gallery?: { src: string; alt: string; caption?: string }[];
  accentImage?: string;
  videoSrc?: string;
  supportingImages?: { src: string; alt: string; caption?: string }[];
  bulletIcon?: string; // Unique icon for this feature's bullets
};

export const supportHub = {
  title: "Support the Mission",
  headline: "Help us help those rebuilding their lives.",
  copy:
    "Felon Entrepreneur exists to break the cycle of recidivism through real business education and economic independence. Your support expands access to tools, training, and opportunity for justice-impacted individuals nationwide.",
  bullets: [
    {
      text: "See exactly where your money goes",
      expandedTitle: "Full Transparency, Every Week",
      expandedContent:
        "Every week, we post videos on our app, website, and social media showing exactly how donations are used. Watch real people get real help—housing assistance, business startup costs, emergency support. You'll see the direct impact of every dollar.",
    },
    {
      text: "Top donors get rewarded monthly",
      expandedTitle: "Monthly Donor Recognition Program",
      expandedContent:
        "Our top three monthly donors receive exclusive rewards. First place chooses from three premium packages including 6 months free app access, a podcast appearance, limited-edition merch, website leaderboard placement, and social media shoutouts. Second place picks from two packages. Third place receives exclusive limited-edition merchandise.",
    },
    {
      text: "Support a movement, not just a platform",
      expandedTitle: "Breaking the Cycle Together",
      expandedContent:
        "This isn't charity—it's investment in human potential. Every contribution helps someone access tools for legitimate income, business education, and economic independence. You're not just donating—you're helping break the cycle of recidivism one person at a time.",
    },
    {
      text: "Help someone build a legacy",
      expandedTitle: "From Setback to Ownership",
      expandedContent:
        "Your support gives justice-impacted individuals the foundation to build something real—businesses, careers, stable families. When someone goes from incarceration to entrepreneur, that's a legacy. You made that possible.",
    },
  ],
  cta: { label: "Support the Mission", href: "/signup" },
};

export const heroContent = {
  eyebrow: "OWNERSHIP OVER EXCUSES",
  title: "From Setback to Ownership",
  subtitle:
    "Felon Entrepreneur is the execution platform for justice-impacted individuals ready to build legitimate income, real businesses, and lasting legacy. No fluff. No excuses. Just systems that work.",
  primaryCta: { label: "See What's Inside", href: "#features" },
  secondaryCta: { label: "Join the Waitlist", href: "/signup" },
  highlights: [
    "AI-powered life planning built from your goals",
    "Fair-chance employers who actually hire",
    "Business builder tools to start your own",
  ],
};

export const benefitCards = [
  {
    title: "Your Plan. Your Path.",
    description:
      "Answer a few questions and our AI builds a personalized Life Plan with clear action steps—weekly, monthly, quarterly. No generic advice. Real moves based on your situation.",
    href: "/signup",
    cta: "Reserve Your Spot →",
  },
  {
    title: "Systems Over Motivation",
    description:
      "Daily check-ins, streak tracking, and micro-routines keep you moving forward. Progress happens through structure, not willpower. We built the system—you execute.",
    href: "/signup",
    cta: "Join the Movement →",
  },
  {
    title: "Own Something Real",
    description:
      "Not everyone is meant to work for someone else. Our Build My Business track walks you step-by-step from idea to LLC to income. Ownership creates freedom.",
    href: "/signup",
    cta: "Get Early Access →",
  },
];

export const features: FeatureConfig[] = [
  {
    id: "life-plan",
    title: "Personalized Life Plan",
    bulletIcon: "🎯",
    description:
      "Tell us where you are and where you want to go. Our AI builds a custom roadmap organized by timeframe—with action steps you can actually execute. Regenerate as your goals evolve.",
    bullets: [
      {
        text: "AI-generated plan from your answers",
        expandedTitle: "Your Situation, Your Plan",
        expandedContent:
          "FE asks meaningful questions about your situation, goals, and timeline. The AI analyzes your responses to create a roadmap tailored to YOUR life—not generic advice. Every plan is unique because every person's path is different.",
      },
      {
        text: "Weekly, monthly, and quarterly action steps",
        expandedTitle: "Organized by Timeframe",
        expandedContent:
          "Your plan breaks down into manageable timeframes. Weekly tasks keep you moving, monthly goals show momentum, quarterly milestones prove transformation. No overwhelm—just clear steps at the pace that works for you.",
      },
      {
        text: "Daily recommendations on what to focus on",
        expandedTitle: "One Thing at a Time",
        expandedContent:
          "The FE Life Coach analyzes your plan and current progress to surface the ONE thing you should focus on today. No overwhelm, just clarity. When you know exactly what to do next, execution becomes automatic.",
      },
      {
        text: "Track progress and adjust as you grow",
        expandedTitle: "Evolve as You Change",
        expandedContent:
          "Your plan isn't static. As you complete steps, hit obstacles, or change direction, regenerate your plan to match where you are now. Life changes—your roadmap should too.",
      },
    ],
    media: [
      {
        type: "image",
        src: "/newimage2.webp",
        alt: "Life Plan dashboard",
        label: "Your roadmap",
        caption:
          "Your personalized roadmap—built from your goals, organized by timeframe, ready to execute.",
      },
    ],
    cta: { label: "Be First In Line", href: "/signup" },
  },
  {
    id: "career-finder",
    title: "Job Discovery",
    bulletIcon: "💼",
    description:
      "Find employers who actually hire people with records. Search by location, filter for remote and fair-chance employers, build resumes, and get application support—all in one place.",
    bullets: [
      {
        text: "Fair-chance employer database",
        expandedTitle: "Employers Who Actually Hire",
        expandedContent:
          "Access employers who have committed to second-chance hiring. These aren't just 'background-check friendly'—they actively recruit people with records. Stop wasting time on applications that go nowhere.",
      },
      {
        text: "Location-based job search",
        expandedTitle: "Jobs Where You Are",
        expandedContent:
          "Search by zip code, filter for remote opportunities, and find work that fits your current situation—whether you have transportation or not. The right job is one you can actually get to.",
      },
      {
        text: "Resume builder tool",
        expandedTitle: "Professional Resume in Minutes",
        expandedContent:
          "Create professional resumes that highlight your skills and experience. Our AI helps you frame your background positively without hiding who you are. Stand out for the right reasons.",
      },
      {
        text: "Save jobs and track applications",
        expandedTitle: "Stay Organized",
        expandedContent:
          "Keep a running list of opportunities you're pursuing. Track where you've applied, interview dates, and follow-up tasks. Organization leads to results.",
      },
    ],
    media: [
      {
        type: "image",
        src: "/newimage1.webp",
        alt: "Job search interface",
        label: "Find work",
        caption:
          "Find employers who hire based on your potential, not just your past.",
      },
    ],
    cta: { label: "Get Notified", href: "/signup" },
    flip: true,
  },
  {
    id: "build-business",
    title: "Build My Business",
    bulletIcon: "🏗️",
    description:
      "Ready to own something? Our step-by-step business builder walks you through formation, registration, branding, and launch. Verify each step, unlock the next. No guesswork.",
    bullets: [
      {
        text: "Visual workflow from idea to income",
        expandedTitle: "See the Whole Journey",
        expandedContent:
          "See your entire journey from concept to cash flow on a single visual map. Each step is clear, connected, and achievable. Know exactly where you are and what comes next.",
      },
      {
        text: "Step-by-step guidance with verified resources",
        expandedTitle: "Official Links, Real Guidance",
        expandedContent:
          "Every step includes official links (IRS, state registrations, SBA), estimated time and cost, and exactly what you need to complete it. No outdated info, no dead ends.",
      },
      {
        text: "Business document templates",
        expandedTitle: "Don't Start from Scratch",
        expandedContent:
          "Access templates for operating agreements, invoices, contracts, and more. Don't start from scratch—start from proven frameworks that work.",
      },
      {
        text: "Progress tracking and AI assistance",
        expandedTitle: "Never Get Stuck",
        expandedContent:
          "Mark steps complete, unlock the next phase, and get AI help when you're stuck. The FE Coach understands your business context and can answer questions specific to your situation.",
      },
    ],
    media: [
      {
        type: "image",
        src: "/skyscraper.jpg.png",
        alt: "Business builder workflow",
        label: "Build it right",
        caption:
          "Every step mapped out. Every resource verified. From idea to income.",
      },
    ],
    cta: { label: "Claim Your Spot", href: "/signup" },
  },
  {
    id: "stories",
    title: "Stories",
    bulletIcon: "📖",
    description:
      "Connect with a community that understands. Share your journey, read others' experiences, and find inspiration from people who've walked similar paths. Real stories. Real transformation.",
    bullets: [
      {
        text: "Share your transformation story",
        expandedTitle: "Your Story Matters",
        expandedContent:
          "Document your journey—the struggles, the wins, the lessons. Your story might be exactly what someone else needs to hear today. Transformation is contagious.",
      },
      {
        text: "Read community experiences",
        expandedTitle: "Learn from Others",
        expandedContent:
          "Learn from people walking similar paths. Prison stories, business victories, family rebuilding—real experiences from real people who understand what you're going through.",
      },
      {
        text: "Find inspiration and accountability",
        expandedTitle: "Stay Connected",
        expandedContent:
          "Connecting with others who understand keeps you grounded. Celebrate wins together, support through setbacks. Isolation kills progress—community accelerates it.",
      },
      {
        text: "Build connections that matter",
        expandedTitle: "Real Relationships",
        expandedContent:
          "These aren't superficial follows—they're relationships with people who get it. Build your network with people building alongside you. Your circle determines your ceiling.",
      },
    ],
    media: [
      {
        type: "image",
        src: "/newimage3.png",
        alt: "Community stories",
        label: "Real stories",
        caption:
          "Real transformation stories from people who understand your journey.",
      },
    ],
    cta: { label: "Join the Waitlist", href: "/signup" },
    flip: true,
  },
  {
    id: "cheat-codes",
    title: "Cheat Codes",
    bulletIcon: "⚡",
    description:
      "Short, high-value video lessons that give you immediate wins. Credit hacks, business shortcuts, mindset resets, and practical tactics from people who've been there. Quick to watch. Instant to apply.",
    bullets: [
      {
        text: "Bite-sized video lessons",
        expandedTitle: "Learn Fast, Apply Faster",
        expandedContent:
          "5-15 minute videos packed with actionable information. Watch on break, apply immediately. No fluff, no filler—just the tactics you need.",
      },
      {
        text: "Practical tactics you can use today",
        expandedTitle: "Immediate Results",
        expandedContent:
          "Every Cheat Code ends with something you can DO. Credit score boost? Housing application tips? Sales scripts? Use it NOW. Knowledge without action is worthless.",
      },
      {
        text: "Created by founders and community",
        expandedTitle: "From People Who've Done It",
        expandedContent:
          "Content from Kyle and Nate who've lived it, plus community members sharing what worked for them. Real experience, not theory. Proven results, not guesswork.",
      },
      {
        text: "New content added regularly",
        expandedTitle: "Always Growing",
        expandedContent:
          "The library grows based on what the community needs. Request topics, vote on priorities, get fresh content monthly. The system gets better because you're part of it.",
      },
    ],
    media: [
      {
        type: "image",
        src: "/new image4.webp",
        alt: "Cheat Codes preview",
        label: "Quick wins",
        caption: "Quick wins, practical tactics, immediate results.",
      },
    ],
    cta: { label: "Unlock Early Access", href: "/signup" },
  },
  {
    id: "merch",
    title: "Shop",
    bulletIcon: "🛍️",
    description:
      "Represent the movement. Premium merchandise designed for people building something real. Limited drops, mission-driven designs, and quality that reflects who you're becoming.",
    bullets: [
      {
        text: "Limited edition drops",
        expandedTitle: "Exclusive Releases",
        expandedContent:
          "Exclusive designs released in small batches. When they're gone, they're gone. Represent the movement authentically with pieces that won't be on everyone.",
      },
      {
        text: "Premium quality apparel",
        expandedTitle: "Built to Last",
        expandedContent:
          "These aren't cheap promotional items. Premium materials, quality construction, gear you'll actually want to wear. Comfort meets durability.",
      },
      {
        text: "Mission-driven designs",
        expandedTitle: "Wear the Message",
        expandedContent:
          "Every piece tells a story of transformation. Wear your identity as someone building something real. Start conversations that matter.",
      },
      {
        text: "Represent your transformation",
        expandedTitle: "More Than Merch",
        expandedContent:
          "This isn't just merchandise—it's a statement. When you wear FE, you're declaring who you're becoming. Ownership starts with how you carry yourself.",
      },
    ],
    media: [
      {
        type: "image",
        src: "/FE-tradtional.png",
        alt: "FE traditional design",
        label: "Classic",
        caption: "Represent the movement. Wear your transformation.",
      },
      {
        type: "image",
        src: "/FEtradtional-white.png",
        alt: "FE traditional white design",
        label: "Light",
        caption: "Represent the movement. Wear your transformation.",
      },
    ],
    cta: { label: "Get First Dibs", href: "/signup" },
    flip: true,
  },
];

export const howItWorks = {
  title: "How It Works",
  description:
    "Felon Entrepreneur is designed to meet you where you are and move you forward. Build your plan and access the tools you need to create real change.",
  steps: [
    {
      title: "Download the app",
      description: "Available soon on iOS and Android.",
    },
    {
      title: "Complete your profile",
      description: "Answer questions about your goals, situation, and what you want to build.",
    },
    {
      title: "Get your Life Plan",
      description: "Our AI creates a personalized roadmap with clear action steps.",
    },
    {
      title: "Execute daily",
      description: "Use our tools to find jobs, build a business, learn skills, and track progress.",
    },
  ],
};

export const founders = [
  {
    name: "Kyle",
    bio: "Builder and operator focused on creating real tools that help people execute. Pushing Felon Entrepreneur to be the platform people actually need—not just another app.",
    imageSrc: "/me2.jpg",
    social: {
      facebook: "https://www.facebook.com/kylejohnson.FE/",
      instagram: "https://www.instagram.com/leskyjo/",
    },
  },
  {
    name: "Nate",
    bio: "Founder with lived experience turning setbacks into systems. Building FE to give others the framework he wished existed—practical, direct, and built for results.",
    imageSrc: "/nate-the-founder.png",
    social: {
      facebook: "https://www.facebook.com/REENTRYSGOAT",
      instagram: "https://www.instagram.com/felon_entrepreneur/",
    },
  },
];
