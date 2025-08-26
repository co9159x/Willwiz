import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Shield, FileText, Users, Clock, Lock } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">My Will</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/policies/privacy">
              <Button variant="ghost" size="sm">Privacy</Button>
            </Link>
            <Link href="/policies/terms">
              <Button variant="ghost" size="sm">Terms</Button>
            </Link>
            <Link href="/login">
              <Button className="button-base">Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">Professional Will Creation Platform</Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Streamline Your Will Creation Process
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            My Will is the leading SaaS platform for UK brokers and financial advisers. 
            Create legally robust wills, manage attestations, and store documents securely 
            with our comprehensive suite of tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="button-base text-lg px-8 py-4">
                Get Started Free
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Professional Will Creation
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From initial client onboarding to final document storage, 
              our platform handles every aspect of the will creation process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="card-glass">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Client Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Comprehensive CRM for managing client relationships, 
                  storing contact information, and tracking progress.
                </p>
              </CardContent>
            </Card>

            <Card className="card-glass">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Will Creation Wizard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Step-by-step wizard guides clients through will creation 
                  with validation and auto-save functionality.
                </p>
              </CardContent>
            </Card>

            <Card className="card-glass">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Attestation Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  In-person or supervised video attestation with 
                  comprehensive checklists and compliance tracking.
                </p>
              </CardContent>
            </Card>

            <Card className="card-glass">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Secure Storage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Encrypted document storage with time-limited access 
                  links and comprehensive audit trails.
                </p>
              </CardContent>
            </Card>

            <Card className="card-glass">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Compliance & Audit</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Built-in compliance features with detailed audit logs 
                  for all sensitive actions and document access.
                </p>
              </CardContent>
            </Card>

            <Card className="card-glass">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Task Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track progress with task management, notes, 
                  and reminders to ensure nothing falls through the cracks.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose My Will?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Multi-Tenant Architecture</h3>
                    <p className="text-gray-600">
                      Each broker operates in an isolated environment with complete data separation.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">UK Legal Compliance</h3>
                    <p className="text-gray-600">
                      Built specifically for UK will requirements with proper attestation procedures.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Revenue Sharing</h3>
                    <p className="text-gray-600">
                      Transparent 90/10 revenue split with automated commission tracking.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Future-Ready</h3>
                    <p className="text-gray-600">
                      Feature flags for AI explainer and intake modes coming in Phase 2.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Platform Statistics</h3>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Brokers</span>
                  <span className="text-2xl font-bold text-blue-600">50+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Wills Created</span>
                  <span className="text-2xl font-bold text-green-600">1,000+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="text-2xl font-bold text-purple-600">99.8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Uptime</span>
                  <span className="text-2xl font-bold text-orange-600">99.9%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Will Creation Process?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of UK brokers who trust My Will for their 
            professional will creation and management needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/policies/terms">
              <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-blue-600">
                View Terms
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FileText className="h-6 w-6 text-blue-400" />
                <span className="text-xl font-bold">My Will</span>
              </div>
              <p className="text-gray-400">
                Professional will creation platform for UK brokers and financial advisers.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="#features" className="hover:text-white">Features</Link></li>
                <li><Link href="/policies/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/policies/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/policies/refund" className="hover:text-white">Refund Policy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="mailto:support@mywill.co.uk" className="hover:text-white">support@mywill.co.uk</a></li>
                <li><a href="tel:+442071234567" className="hover:text-white">+44 20 7123 4567</a></li>
                <li>Mon-Fri 9AM-6PM GMT</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li>My Will Ltd</li>
                <li>123 Legal Street</li>
                <li>London, SW1A 1AA</li>
                <li>United Kingdom</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} My Will Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}