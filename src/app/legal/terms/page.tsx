import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Seo } from '@/components/seo';
import { PAGE_SEO } from '@/constants/seo';

export default function TermsPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={PAGE_SEO.terms.title}
        description={PAGE_SEO.terms.description}
        path={PAGE_SEO.terms.path}
      />
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <Link to="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold">Terms and Conditions</h1>
        <p className="mt-2 text-muted-foreground">Last updated: January 2025</p>

        <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">1. Introduction and Acceptance</h2>
            <p className="mt-4 text-muted-foreground">
              Welcome to Remlic. These Terms and Conditions govern your use of our website and services.
              By accessing or using Remlic, you agree to be bound by these terms. If you do not agree
              to these terms, please do not use our services.
            </p>
            <p className="mt-4 text-muted-foreground">
              These terms are governed by the laws of the Republic of South Africa, including the Consumer
              Protection Act 68 of 2008 (CPA), the Electronic Communications and Transactions Act 25 of 2002
              (ECT Act), and the Protection of Personal Information Act 4 of 2013 (POPIA).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">2. About Remlic</h2>
            <p className="mt-4 text-muted-foreground">
              Remlic is a compliance management platform that helps users track expiry dates for:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>PSIRA (Private Security Industry Regulatory Authority) registrations</li>
              <li>Firearms licenses</li>
              <li>Vehicle license discs</li>
              <li>Training certificates</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              Our service provides tracking and reminder functionality only. We do not issue, renew, or
              process any licenses or registrations on your behalf.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">3. User Accounts</h2>
            <p className="mt-4 text-muted-foreground">
              To use our services, you must create an account. You agree to:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and update your information to keep it accurate</li>
              <li>Keep your password secure and confidential</li>
              <li>Notify us immediately of any unauthorised use of your account</li>
              <li>Accept responsibility for all activities that occur under your account</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              You must be at least 18 years old to create an account and use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">4. Acceptable Use</h2>
            <p className="mt-4 text-muted-foreground">
              You agree to use Remlic only for lawful purposes. You must not:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Use the service for any unlawful purpose or in violation of any laws</li>
              <li>Upload false, misleading, or fraudulent information</li>
              <li>Attempt to gain unauthorised access to our systems or other users' accounts</li>
              <li>Interfere with or disrupt the service or servers</li>
              <li>Use the service to track information without proper authorisation</li>
              <li>Share your account credentials with others</li>
              <li>Use automated systems to access the service without permission</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">5. Your Responsibilities</h2>
            <p className="mt-4 text-muted-foreground">
              You are responsible for:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Ensuring the accuracy of all information you enter into the system</li>
              <li>Taking action on expiry reminders in a timely manner</li>
              <li>Verifying expiry dates with official sources</li>
              <li>Ensuring you have legal authority to track the records you enter</li>
              <li>Complying with all applicable laws regarding firearms, security, and vehicles</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              Remlic is a tracking tool only. You remain solely responsible for renewing your
              licenses and registrations with the appropriate authorities.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">6. Intellectual Property</h2>
            <p className="mt-4 text-muted-foreground">
              All content, features, and functionality of Remlic, including but not limited to
              text, graphics, logos, icons, and software, are the exclusive property of Remlic
              and are protected by South African and international intellectual property laws.
            </p>
            <p className="mt-4 text-muted-foreground">
              You may not copy, modify, distribute, sell, or lease any part of our services without
              our prior written consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">7. Privacy</h2>
            <p className="mt-4 text-muted-foreground">
              Your privacy is important to us. Our collection and use of personal information is governed
              by our{' '}
              <Link to="/privacy" className="text-primary underline hover:no-underline">
                Privacy Policy
              </Link>
              , which forms part of these terms. By using our services, you consent to the collection
              and use of your information as described in our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">8. Disclaimer and Limitation of Liability</h2>
            <p className="mt-4 text-muted-foreground">
              <strong>Service Provided "As Is":</strong> Remlic is provided on an "as is" and
              "as available" basis. We make no warranties, express or implied, regarding the service's
              reliability, accuracy, or availability.
            </p>
            <p className="mt-4 text-muted-foreground">
              <strong>No Guarantee of Reminders:</strong> While we strive to provide timely reminders,
              we do not guarantee that all notifications will be delivered. Technical issues, email
              delivery problems, or system maintenance may affect reminder delivery.
            </p>
            <p className="mt-4 text-muted-foreground">
              <strong>Limitation of Liability:</strong> To the maximum extent permitted by South African
              law, Remlic shall not be liable for any indirect, incidental, special, consequential,
              or punitive damages, including but not limited to:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Loss arising from expired licenses or registrations</li>
              <li>Fines or penalties from regulatory authorities</li>
              <li>Loss of business or revenue</li>
              <li>Data loss or corruption</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              Nothing in these terms excludes or limits liability that cannot be excluded under South
              African law, including liability for fraud or gross negligence.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">9. Indemnification</h2>
            <p className="mt-4 text-muted-foreground">
              You agree to indemnify, defend, and hold harmless Remlic, its officers, directors,
              employees, and agents from any claims, damages, losses, liabilities, and expenses (including
              legal fees) arising out of or related to:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Your use of our services</li>
              <li>Your violation of these terms</li>
              <li>Your violation of any rights of another person or entity</li>
              <li>Any content you submit or upload to the service</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">10. Termination</h2>
            <p className="mt-4 text-muted-foreground">
              We may suspend or terminate your account at any time if you violate these terms or for any
              other reason at our discretion. You may also terminate your account at any time by contacting us.
            </p>
            <p className="mt-4 text-muted-foreground">
              Upon termination:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Your right to use the service will cease immediately</li>
              <li>We may delete your account and associated data</li>
              <li>Provisions that should survive termination will remain in effect</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">11. Governing Law and Jurisdiction</h2>
            <p className="mt-4 text-muted-foreground">
              These terms are governed by and construed in accordance with the laws of the Republic of
              South Africa. Any disputes arising from these terms or your use of Remlic shall be
              subject to the exclusive jurisdiction of the courts of South Africa.
            </p>
            <p className="mt-4 text-muted-foreground">
              Before initiating any legal proceedings, you agree to first attempt to resolve any dispute
              through informal negotiation by contacting us at{' '}
              <a href="mailto:support@firearmstudio.co.za" className="text-primary underline hover:no-underline">
                support@firearmstudio.co.za
              </a>.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">12. Changes to These Terms</h2>
            <p className="mt-4 text-muted-foreground">
              We may update these terms from time to time. We will notify you of any material changes by
              posting the new terms on our website and updating the "Last updated" date. Your continued
              use of Remlic after such changes constitutes your acceptance of the new terms.
            </p>
            <p className="mt-4 text-muted-foreground">
              We encourage you to review these terms periodically for any changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">13. Contact Us</h2>
            <p className="mt-4 text-muted-foreground">
              If you have any questions about these Terms and Conditions, please contact us at:
            </p>
            <p className="mt-4 text-muted-foreground">
              <strong>Email:</strong>{' '}
              <a href="mailto:support@firearmstudio.co.za" className="text-primary underline hover:no-underline">
                support@firearmstudio.co.za
              </a>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">14. Severability</h2>
            <p className="mt-4 text-muted-foreground">
              If any provision of these terms is found to be invalid or unenforceable by a court of
              competent jurisdiction, the remaining provisions will continue in full force and effect.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
