import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="card-glass">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing and using the My Will platform, you accept and agree to be bound by 
                the terms and provision of this agreement. If you do not agree to abide by the 
                above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
              <p className="text-gray-700">
                My Will provides a platform for creating, managing, and storing will documents. 
                Our service includes:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Will creation wizard and templates</li>
                <li>Document storage and management</li>
                <li>Attestation support and guidance</li>
                <li>Client relationship management tools</li>
                <li>Secure document storage and retrieval</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Responsibilities</h2>
              <p className="text-gray-700">
                As a user of the My Will platform, you agree to:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not use the service for any unlawful purpose</li>
                <li>Respect the privacy and rights of other users</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Legal Disclaimer</h2>
              <p className="text-gray-700">
                <strong>Important:</strong> My Will is not a law firm and does not provide legal advice. 
                The information provided through our service is for general informational purposes only. 
                We recommend consulting with a qualified legal professional for specific legal advice 
                regarding your will and estate planning needs.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Service Availability</h2>
              <p className="text-gray-700">
                We strive to maintain high availability of our service, but we do not guarantee 
                uninterrupted access. We may temporarily suspend the service for maintenance, 
                updates, or other operational reasons. We will provide reasonable notice when possible.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Data and Privacy</h2>
              <p className="text-gray-700">
                Your privacy is important to us. Our collection and use of personal information 
                is governed by our Privacy Policy, which is incorporated into these Terms by reference.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Intellectual Property</h2>
              <p className="text-gray-700">
                The My Will platform, including its content, features, and functionality, is owned 
                by My Will Ltd and is protected by copyright, trademark, and other intellectual 
                property laws. You may not copy, modify, or distribute any part of our service 
                without our express written consent.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Limitation of Liability</h2>
              <p className="text-gray-700">
                To the maximum extent permitted by law, My Will Ltd shall not be liable for any 
                indirect, incidental, special, consequential, or punitive damages, including but 
                not limited to loss of profits, data, or use, arising out of or relating to your 
                use of our service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Termination</h2>
              <p className="text-gray-700">
                We may terminate or suspend your account and access to our service at any time, 
                with or without cause, with or without notice. Upon termination, your right to 
                use the service will cease immediately.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Governing Law</h2>
              <p className="text-gray-700">
                These Terms shall be governed by and construed in accordance with the laws of 
                England and Wales. Any disputes arising from these Terms or your use of our 
                service shall be subject to the exclusive jurisdiction of the courts of England and Wales.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these Terms at any time. We will notify users 
                of any material changes by posting the new Terms on this page and updating 
                the "Last updated" date.
              </p>
              <p className="text-sm text-gray-500 mt-4">
                <strong>Last updated:</strong> {new Date().toLocaleDateString()}
              </p>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
