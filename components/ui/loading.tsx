"use client";

export function LoadingScreen({ label = "Checking access..." }: { label?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-gray-700">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-500" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
