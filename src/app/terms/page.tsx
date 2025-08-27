export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By using InstaSave, you agree to these Terms of Service and Instagram's Terms of Use.
          </p>

          <h2>2. Service Description</h2>
          <p>
            InstaSave provides a service to download publicly available Instagram media content 
            through official Instagram API endpoints.
          </p>

          <h2>3. User Responsibilities</h2>
          <p>
            You agree to:
          </p>
          <ul>
            <li>Use the service only for personal, non-commercial purposes</li>
            <li>Respect copyright and intellectual property rights</li>
            <li>Comply with Instagram's Terms of Use and Community Guidelines</li>
            <li>Not use the service for bulk downloading or automated scraping</li>
          </ul>

          <h2>4. Prohibited Uses</h2>
          <p>
            You may not:
          </p>
          <ul>
            <li>Download private or restricted content without authorization</li>
            <li>Use downloaded content for commercial purposes without permission</li>
            <li>Redistribute or resell content obtained through our service</li>
            <li>Attempt to circumvent rate limits or security measures</li>
          </ul>

          <h2>5. Service Availability</h2>
          <p>
            We strive for high availability but cannot guarantee uninterrupted service. 
            Features may change due to Instagram API updates or policy changes.
          </p>

          <h2>6. Intellectual Property</h2>
          <p>
            All downloaded content remains the property of its original creators. 
            InstaSave claims no ownership over user-generated content.
          </p>

          <h2>7. Limitation of Liability</h2>
          <p>
            InstaSave is provided "as is" without warranties. We are not liable for 
            any damages arising from service use.
          </p>

          <h2>8. Contact Information</h2>
          <p>
            For terms-related questions, contact us at: legal@instasave.app
          </p>

          <p className="text-sm text-gray-600 mt-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
