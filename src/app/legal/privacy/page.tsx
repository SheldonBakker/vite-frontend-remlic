import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PrivacyPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <Link to="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold">Privacy Policy</h1>
        <p className="mt-2 text-muted-foreground">Last updated: January 2025</p>

        <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold">1. Introduction</h2>
            <p className="mt-4 text-muted-foreground">
              Remlic ("we", "us", or "our") is committed to protecting your personal information
              and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and
              safeguard your information when you use our service.
            </p>
            <p className="mt-4 text-muted-foreground">
              This policy is prepared in compliance with the Protection of Personal Information Act 4 of
              2013 (POPIA) of South Africa. By using Remlic, you consent to the collection and
              use of your information in accordance with this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">2. Information Officer</h2>
            <p className="mt-4 text-muted-foreground">
              In terms of Section 55 of POPIA, our Information Officer can be contacted at:
            </p>
            <p className="mt-4 text-muted-foreground">
              <strong>Email:</strong>{' '}
              <a href="mailto:support@firearmstudio.co.za" className="text-primary underline hover:no-underline">
                support@firearmstudio.co.za
              </a>
            </p>
            <p className="mt-4 text-muted-foreground">
              You may contact our Information Officer to exercise any of your rights under POPIA or for
              any privacy-related queries.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">3. Personal Information We Collect</h2>
            <p className="mt-4 text-muted-foreground">
              We collect personal information that you voluntarily provide when using our service. This includes:
            </p>

            <h3 className="mt-6 text-xl font-medium">Account Information</h3>
            <ul className="mt-2 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Email address</li>
              <li>Password (stored securely using encryption)</li>
              <li>Name (optional)</li>
            </ul>

            <h3 className="mt-6 text-xl font-medium">Compliance Record Information</h3>
            <p className="mt-2 text-muted-foreground">
              Depending on the records you choose to track, we may collect:
            </p>
            <ul className="mt-2 list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>PSIRA Records:</strong> ID numbers, registration numbers, names, registration expiry dates</li>
              <li><strong>Firearms:</strong> License numbers, firearm details, license expiry dates</li>
              <li><strong>Vehicles:</strong> Registration numbers, vehicle details, license disc expiry dates</li>
              <li><strong>Certificates:</strong> Certificate names, types, expiry dates</li>
            </ul>

            <h3 className="mt-6 text-xl font-medium">Technical Information</h3>
            <ul className="mt-2 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Usage data and access times</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">4. Purpose of Collection</h2>
            <p className="mt-4 text-muted-foreground">
              We collect and process your personal information for the following purposes:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>Service Delivery:</strong> To provide our compliance tracking service and send expiry reminders</li>
              <li><strong>Account Management:</strong> To create and manage your account</li>
              <li><strong>Communication:</strong> To respond to your enquiries and provide support</li>
              <li><strong>Service Improvement:</strong> To understand how our service is used and improve it</li>
              <li><strong>Security:</strong> To protect against unauthorised access and ensure service integrity</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">5. Legal Basis for Processing</h2>
            <p className="mt-4 text-muted-foreground">
              Under POPIA, we process your personal information based on the following legal grounds:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>Consent:</strong> You have given consent for processing your personal information for specific purposes when you create an account and use our services</li>
              <li><strong>Contract:</strong> Processing is necessary to perform our contract with you (providing the tracking service)</li>
              <li>
                <strong>Legitimate Interest:</strong> Processing is necessary for our legitimate interests,
                such as improving our service and ensuring security, provided these interests do not
                override your rights
              </li>
              <li><strong>Legal Obligation:</strong> Processing is necessary to comply with legal requirements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">6. How We Use Your Information</h2>
            <p className="mt-4 text-muted-foreground">
              We use the information we collect to:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Provide, operate, and maintain our service</li>
              <li>Send you expiry reminders and notifications based on your settings</li>
              <li>Respond to your comments, questions, and support requests</li>
              <li>Monitor and analyse usage patterns to improve our service</li>
              <li>Detect, prevent, and address technical issues and security threats</li>
              <li>Send you service-related communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">7. Data Retention</h2>
            <p className="mt-4 text-muted-foreground">
              We retain your personal information only for as long as necessary to fulfil the purposes
              for which it was collected, including to satisfy any legal, accounting, or reporting requirements.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>Account Data:</strong> Retained while your account is active and for a reasonable period after account deletion</li>
              <li><strong>Compliance Records:</strong> Retained while your account is active; deleted upon account closure or at your request</li>
              <li><strong>Technical Logs:</strong> Retained for up to 12 months for security and troubleshooting purposes</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              You may request deletion of your data at any time by contacting our Information Officer.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">8. Data Sharing and Third Parties</h2>
            <p className="mt-4 text-muted-foreground">
              We do not sell, rent, or trade your personal information. We may share your information with:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>
                <strong>Service Providers:</strong> Third-party companies that help us provide our service
                (e.g., hosting, email delivery). These providers are bound by confidentiality obligations
              </li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or government request</li>
              <li><strong>Protection of Rights:</strong> To protect our rights, privacy, safety, or property, or that of our users or others</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets, with notice to you</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">9. Cross-Border Data Transfers</h2>
            <p className="mt-4 text-muted-foreground">
              Our service uses Supabase for data storage and authentication. Your data may be processed
              and stored on servers located outside of South Africa.
            </p>
            <p className="mt-4 text-muted-foreground">
              In accordance with Section 72 of POPIA, we ensure that any cross-border transfer of your
              personal information is done only to countries or organisations that provide an adequate
              level of protection, or where appropriate safeguards are in place.
            </p>
            <p className="mt-4 text-muted-foreground">
              By using our service, you consent to the transfer of your information to servers that may
              be located internationally.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">10. Data Security</h2>
            <p className="mt-4 text-muted-foreground">
              We implement appropriate technical and organisational measures to protect your personal
              information against unauthorised access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Encryption of data in transit using HTTPS/TLS</li>
              <li>Secure password hashing</li>
              <li>Access controls and authentication requirements</li>
              <li>Regular security assessments</li>
              <li>Secure cloud infrastructure with industry-standard protections</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              While we strive to protect your personal information, no method of transmission over the
              Internet or electronic storage is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">11. Your Rights Under POPIA</h2>
            <p className="mt-4 text-muted-foreground">
              Under the Protection of Personal Information Act, you have the following rights:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>Right to Access:</strong> Request confirmation of whether we hold your personal information and access to that information</li>
              <li>
                <strong>Right to Correction:</strong> Request correction or deletion of your personal
                information if it is inaccurate, irrelevant, excessive, out of date, incomplete,
                misleading, or unlawfully obtained
              </li>
              <li><strong>Right to Deletion:</strong> Request deletion of your personal information in certain circumstances</li>
              <li><strong>Right to Object:</strong> Object to the processing of your personal information on reasonable grounds</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw your consent to processing at any time (this does not affect the lawfulness of processing before withdrawal)</li>
              <li><strong>Right to Lodge a Complaint:</strong> Lodge a complaint with the Information Regulator if you believe your rights have been violated</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              To exercise any of these rights, please contact our Information Officer at{' '}
              <a href="mailto:support@firearmstudio.co.za" className="text-primary underline hover:no-underline">
                support@firearmstudio.co.za
              </a>. We will respond to your request within a reasonable time, and in any event within
              one month of receiving your request.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">12. Cookies and Tracking</h2>
            <p className="mt-4 text-muted-foreground">
              We use essential cookies and similar technologies to:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Keep you signed in to your account</li>
              <li>Remember your preferences (such as theme settings)</li>
              <li>Ensure the security of your session</li>
            </ul>
            <p className="mt-4 text-muted-foreground">
              These are strictly necessary cookies required for the service to function. We do not use
              advertising or third-party tracking cookies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">13. Children's Privacy</h2>
            <p className="mt-4 text-muted-foreground">
              Our service is not intended for children under the age of 18. We do not knowingly collect
              personal information from children under 18. If you are a parent or guardian and believe
              your child has provided us with personal information, please contact us and we will take
              steps to delete such information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">14. Changes to This Policy</h2>
            <p className="mt-4 text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any material
              changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
            <p className="mt-4 text-muted-foreground">
              We encourage you to review this Privacy Policy periodically for any changes. Changes are
              effective when posted on this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold">15. Contact Us and Complaints</h2>
            <p className="mt-4 text-muted-foreground">
              If you have any questions about this Privacy Policy or wish to exercise your rights, please
              contact our Information Officer:
            </p>
            <p className="mt-4 text-muted-foreground">
              <strong>Email:</strong>{' '}
              <a href="mailto:support@firearmstudio.co.za" className="text-primary underline hover:no-underline">
                support@firearmstudio.co.za
              </a>
            </p>
            <p className="mt-4 text-muted-foreground">
              If you are not satisfied with our response or believe we are processing your personal
              information unlawfully, you have the right to lodge a complaint with the Information Regulator:
            </p>
            <div className="mt-4 rounded-lg border bg-muted/50 p-4 text-muted-foreground">
              <p><strong>Information Regulator (South Africa)</strong></p>
              <p className="mt-2">
                <strong>Email:</strong>{' '}
                <a href="mailto:complaints.IR@justice.gov.za" className="text-primary underline hover:no-underline">
                  complaints.IR@justice.gov.za
                </a>
              </p>
              <p className="mt-1">
                <strong>Website:</strong>{' '}
                <a
                  href="https://www.justice.gov.za/inforeg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline hover:no-underline"
                >
                  www.justice.gov.za/inforeg
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
