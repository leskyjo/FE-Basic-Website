"use client";

import { useState } from "react";
import {
  Briefcase,
  GraduationCap,
  Award,
  Code,
  Users,
  Globe,
  Heart,
  Trophy,
  Plus,
  Edit,
  CheckCircle2,
  AlertCircle,
  Target,
  Sparkles,
} from "lucide-react";

interface EmploymentDetailsClientProps {
  userName: string;
  userTier: string;
  completionPercentage: number;
  initialData: {
    jobsProfile: any;
    workHistory: any[];
    education: any[];
    skills: any;
    certifications: any[];
    projects: any[];
    references: any[];
    languages: any[];
    volunteer: any[];
    awards: any[];
  };
}

export function EmploymentDetailsClient({
  userName,
  userTier,
  completionPercentage,
  initialData,
}: EmploymentDetailsClientProps) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f] pb-32 md:pb-8">
      {/* Hero Section - Circular Progress (NOT a box) */}
      <div className="relative overflow-hidden bg-gradient-to-r from-cyber-red/20 via-purple-900/20 to-cyber-red/20 border-b-2 border-cyber-red/30">
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left: Text */}
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white mb-2">
                Employment Details
              </h1>
              <p className="text-cyber-text text-lg">
                Power up your <span className="text-cyber-red font-bold">Career Finder Studio</span>
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Complete your profile to unlock Resume Builder, Application Assistant, and Interview Prep
              </p>
            </div>

            {/* Right: Circular Progress */}
            <div className="relative">
              <svg className="w-32 h-32 md:w-40 md:h-40 transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                {/* Progress circle */}
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="url(#progressGradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - completionPercentage / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff0040" />
                    <stop offset="100%" stopColor="#9333ea" />
                  </linearGradient>
                </defs>
              </svg>
              {/* Percentage text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-white">{completionPercentage}%</span>
                <span className="text-xs text-gray-400 uppercase tracking-wider">Complete</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <StatBadge
              icon={<Briefcase className="w-5 h-5" />}
              label="Work History"
              value={initialData.workHistory.length}
              color="red"
            />
            <StatBadge
              icon={<GraduationCap className="w-5 h-5" />}
              label="Education"
              value={initialData.education.length}
              color="purple"
            />
            <StatBadge
              icon={<Award className="w-5 h-5" />}
              label="Certifications"
              value={initialData.certifications.length}
              color="blue"
            />
            <StatBadge
              icon={<Code className="w-5 h-5" />}
              label="Projects"
              value={initialData.projects.length}
              color="green"
            />
          </div>
        </div>
      </div>

      {/* Main Content - VARIED VISUAL STYLES */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Professional Summary - Gradient Card */}
        <section>
          <SectionHeader
            icon={<Sparkles className="w-6 h-6" />}
            title="Professional Summary"
            subtitle="Your elevator pitch - what makes you unique?"
          />
          <div className="mt-4 p-6 rounded-2xl bg-gradient-to-br from-cyber-red/10 to-purple-900/10 border-2 border-cyber-red/30">
            {initialData.jobsProfile?.professional_summary ? (
              <div>
                <p className="text-white leading-relaxed">{initialData.jobsProfile.professional_summary}</p>
                <button className="mt-4 text-cyber-red hover:text-red-400 text-sm font-bold flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Summary
                </button>
              </div>
            ) : (
              <EmptyState
                icon={<Target className="w-12 h-12" />}
                title="Add your professional summary"
                description="A strong summary helps recruiters understand your value in 30 seconds"
                actionLabel="Write Summary"
              />
            )}
          </div>
        </section>

        {/* Work History - Timeline View (NOT boxes) */}
        <section>
          <SectionHeader
            icon={<Briefcase className="w-6 h-6" />}
            title="Work History"
            subtitle="Your career journey"
            action={
              <button className="flex items-center gap-2 px-4 py-2 bg-cyber-red hover:bg-red-600 text-white rounded-lg font-bold text-sm transition-colors">
                <Plus className="w-4 h-4" />
                Add Job
              </button>
            }
          />
          {initialData.workHistory.length > 0 ? (
            <div className="mt-6 relative">
              {/* Timeline line */}
              <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyber-red via-purple-600 to-transparent"></div>

              {/* Timeline items */}
              <div className="space-y-8">
                {initialData.workHistory.map((job, idx) => (
                  <TimelineItem
                    key={job.id}
                    job={job}
                    isFirst={idx === 0}
                    isCurrent={job.is_current_job}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState
                icon={<Briefcase className="w-12 h-12" />}
                title="No work history yet"
                description="Add your jobs to power Resume Builder and Application Assistant"
                actionLabel="Add Your First Job"
              />
            </div>
          )}
        </section>

        {/* Education - Card Grid */}
        <section>
          <SectionHeader
            icon={<GraduationCap className="w-6 h-6" />}
            title="Education"
            subtitle="Schools, degrees, and certifications"
            action={
              <button className="flex items-center gap-2 px-4 py-2 border-2 border-cyber-red/50 hover:border-cyber-red text-cyber-red rounded-lg font-bold text-sm transition-colors">
                <Plus className="w-4 h-4" />
                Add Education
              </button>
            }
          />
          {initialData.education.length > 0 ? (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {initialData.education.map((edu) => (
                <EducationCard key={edu.id} education={edu} />
              ))}
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState
                icon={<GraduationCap className="w-12 h-12" />}
                title="No education added"
                description="High school, college, trade school, or online courses"
                actionLabel="Add Education"
              />
            </div>
          )}
        </section>

        {/* Skills - Tag Cloud (completely different visual) */}
        <section>
          <SectionHeader
            icon={<Code className="w-6 h-6" />}
            title="Skills & Technologies"
            subtitle="What you bring to the table"
          />
          {initialData.skills?.skills_normalized?.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {initialData.skills.skills_normalized.map((skill: string, idx: number) => (
                <SkillTag key={idx} skill={skill} />
              ))}
              <button className="px-4 py-2 border-2 border-dashed border-gray-600 hover:border-cyber-red text-gray-400 hover:text-cyber-red rounded-lg text-sm font-bold transition-colors">
                + Add Skill
              </button>
            </div>
          ) : (
            <div className="mt-4">
              <EmptyState
                icon={<Code className="w-12 h-12" />}
                title="No skills listed"
                description="Add technical and soft skills to improve job matching"
                actionLabel="Add Skills"
              />
            </div>
          )}
        </section>

        {/* Certifications - Horizontal Scroll Badges */}
        {initialData.certifications.length > 0 && (
          <section>
            <SectionHeader
              icon={<Award className="w-6 h-6" />}
              title="Certifications & Licenses"
              subtitle="Professional credentials"
            />
            <div className="mt-6 overflow-x-auto pb-4">
              <div className="flex gap-4">
                {initialData.certifications.map((cert) => (
                  <CertificationBadge key={cert.id} certification={cert} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Projects - Grid (if any) */}
        {initialData.projects.length > 0 && (
          <section>
            <SectionHeader
              icon={<Code className="w-6 h-6" />}
              title="Projects & Portfolio"
              subtitle="Show what you've built"
            />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {initialData.projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        )}

        {/* Integration Callout - How this data is used */}
        <div className="bg-gradient-to-r from-purple-900/30 to-cyber-red/30 border-2 border-purple-500/30 rounded-2xl p-8">
          <h3 className="text-2xl font-black text-white mb-4 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-purple-400" />
            How We Use Your Employment Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <IntegrationCard
              title="Job Search Tool"
              description="Matches jobs based on your skills, experience, and preferences"
              icon="🔍"
            />
            <IntegrationCard
              title="Resume Builder"
              description="One-click resume generation with all your data pre-filled"
              icon="📄"
            />
            <IntegrationCard
              title="Application Assistant"
              description="Auto-fills job applications with your employment history"
              icon="✍️"
            />
            <IntegrationCard
              title="Interview Prep"
              description="Personalized coaching based on your background and target role"
              icon="🎯"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// SUB-COMPONENTS (Visual Variety)
// ============================================================================

function StatBadge({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: "red" | "purple" | "blue" | "green";
}) {
  const colorMap = {
    red: "from-red-500/20 to-red-900/20 border-red-500/30 text-red-400",
    purple: "from-purple-500/20 to-purple-900/20 border-purple-500/30 text-purple-400",
    blue: "from-blue-500/20 to-blue-900/20 border-blue-500/30 text-blue-400",
    green: "from-green-500/20 to-green-900/20 border-green-500/30 text-green-400",
  };

  return (
    <div className={`bg-gradient-to-br ${colorMap[color]} border-2 rounded-xl p-4 flex items-center gap-3`}>
      <div className="opacity-80">{icon}</div>
      <div>
        <div className="text-2xl font-black text-white">{value}</div>
        <div className="text-xs text-gray-400 uppercase tracking-wide">{label}</div>
      </div>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  subtitle,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="text-cyber-red">{icon}</div>
        <div>
          <h2 className="text-2xl font-black text-white">{title}</h2>
          <p className="text-sm text-gray-400">{subtitle}</p>
        </div>
      </div>
      {action}
    </div>
  );
}

function TimelineItem({ job, isFirst, isCurrent }: { job: any; isFirst: boolean; isCurrent: boolean }) {
  return (
    <div className="relative pl-16 md:pl-20 group">
      {/* Timeline dot */}
      <div
        className={`absolute left-3.5 md:left-5 top-0 w-5 h-5 rounded-full border-4 ${
          isCurrent
            ? "bg-cyber-red border-cyber-red/30 animate-pulse"
            : "bg-purple-600 border-purple-900/50"
        }`}
      ></div>

      {/* Content card */}
      <div className="bg-[#1a1a2e]/80 hover:bg-[#1a1a2e] border-2 border-gray-800 hover:border-cyber-red/30 rounded-xl p-6 transition-all duration-300">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-black text-white">{job.job_title}</h3>
            <p className="text-cyber-red font-bold">{job.company_name}</p>
          </div>
          {isCurrent && (
            <span className="px-3 py-1 bg-cyber-red/20 border border-cyber-red/50 text-cyber-red text-xs font-black rounded-full">
              CURRENT
            </span>
          )}
        </div>

        <div className="text-sm text-gray-400 mb-4">
          {new Date(job.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })} -{" "}
          {isCurrent ? "Present" : new Date(job.end_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          {" • "}
          {job.city}, {job.state}
        </div>

        {job.responsibilities && job.responsibilities.length > 0 && (
          <ul className="space-y-2 mb-4">
            {job.responsibilities.slice(0, 3).map((resp: string, idx: number) => (
              <li key={idx} className="text-sm text-cyber-text flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span>{resp}</span>
              </li>
            ))}
          </ul>
        )}

        {job.technologies_used && job.technologies_used.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {job.technologies_used.map((tech: string, idx: number) => (
              <span
                key={idx}
                className="px-2 py-1 bg-purple-900/30 border border-purple-700/30 text-purple-300 text-xs rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EducationCard({ education }: { education: any }) {
  return (
    <div className="bg-[#1a1a2e]/60 border-2 border-gray-800 hover:border-purple-500/50 rounded-xl p-6 transition-all duration-300 hover:scale-105">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-purple-900/30 border-2 border-purple-700/50 rounded-lg flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-6 h-6 text-purple-400" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-black text-white mb-1">{education.school_name}</h3>
          <p className="text-purple-400 font-bold mb-2">{education.degree_type}</p>
          {education.field_of_study && (
            <p className="text-sm text-gray-400 mb-2">{education.field_of_study}</p>
          )}
          <div className="text-xs text-gray-500">
            {education.graduation_date
              ? new Date(education.graduation_date).getFullYear()
              : `${new Date(education.start_date).getFullYear()} - ${education.is_current ? "Present" : new Date(education.end_date).getFullYear()}`}
          </div>
          {education.gpa && (
            <div className="mt-2 text-sm text-green-400 font-bold">GPA: {education.gpa}</div>
          )}
        </div>
      </div>
    </div>
  );
}

function SkillTag({ skill }: { skill: string }) {
  return (
    <span className="px-4 py-2 bg-gradient-to-r from-cyber-red/10 to-purple-900/10 border-2 border-cyber-red/30 hover:border-cyber-red text-white rounded-full text-sm font-bold transition-all duration-300 hover:scale-110 cursor-pointer">
      {skill}
    </span>
  );
}

function CertificationBadge({ certification }: { certification: any }) {
  return (
    <div className="flex-shrink-0 w-64 bg-gradient-to-br from-blue-900/20 to-blue-600/10 border-2 border-blue-500/30 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <Award className="w-8 h-8 text-blue-400 flex-shrink-0" />
        <div>
          <h4 className="font-black text-white text-sm mb-1">{certification.certification_name}</h4>
          <p className="text-xs text-blue-300">{certification.issuing_organization}</p>
          {certification.issue_date && (
            <p className="text-xs text-gray-500 mt-1">
              Issued {new Date(certification.issue_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: any }) {
  return (
    <div className="bg-[#1a1a2e]/80 border-2 border-gray-800 hover:border-green-500/50 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 group">
      {project.image_url && (
        <div className="aspect-video bg-gray-900 overflow-hidden">
          <img src={project.image_url} alt={project.project_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
      )}
      <div className="p-4">
        <h4 className="font-black text-white mb-2">{project.project_name}</h4>
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{project.project_description}</p>
        {project.technologies_used && project.technologies_used.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.technologies_used.slice(0, 3).map((tech: string, idx: number) => (
              <span key={idx} className="px-2 py-1 bg-green-900/30 text-green-300 text-xs rounded">
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  description,
  actionLabel,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
}) {
  return (
    <div className="bg-[#1a1a2e]/40 border-2 border-dashed border-gray-700 rounded-xl p-12 text-center">
      <div className="text-gray-600 mb-4 flex justify-center">{icon}</div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">{description}</p>
      <button className="px-6 py-3 bg-cyber-red hover:bg-red-600 text-white rounded-lg font-bold transition-colors">
        {actionLabel}
      </button>
    </div>
  );
}

function IntegrationCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
      <div className="text-3xl mb-2">{icon}</div>
      <h4 className="text-white font-bold mb-1">{title}</h4>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
}
