import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="card-glass">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p className="text-gray-700">
                We collect information you provide directly to us, such as when you create an account, 
                complete a will, or contact us for support. This may include:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Personal identification information (name, email address, phone number)</li>
                <li>Will content and related documents</li>
                <li>Account credentials and preferences</li>
                <li>Communication history with our support team</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p className="text-gray-700">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Provide, maintain, and improve our services</li>
                <li>Process and store your will documents</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Monitor and analyze trends and usage</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Data Security</h2>
              <p className="text-gray-700">
                We implement appropriate security measures to protect your personal information 
                against unauthorized access, alteration, disclosure, or destruction. This includes:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Secure document storage and transmission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Your Rights</h2>
              <p className="text-gray-700">
                Under GDPR, you have the right to:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to processing of your data</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy or our data practices, 
                please contact us at:
              </p>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@mywill.co.uk<br />
                  <strong>Address:</strong> My Will Ltd, 123 Legal Street, London, SW1A 1AA<br />
                  <strong>Phone:</strong> +44 20 7123 4567
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Updates to This Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any 
                changes by posting the new Privacy Policy on this page and updating the 
                "Last updated" date.
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
