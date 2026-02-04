import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Privacy Policy | Felon Entrepreneur",
  description: "Privacy Policy for Felon Entrepreneur - how we collect, use, and protect your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-slate-50">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/felon-entrepreneur-logo.png"
            alt="Felon Entrepreneur"
            width={160}
            height={48}
            className="h-10 w-auto"
          />
        </Link>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="mb-2 text-4xl font-bold text-white">Privacy Policy</h1>
        <p className="mb-8 text-sm text-slate-500">Last updated: February 3, 2026</p>

        <div className="prose prose-invert prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">1. Introduction</h2>
            <p className="text-slate-300 leading-relaxed">
              Felon Entrepreneur LLC (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and mobile application (collectively, the &quot;Services&quot;).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">2. Information We Collect</h2>
            <h3 className="mb-2 text-lg font-medium text-red-400">Information You Provide</h3>
            <ul className="mb-4 list-disc pl-6 text-slate-300 space-y-2">
              <li>Account information (email address, password)</li>
              <li>Profile information (name, location)</li>
              <li>Questionnaire responses for Life Plan generation</li>
              <li>Content you create (resumes, saved jobs, notes)</li>
              <li>Communications with us (support requests, feedback)</li>
            </ul>
            <h3 className="mb-2 text-lg font-medium text-red-400">Information Collected Automatically</h3>
            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li>Device information (device type, operating system)</li>
              <li>Usage data (pages visited, features used, time spent)</li>
              <li>Log data (IP address, browser type, access times)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">3. How We Use Your Information</h2>
            <p className="mb-4 text-slate-300 leading-relaxed">We use the information we collect to:</p>
            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li>Provide, maintain, and improve our Services</li>
              <li>Generate personalized Life Plans using AI technology</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices, updates, and support messages</li>
              <li>Respond to your comments, questions, and requests</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Detect, investigate, and prevent fraudulent transactions and abuse</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">4. Sharing of Information</h2>
            <p className="mb-4 text-slate-300 leading-relaxed">We do not sell your personal information. We may share information in the following circumstances:</p>
            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li><strong>Service Providers:</strong> With third parties who perform services on our behalf (hosting, analytics, payment processing)</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>With Your Consent:</strong> When you direct us to share information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">5. Data Security</h2>
            <p className="text-slate-300 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">6. Your Rights and Choices</h2>
            <p className="mb-4 text-slate-300 leading-relaxed">You have the right to:</p>
            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li>Access and receive a copy of your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent where applicable</li>
            </ul>
            <p className="mt-4 text-slate-300 leading-relaxed">
              To exercise these rights, contact us at <a href="mailto:privacy@felonentrepreneur.com" className="text-red-400 hover:text-red-300">privacy@felonentrepreneur.com</a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">7. Data Retention</h2>
            <p className="text-slate-300 leading-relaxed">
              We retain your personal information for as long as your account is active or as needed to provide you Services. We may retain certain information for legitimate business purposes or as required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">8. Children&apos;s Privacy</h2>
            <p className="text-slate-300 leading-relaxed">
              Our Services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we learn we have collected such information, we will delete it promptly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">9. Changes to This Policy</h2>
            <p className="text-slate-300 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. Your continued use of the Services after any changes indicates your acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">10. Contact Us</h2>
            <p className="text-slate-300 leading-relaxed">
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-slate-300">
              <p><strong>Felon Entrepreneur LLC</strong></p>
              <p>Email: <a href="mailto:privacy@felonentrepreneur.com" className="text-red-400 hover:text-red-300">privacy@felonentrepreneur.com</a></p>
            </div>
          </section>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8">
          <Link href="/" className="text-red-400 hover:text-red-300">
            &larr; Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
