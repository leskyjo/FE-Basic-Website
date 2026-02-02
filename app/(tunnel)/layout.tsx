import Link from "next/link";
import Image from "next/image";

export default function TunnelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#080808] to-[#050505] px-4 py-10">
      {/* Background glow */}
      <div className="fixed left-1/2 top-1/4 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500/5 blur-[150px]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col justify-center">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-block">
            <Image
              src="/felon-entrepreneur-logo.png"
              alt="Felon Entrepreneur"
              width={200}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
