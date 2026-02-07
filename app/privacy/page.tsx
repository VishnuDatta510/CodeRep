export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-6">
          Privacy Policy for CodeRep Chrome Extension
        </h1>

        <p className="text-gray-600 mb-6">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Introduction</h2>
          <p className="text-gray-700">
            CodeRep (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is
            committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, and safeguard your information when you use our
            Chrome Extension and web application.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Data Collection</h2>
          <p className="text-gray-700 mb-3">
            The CodeRep Chrome Extension and web application collect the
            following information:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              <strong>API Token</strong>: Stored locally in your browser to
              authenticate requests to your CodeRep account
            </li>
            <li>
              <strong>LeetCode Problem Information</strong>: Problem titles,
              URLs, and difficulty levels that you choose to add to your review
              queue
            </li>
            <li>
              <strong>Review History</strong>: Your ratings (Failed, Hard, Good)
              and review dates for spaced repetition scheduling
            </li>
            <li>
              <strong>Account Information</strong>: Email address and name (if
              provided during sign-up via Clerk authentication)
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">How We Use Your Data</h2>
          <p className="text-gray-700 mb-3">
            Your data is used exclusively to:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Authenticate and authorize access to your account</li>
            <li>Store and manage your LeetCode problem review schedule</li>
            <li>
              Calculate optimal review intervals based on spaced repetition
              algorithms
            </li>
            <li>Display your progress and statistics in the dashboard</li>
            <li>
              Detect successful LeetCode submissions and prompt for ratings
            </li>
          </ul>
          <p className="text-gray-700 mt-3">
            <strong>We do NOT</strong>:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Sell, share, or rent your personal data to third parties</li>
            <li>Use your data for advertising or marketing purposes</li>
            <li>Track your browsing activity outside of leetcode.com</li>
            <li>Access your LeetCode account credentials</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Data Storage</h2>
          <p className="text-gray-700 mb-3">
            <strong>Local Storage</strong>: Your API token and extension
            settings are stored locally in your browser using Chrome&apos;s
            storage API. This data never leaves your device unless explicitly
            used to make authenticated API requests.
          </p>
          <p className="text-gray-700">
            <strong>Server Storage</strong>: Problem data and review history are
            stored securely on our servers (hosted on Vercel and Supabase) with
            encryption at rest and in transit via HTTPS/TLS.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Data Security</h2>
          <p className="text-gray-700">
            We implement industry-standard security measures to protect your
            data:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>All data transmission uses HTTPS encryption</li>
            <li>API tokens are hashed and stored securely</li>
            <li>Database access is restricted with authentication</li>
            <li>Regular security updates and monitoring</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Third-Party Services</h2>
          <p className="text-gray-700 mb-3">
            CodeRep integrates with the following third-party services:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              <strong>Clerk</strong>: Authentication provider (
              <a
                href="https://clerk.com/legal/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Privacy Policy
              </a>
              )
            </li>
            <li>
              <strong>Vercel</strong>: Hosting and deployment (
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Privacy Policy
              </a>
              )
            </li>
            <li>
              <strong>Supabase</strong>: Database hosting (
              <a
                href="https://supabase.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Privacy Policy
              </a>
              )
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">
            Chrome Extension Permissions
          </h2>
          <p className="text-gray-700 mb-3">
            CodeRep requests the following Chrome permissions:
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              <strong>activeTab</strong>: To detect when you&apos;re on a
              LeetCode problem page and inject the &quot;Add to CodeRep&quot;
              button
            </li>
            <li>
              <strong>storage</strong>: To store your API token and settings
              locally in your browser
            </li>
            <li>
              <strong>host_permissions (leetcode.com)</strong>: To detect
              successful submissions and prompt for ratings
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Your Rights</h2>
          <p className="text-gray-700 mb-3">You have the right to:</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>
              <strong>Access</strong>: View all data we have stored about you
            </li>
            <li>
              <strong>Delete</strong>: Request deletion of your account and all
              associated data
            </li>
            <li>
              <strong>Export</strong>: Download your problem history and review
              data
            </li>
            <li>
              <strong>Revoke Access</strong>: Disconnect the extension by
              revoking your API token
            </li>
          </ul>
          <p className="text-gray-700 mt-3">
            To exercise these rights, go to{" "}
            <strong>Settings → Revoke Token</strong> or contact us at
            vishnudatta2004@gmail.com
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Data Retention</h2>
          <p className="text-gray-700">
            We retain your data as long as your account is active. If you revoke
            your API token or delete your account, we will delete all associated
            problem and review data within 30 days. Anonymized usage statistics
            may be retained for analytical purposes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">
            Changes to This Policy
          </h2>
          <p className="text-gray-700">
            We may update this Privacy Policy from time to time. We will notify
            you of significant changes by updating the &quot;Last updated&quot;
            date at the top of this page. Continued use of CodeRep after changes
            constitutes acceptance of the updated policy.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">Contact Us</h2>
          <p className="text-gray-700 mb-2">
            If you have questions about this Privacy Policy or how we handle
            your data, please contact us:
          </p>
          <ul className="text-gray-700 space-y-1">
            <li>
              <strong>Email</strong>: vishnudatta2004@gmail.com
            </li>
            <li>
              <strong>GitHub</strong>:{" "}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                CodeRep Repository
              </a>
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">
            Children&apos;s Privacy
          </h2>
          <p className="text-gray-700">
            CodeRep is not intended for users under the age of 13. We do not
            knowingly collect personal information from children under 13. If
            you believe we have collected such information, please contact us
            immediately.
          </p>
        </section>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            By using CodeRep, you acknowledge that you have read and understood
            this Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
