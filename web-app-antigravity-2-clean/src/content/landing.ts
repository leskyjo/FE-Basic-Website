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
  title: "Support Hub",
  headline: "Support the movement, get on board, and help us help those still struggling.",
  copy:
    "Join the people powering Felon Entrepreneur. Your support keeps courses, jobs, and tools flowing to those rebuilding their lives.",
  bullets: [
    "Donations fuel real support tools",
    "Every contribution helps someone rebuild",
    "Expand courses, job support, and resources",
    "Support the mission—not just the platform",
  ],
  cta: { label: "Join free and support the movement", href: "/signup" },
};

export const heroContent = {
  eyebrow: "YOUR NEXT MOVE",
  title:
    "Design and execute a masterclass comeback system with Felon Entrepreneur",
  subtitle:
    "You don’t need motivation. You need a system. Join free, answer a few questions, and we build a Life Plan that turns chaos into clear next steps",
  primaryCta: { label: "Join free and start", href: "/signup" },
  secondaryCta: { label: "I already have an account", href: "/login" },
  highlights: [
    "Built from your answers in minutes",
    "Tools that push you forward daily",
    "One platform for the whole comeback",
  ],
};

export const benefitCards = [
  {
    title: "Personal plan, zero fluff",
    description:
      "No generic advice. No wasted time. Your plan is built from your answers and focused on real actions that improve your life, starting today",
    href: "/signup",
  },
  {
    title: "Built-in accountability",
    description:
      "Progress doesn’t happen by accident. Felon Entrepreneur gives you structure, momentum, and follow-through without pressure or overwhelm",
    href: "/signup",
  },
  {
    title: "Build something of your own",
    description:
      "Not everyone is meant to just work a job. Learn how to build income, skills, and confidence through entrepreneurship, even if you’re starting from zero",
    href: "/signup",
  },
];

export const features: FeatureConfig[] = [
  {
    id: "career-finder",
    title: "Career Finder Studio",
    description:
      "Get hired fast with auto-generated searches, targeted resumes, and an assistant that preps every application.",
    bullets: ["Auto-Generated Job Finder", "Resume Builder", "Application Assistant"],
    media: [
      {
        type: "image",
        src: "/skyscraper.jpg.png",
        alt: "Career finder skyline",
        label: "Signal scan",
      },
      {
        type: "video",
        src: "/skyscraper.jpg.png",
        alt: "Career finder preview",
        label: "Preview",
      },
    ],
    cta: { label: "Join free to start your job plan", href: "/signup" },
  },
  {
    id: "skill-accelerator",
    title: "Skill Accelerator Courses",
    description: "Real training that fast-tracks you into earning again—built for speed, proof, and momentum.",
    bullets: ["Fast-Track Training Courses", "Live Training Sessions", "One-on-One Training"],
    media: [
      {
        type: "image",
        src: "/redgraph.jpg.png",
        alt: "Skills dashboard",
        label: "Course stack",
      },
      {
        type: "video",
        src: "/redgraph.jpg.png",
        alt: "Course preview",
        label: "Preview",
      },
    ],
    cta: { label: "Join free to unlock courses", href: "/signup" },
    flip: true,
  },
  {
    id: "cheat-codes",
    title: "Cheat Codes",
    description: "Smart life hacks that cut through obstacles and hand you quick wins that pay off immediately.",
    bullets: [
      "Quick wins you can use today",
      "Money, mindset, and momentum shortcuts",
      "High-value micro-lessons",
    ],
    media: [
      {
        type: "video",
        src: "/hero-credit.jpg.png",
        alt: "Cheat Codes preview",
        label: "Preview",
      },
    ],
    cta: { label: "Join free to access Cheat Codes", href: "/signup" },
  },
  {
    id: "merch",
    title: "Wear Your Wins",
    description: "Limited drops that represent your comeback. Premium basics built to remind you what you’re building.",
    bullets: ["Limited drops", "Mission-driven designs", "Represent your comeback"],
    media: [],
    videoSrc: "/shirtvideo.mp4",
    supportingImages: [
      { src: "/FE-tradtional.png", alt: "FE traditional design" },
      { src: "/FEtradtional-white.png", alt: "FE traditional white design" },
    ],
    cta: { label: "Join free and visit the Shop", href: "/signup" },
    flip: true,
  },
  {
    id: "book",
    title: "Get the Book",
    description:
      "The guide for people getting ready to re-enter society—mindset reset, modern playbook, and step-by-step comeback plan.",
    bullets: ["Mindset reset", "Modern society catch-up", "Step-by-step comeback plan"],
    media: [
      {
        type: "image",
        src: "/bookcover.png",
        alt: "Book cover",
        label: "FE Book",
      },
    ],
    gallery: [{ src: "/book-spread.png", alt: "Book spread" }],
    cta: { label: "Join free to get book updates", href: "/signup" },
  },
];

export const howItWorks = {
  title: "Enter, onboard, launch.",
  description:
    "Everyone starts here. Join free, complete onboarding (name, zip, questionnaire), and unlock the full Felon Entrepreneur app experience.",
  steps: [
    { title: "Join free", description: "Tap in and secure your spot." },
    { title: "Complete onboarding", description: "Preferred name → zip → quick questionnaire." },
    { title: "Enter the app", description: "Home, Plan, Jobs, Courses, Shop, Profile unlocked." },
  ],
};

export const founders = [
  {
    name: "Kyle",
    bio: "Builder, operator, and relentless optimist. Pushing Felon Entrepreneur to be the comeback partner people deserve.",
    imageSrc: "/me%20in%20vegas.png",
  },
  {
    name: "Nate",
    bio: "Founder on a mission to turn setbacks into superpowers. Designing FE so you can move faster than the obstacles.",
    imageSrc: "/nate-the-founder.png",
  },
];
