import { GraduationCap, Clock, TrendingUp } from "lucide-react";

const courses = [
  {
    title: "Rapid UI Systems",
    duration: "2 hours",
    level: "Intermediate",
    summary: "Build reusable UI primitives and ship faster with consistent patterns.",
  },
  {
    title: "Storytelling for Operators",
    duration: "45 minutes",
    level: "Beginner",
    summary: "Communicate your work in crisp narratives that land with hiring managers.",
  },
  {
    title: "Next.js Launchpad",
    duration: "3 hours",
    level: "Advanced",
    summary: "Ship a production-ready Next.js app with routing, auth mocks, and dashboards.",
  },
];

const levelColors = {
  Beginner: "text-green-400",
  Intermediate: "text-yellow-400",
  Advanced: "text-cyber-red",
};

export default function CoursesPage() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="relative glass-strong rounded-2xl border border-cyber-red/30 p-6 overflow-hidden">
        {/* Red glow background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyber-red/10 via-transparent to-transparent animate-pulse opacity-50" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-cyber-red/10 border border-cyber-red/30">
              <GraduationCap className="w-5 h-5 text-cyber-red" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyber-red">Courses</p>
          </div>
          <h1 className="text-3xl font-bold text-white glow-text-red">Learn only what moves you forward</h1>
          <p className="mt-2 text-sm text-cyber-text-secondary leading-relaxed">
            Each course is tied to your plan milestones. Finish one to unlock the next FE Button action.
          </p>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        {courses.map((course) => {
          const levelColor = levelColors[course.level as keyof typeof levelColors];
          return (
            <div
              key={course.title}
              className="group relative glass-strong rounded-2xl border border-cyber-red/30 p-5 transition-all duration-300 hover:border-cyber-red/60 hover:shadow-glow-red"
            >
              {/* Red glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyber-red/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />

              <div className="relative">
                {/* Duration & Level */}
                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wide">
                  <div className="flex items-center gap-1 text-cyber-text-dim">
                    <Clock className="w-3.5 h-3.5" />
                    {course.duration}
                  </div>
                  <span className="text-cyber-text-dim">•</span>
                  <span className={levelColor}>{course.level}</span>
                </div>

                {/* Course Title */}
                <h3 className="mt-3 text-lg font-bold text-white">{course.title}</h3>

                {/* Summary */}
                <p className="mt-2 text-sm text-cyber-text-secondary leading-relaxed">{course.summary}</p>

                {/* Progress Indicator (placeholder) */}
                <div className="mt-4 mb-4">
                  <div className="h-1.5 w-full rounded-full bg-cyber-black-lighter overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyber-red to-cyber-red-light transition-all duration-500"
                      style={{ width: "0%" }}
                    />
                  </div>
                </div>

                {/* Start Button */}
                <button className="w-full cyber-button rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 hover:shadow-glow-red flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Start course
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
