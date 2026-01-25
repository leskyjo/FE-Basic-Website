export type Cta = { label: string; href: string };

export type MediaItem = {
  type: "image" | "video";
  src?: string;
  alt?: string;
  label?: string;
};

export type FeatureConfig = {
  id: string;
  title: string;
  description: string;
  bullets: string[];
  media: MediaItem[];
  cta: Cta;
  flip?: boolean;
  gallery?: { src: string; alt: string }[];
  accentImage?: string;
  videoSrc?: string;
  supportingImages?: { src: string; alt: string }[];
};

export const supportHub = {
  title: "Support the Mission",
  headline: "Help us help those rebuilding their lives.",
  copy:
    "Felon Entrepreneur exists to break the cycle of recidivism through real business education and economic independence. Your support expands access to tools, training, and opportunity for justice-impacted individuals nationwide.",
  bullets: [
    "Fund real tools that create real income",
    "Expand access to business training",
    "Support a movement, not just a platform",
    "Help someone build a legacy",
  ],
  cta: { label: "Join the movement", href: "/signup" },
};

export const heroContent = {
  eyebrow: "OWNERSHIP OVER EXCUSES",
  title: "From Setback to Ownership",
  subtitle:
    "Felon Entrepreneur is the execution platform for justice-impacted individuals ready to build legitimate income, real businesses, and lasting legacy. No fluff. No excuses. Just systems that work.",
  primaryCta: { label: "Join Free", href: "/signup" },
  secondaryCta: { label: "See What's Inside", href: "#features" },
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
  },
  {
    title: "Systems Over Motivation",
    description:
      "Daily check-ins, streak tracking, and micro-routines keep you moving forward. Progress happens through structure, not willpower. We built the system—you execute.",
    href: "/signup",
  },
  {
    title: "Own Something Real",
    description:
      "Not everyone is meant to work for someone else. Our Build My Business track walks you step-by-step from idea to LLC to income. Ownership creates freedom.",
    href: "/signup",
  },
];

export const features: FeatureConfig[] = [
  {
    id: "life-plan",
    title: "Personalized Life Plan",
    description:
      "Tell us where you are and where you want to go. Our AI builds a custom roadmap organized by timeframe—with action steps you can actually execute. Regenerate as your goals evolve.",
    bullets: [
      "AI-generated plan from your answers",
      "Weekly, monthly, and quarterly action steps",
      "Daily recommendations on what to focus on",
      "Track progress and adjust as you grow",
    ],
    media: [
      {
        type: "image",
        src: "/skyscraper.jpg.png",
        alt: "Life Plan dashboard",
        label: "Your roadmap",
      },
    ],
    cta: { label: "Get your plan", href: "/signup" },
  },
  {
    id: "career-finder",
    title: "Job Discovery",
    description:
      "Find employers who actually hire people with records. Search by location, filter for remote and fair-chance employers, build resumes, and get application support—all in one place.",
    bullets: [
      "Fair-chance employer database",
      "Location-based job search",
      "Resume builder tool",
      "Save jobs and track applications",
    ],
    media: [
      {
        type: "image",
        src: "/skyscraper.jpg.png",
        alt: "Job search interface",
        label: "Find work",
      },
    ],
    cta: { label: "Start searching", href: "/signup" },
    flip: true,
  },
  {
    id: "build-business",
    title: "Build My Business",
    description:
      "Ready to own something? Our step-by-step business builder walks you through formation, registration, branding, and launch. Verify each step, unlock the next. No guesswork.",
    bullets: [
      "Visual workflow from idea to income",
      "Step-by-step guidance with verified resources",
      "Business document templates",
      "Progress tracking and AI assistance",
    ],
    media: [
      {
        type: "image",
        src: "/redgraph.jpg.png",
        alt: "Business builder workflow",
        label: "Build it right",
      },
    ],
    cta: { label: "Start building", href: "/signup" },
  },
  {
    id: "stories",
    title: "Stories",
    description:
      "Connect with a community that understands. Share your journey, read others' experiences, and find inspiration from people who've walked similar paths. Real stories. Real transformation.",
    bullets: [
      "Share your transformation story",
      "Read community experiences",
      "Find inspiration and accountability",
      "Build connections that matter",
    ],
    media: [
      {
        type: "image",
        src: "/hero-credit.jpg.png",
        alt: "Community stories",
        label: "Real stories",
      },
    ],
    cta: { label: "Join the community", href: "/signup" },
    flip: true,
  },
  {
    id: "cheat-codes",
    title: "Cheat Codes",
    description:
      "Short, high-value video lessons that give you immediate wins. Credit hacks, business shortcuts, mindset resets, and practical tactics from people who've been there. Quick to watch. Instant to apply.",
    bullets: [
      "Bite-sized video lessons",
      "Practical tactics you can use today",
      "Created by founders and community",
      "New content added regularly",
    ],
    media: [
      {
        type: "video",
        src: "/hero-credit.jpg.png",
        alt: "Cheat Codes preview",
        label: "Quick wins",
      },
    ],
    cta: { label: "Access Cheat Codes", href: "/signup" },
  },
  {
    id: "merch",
    title: "Shop",
    description:
      "Represent the movement. Premium merchandise designed for people building something real. Limited drops, mission-driven designs, and quality that reflects who you're becoming.",
    bullets: [
      "Limited edition drops",
      "Premium quality apparel",
      "Mission-driven designs",
      "Represent your transformation",
    ],
    media: [],
    videoSrc: "/shirtvideo.mp4",
    supportingImages: [
      { src: "/FE-tradtional.png", alt: "FE traditional design" },
      { src: "/FEtradtional-white.png", alt: "FE traditional white design" },
    ],
    cta: { label: "Visit the Shop", href: "/signup" },
    flip: true,
  },
];

export const howItWorks = {
  title: "How It Works",
  description:
    "Felon Entrepreneur is designed to meet you where you are and move you forward. Start free, build your plan, and access the tools you need to create real change.",
  steps: [
    {
      title: "Create your account",
      description: "Sign up free. No credit card required to start.",
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
    imageSrc: "/me%20in%20vegas.png",
  },
  {
    name: "Nate",
    bio: "Founder with lived experience turning setbacks into systems. Building FE to give others the framework he wished existed—practical, direct, and built for results.",
    imageSrc: "/nate-the-founder.png",
  },
];
