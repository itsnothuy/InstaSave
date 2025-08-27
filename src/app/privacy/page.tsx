export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose max-w-none">
          <h2>1. Information We Collect</h2>
          <p>
            InstaSave collects minimal information necessary to provide our service:
          </p>
          <ul>
            <li>Instagram profile information (when you authorize our app)</li>
            <li>Media URLs for download purposes</li>
            <li>Usage analytics (non-personal)</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use your information solely to:
          </p>
          <ul>
            <li>Provide Instagram media download services</li>
            <li>Improve our service quality</li>
            <li>Ensure service security and compliance</li>
          </ul>

          <h2>3. Data Storage and Security</h2>
          <p>
            We do not store your Instagram content. All downloads are processed in real-time 
            without permanent storage. Your authorization tokens are handled securely according 
            to Instagram's API guidelines.
          </p>

          <h2>4. Third-Party Services</h2>
          <p>
            Our service integrates with:
          </p>
          <ul>
            <li>Instagram API (Meta Platforms, Inc.)</li>
            <li>Vercel hosting platform</li>
          </ul>

          <h2>5. Your Rights</h2>
          <p>
            You can revoke app access anytime through Instagram settings. 
            We comply with GDPR, CCPA, and other applicable privacy regulations.
          </p>

          <h2 id="data-deletion">6. Data Deletion</h2>
          <p>
            You can request deletion of your data at any time:
          </p>
          <ul>
            <li>Revoke app access through your Instagram account settings</li>
            <li>Contact us at privacy@instasave.app for manual data deletion</li>
            <li>All authorization tokens are automatically expired per Instagram's guidelines</li>
          </ul>
          <p>
            We do not permanently store your personal data or Instagram content. 
            Most data is processed in real-time and not retained.
          </p>

          <h2>7. Contact Information</h2>
          <p>
            For privacy concerns, contact us at: privacy@instasave.app
          </p>

          <p className="text-sm text-gray-600 mt-8">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
