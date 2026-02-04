import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "Terms of Service | Felon Entrepreneur",
  description: "Terms of Service for Felon Entrepreneur - the rules and guidelines for using our platform.",
};

export default function TermsPage() {
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
        <h1 className="mb-2 text-4xl font-bold text-white">Terms of Service</h1>
        <p className="mb-8 text-sm text-slate-500">Last updated: February 3, 2026</p>

        <div className="prose prose-invert prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
            <p className="text-slate-300 leading-relaxed">
              By accessing or using the Felon Entrepreneur website, mobile application, and related services (collectively, the &quot;Services&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, do not use our Services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">2. Description of Services</h2>
            <p className="text-slate-300 leading-relaxed">
              Felon Entrepreneur provides tools and resources designed to help justice-impacted individuals build legitimate income, careers, and businesses. Our Services include but are not limited to:
            </p>
            <ul className="mt-4 list-disc pl-6 text-slate-300 space-y-2">
              <li>AI-powered personalized Life Plan generation</li>
              <li>Job discovery and fair-chance employer database</li>
              <li>Resume building tools</li>
              <li>Business builder guidance and resources</li>
              <li>Educational content (&quot;Cheat Codes&quot;)</li>
              <li>Community features and stories</li>
              <li>Merchandise store</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">3. Account Registration</h2>
            <p className="text-slate-300 leading-relaxed">
              To access certain features, you must create an account. You agree to:
            </p>
            <ul className="mt-4 list-disc pl-6 text-slate-300 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the security of your password and account</li>
              <li>Notify us immediately of any unauthorized access</li>
              <li>Be responsible for all activities under your account</li>
              <li>Be at least 18 years old to create an account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">4. Subscription and Payment</h2>
            <p className="mb-4 text-slate-300 leading-relaxed">
              Some features require a paid subscription. By subscribing, you agree to:
            </p>
            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li>Pay all fees associated with your chosen subscription tier</li>
              <li>Automatic renewal unless cancelled before the renewal date</li>
              <li>Price changes with notice prior to your next billing cycle</li>
              <li>No refunds for partial subscription periods unless required by law</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">5. Acceptable Use</h2>
            <p className="mb-4 text-slate-300 leading-relaxed">You agree NOT to:</p>
            <ul className="list-disc pl-6 text-slate-300 space-y-2">
              <li>Use the Services for any illegal purpose</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Post false, misleading, or fraudulent content</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use automated systems to scrape or extract data</li>
              <li>Interfere with the proper functioning of the Services</li>
              <li>Impersonate any person or entity</li>
              <li>Share your account credentials with others</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">6. User Content</h2>
            <p className="text-slate-300 leading-relaxed">
              You retain ownership of content you create. By posting content, you grant us a non-exclusive, worldwide, royalty-free license to use, display, and distribute your content in connection with the Services. You represent that you have the right to post such content and that it does not violate any third party&apos;s rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">7. AI-Generated Content</h2>
            <p className="text-slate-300 leading-relaxed">
              Our Services use artificial intelligence to generate personalized content including Life Plans, recommendations, and assistance. While we strive for accuracy, AI-generated content is provided for informational purposes only and should not be considered professional legal, financial, or career advice. You are responsible for evaluating and verifying any AI-generated content before acting on it.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">8. Intellectual Property</h2>
            <p className="text-slate-300 leading-relaxed">
              The Services, including all content, features, and functionality, are owned by Felon Entrepreneur LLC and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works without our prior written consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">9. Disclaimer of Warranties</h2>
            <p className="text-slate-300 leading-relaxed">
              THE SERVICES ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT GUARANTEE THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE. WE DO NOT GUARANTEE EMPLOYMENT OUTCOMES, BUSINESS SUCCESS, OR ANY SPECIFIC RESULTS FROM USING OUR SERVICES.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">10. Limitation of Liability</h2>
            <p className="text-slate-300 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, FELON ENTREPRENEUR LLC SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICES.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">11. Indemnification</h2>
            <p className="text-slate-300 leading-relaxed">
              You agree to indemnify and hold harmless Felon Entrepreneur LLC and its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Services or violation of these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">12. Termination</h2>
            <p className="text-slate-300 leading-relaxed">
              We may suspend or terminate your account at any time for violation of these Terms or for any other reason at our sole discretion. Upon termination, your right to use the Services will cease immediately. Provisions that by their nature should survive termination will survive.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">13. Governing Law</h2>
            <p className="text-slate-300 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the State of [Your State], without regard to its conflict of law provisions. Any disputes arising under these Terms shall be resolved in the courts of [Your State].
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">14. Changes to Terms</h2>
            <p className="text-slate-300 leading-relaxed">
              We may modify these Terms at any time. We will notify you of material changes by posting the updated Terms and changing the &quot;Last updated&quot; date. Your continued use of the Services after changes constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-2xl font-semibold text-white">15. Contact Information</h2>
            <p className="text-slate-300 leading-relaxed">
              If you have questions about these Terms, please contact us at:
            </p>
            <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4 text-slate-300">
              <p><strong>Felon Entrepreneur LLC</strong></p>
              <p>Email: <a href="mailto:legal@felonentrepreneur.com" className="text-red-400 hover:text-red-300">legal@felonentrepreneur.com</a></p>
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
