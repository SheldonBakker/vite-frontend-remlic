import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Seo, FaqSchema, BreadcrumbSchema } from '@/components/seo';
import { PAGE_SEO, SEO_CONFIG } from '@/constants/seo';

const faqs = [
  {
    question: 'What is Remlic?',
    answer:
      'Remlic is a compliance management platform designed for South African security professionals. ' +
      'It helps you track expiry dates for PSIRA registrations, firearms licenses, vehicle license discs, ' +
      'and training certificates in one centralised dashboard.',
  },
  {
    question: 'How does Remlic help with PSIRA registration tracking?',
    answer:
      'Remlic allows you to look up PSIRA officers directly using their ID number and automatically ' +
      'fetches their registration details from the PSIRA database. You can save officers to your list ' +
      'and receive alerts before their registrations expire.',
  },
  {
    question: 'Can Remlic renew my firearms license?',
    answer:
      'No, Remlic is a tracking and reminder tool only. We do not issue, renew, or process any licenses ' +
      'or registrations on your behalf. You remain responsible for renewing your licenses with the ' +
      'appropriate authorities (such as SAPS for firearms licenses).',
  },
  {
    question: 'How much does Remlic cost?',
    answer:
      'Remlic offers two subscription plans: Monthly at R50/month or Yearly at R500/year ' +
      '(saving you R100, equivalent to 2 months free). Both plans include full access to all features.',
  },
  {
    question: 'What types of records can I track with Remlic?',
    answer:
      'Remlic supports tracking of: PSIRA officer registrations, firearms licenses, vehicle license discs, ' +
      'training certificates (such as First Aid, Firearm Competency), and driver license expiry dates.',
  },
  {
    question: 'How do expiry reminders work?',
    answer:
      'You can configure reminder settings for each record type. Choose to be notified 7, 14, 30, or 60 ' +
      'days before expiry. Reminders are displayed on your dashboard with colour-coded alerts: ' +
      'red for expired items and orange for items expiring soon.',
  },
  {
    question: 'Is my data secure with Remlic?',
    answer:
      'Yes, we take data security seriously. All data is encrypted in transit using HTTPS/TLS, ' +
      'passwords are securely hashed, and we use Supabase for secure cloud infrastructure. ' +
      'We comply with POPIA (Protection of Personal Information Act) requirements.',
  },
  {
    question: 'Can I use Remlic for my security company?',
    answer:
      'Remlic is ideal for security companies that need to track compliance across multiple officers, ' +
      'firearms, and vehicles. The unified dashboard lets you see all upcoming expirations at a glance, ' +
      'filtered by record type and time period.',
  },
  {
    question: 'What is PSIRA?',
    answer:
      'PSIRA stands for the Private Security Industry Regulatory Authority. It is the regulatory body ' +
      'in South Africa responsible for regulating the private security industry. All security officers ' +
      'and businesses must be registered with PSIRA to operate legally.',
  },
  {
    question: 'How do I cancel my subscription?',
    answer:
      'You can cancel your subscription at any time from your dashboard settings. Your access will ' +
      'continue until the end of your current billing period. Contact support@remlic.co.za if you ' +
      'need assistance.',
  },
];

const breadcrumbs = [
  { name: 'Home', url: SEO_CONFIG.siteUrl },
  { name: 'FAQ', url: `${SEO_CONFIG.siteUrl}/faq` },
];

export default function FaqPage(): React.JSX.Element {
  return (
    <div className="min-h-screen bg-background">
      <Seo
        title={PAGE_SEO.faq.title}
        description={PAGE_SEO.faq.description}
        path={PAGE_SEO.faq.path}
      />
      <FaqSchema faqs={faqs} />
      <BreadcrumbSchema items={breadcrumbs} />

      <div className="container mx-auto max-w-4xl px-4 py-12">
        <Link to="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <h1 className="text-4xl font-bold">Frequently Asked Questions</h1>
        <p className="mt-2 text-muted-foreground">
          Find answers to common questions about Remlic and compliance management in South Africa.
        </p>

        <div className="mt-8 space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 rounded-lg border bg-muted/50 p-6 text-center">
          <h2 className="text-xl font-semibold">Still have questions?</h2>
          <p className="mt-2 text-muted-foreground">
            Contact our support team at{' '}
            <a
              href="mailto:support@remlic.co.za"
              className="text-primary underline hover:no-underline"
            >
              support@remlic.co.za
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
