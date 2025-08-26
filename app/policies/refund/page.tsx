import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function RefundPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="card-glass">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Refund Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Overview</h2>
              <p className="text-gray-700">
                At My Will, we are committed to providing high-quality services to our customers. 
                This refund policy outlines the circumstances under which refunds may be provided 
                and the process for requesting them.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Service Completion</h2>
              <p className="text-gray-700">
                Our services are considered complete when:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>A will draft has been generated and sent for client approval</li>
                <li>The attestation process has been completed</li>
                <li>The final signed document has been stored in our secure system</li>
                <li>All associated documentation has been provided</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Refund Eligibility</h2>
              <p className="text-gray-700">
                Refunds may be provided in the following circumstances:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li><strong>Technical Issues:</strong> If our platform is unavailable for more than 24 hours during your service period</li>
                <li><strong>Service Not Delivered:</strong> If we fail to deliver the promised service within the agreed timeframe</li>
                <li><strong>Quality Issues:</strong> If the delivered service does not meet our stated quality standards</li>
                <li><strong>Cancellation:</strong> If you cancel before the will creation process has begun</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Non-Refundable Services</h2>
              <p className="text-gray-700">
                The following services are non-refundable:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Services that have been completed and delivered</li>
                <li>Document storage fees for completed wills</li>
                <li>Additional copies or reprints of documents</li>
                <li>Consultation fees for completed sessions</li>
                <li>Subscription fees for completed billing periods</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Refund Process</h2>
              <p className="text-gray-700">
                To request a refund:
              </p>
              <ol className="list-decimal pl-6 mt-2 text-gray-700">
                <li>Contact our support team at support@mywill.co.uk</li>
                <li>Provide your account details and order reference</li>
                <li>Explain the reason for your refund request</li>
                <li>Include any relevant documentation or evidence</li>
                <li>We will review your request within 5 business days</li>
                <li>If approved, refunds will be processed within 10 business days</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Refund Methods</h2>
              <p className="text-gray-700">
                Refunds will be issued using the original payment method:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>Credit/debit card payments will be refunded to the original card</li>
                <li>Bank transfers will be refunded to the original account</li>
                <li>Digital wallet payments will be refunded to the original wallet</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Partial Refunds</h2>
              <p className="text-gray-700">
                In some cases, partial refunds may be provided:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>If only part of the service was completed</li>
                <li>If there were significant delays in service delivery</li>
                <li>If the service quality was below our standards</li>
                <li>The amount will be calculated based on the portion of service not delivered</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Dispute Resolution</h2>
              <p className="text-gray-700">
                If you disagree with our refund decision:
              </p>
              <ul className="list-disc pl-6 mt-2 text-gray-700">
                <li>You may request a review by our management team</li>
                <li>Provide additional evidence or documentation</li>
                <li>We will conduct a thorough review within 10 business days</li>
                <li>If still unresolved, you may contact relevant consumer protection authorities</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Contact Information</h2>
              <p className="text-gray-700">
                For refund requests or questions about this policy:
              </p>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-700">
                  <strong>Email:</strong> support@mywill.co.uk<br />
                  <strong>Phone:</strong> +44 20 7123 4567<br />
                  <strong>Address:</strong> My Will Ltd, 123 Legal Street, London, SW1A 1AA<br />
                  <strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM GMT
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Policy Updates</h2>
              <p className="text-gray-700">
                We may update this refund policy from time to time. Changes will be posted on this page 
                and will be effective immediately upon posting.
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
