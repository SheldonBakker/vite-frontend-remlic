import { useEffect } from 'react';
import { SEO_CONFIG } from '@/constants/seo';

interface FaqItem {
  question: string;
  answer: string;
}

function setJsonLd(id: string, schema: object): void {
  let script = document.querySelector(`script[data-schema-id="${id}"]`);

  if (!script) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-schema-id', id);
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(schema);
}

export function OrganizationSchema(): null {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: SEO_CONFIG.siteName,
      url: SEO_CONFIG.siteUrl,
      logo: `${SEO_CONFIG.siteUrl}/favicon.jpeg`,
      description: SEO_CONFIG.defaultDescription,
      foundingDate: '2025',
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'support@remlic.co.za',
        contactType: 'customer support',
      },
      sameAs: [],
    };

    setJsonLd('organization', schema);
  }, []);

  return null;
}

export function WebSiteSchema(): null {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SEO_CONFIG.siteName,
      url: SEO_CONFIG.siteUrl,
      description: SEO_CONFIG.defaultDescription,
      publisher: {
        '@type': 'Organization',
        name: SEO_CONFIG.siteName,
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SEO_CONFIG.siteUrl}/dashboard?search={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    };

    setJsonLd('website', schema);
  }, []);

  return null;
}

export function WebApplicationSchema(): null {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: SEO_CONFIG.siteName,
      description: SEO_CONFIG.defaultDescription,
      url: SEO_CONFIG.siteUrl,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '50',
        priceCurrency: 'ZAR',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '50',
          priceCurrency: 'ZAR',
          billingDuration: 'P1M',
        },
      },
      author: {
        '@type': 'Organization',
        name: SEO_CONFIG.siteName,
      },
      featureList: [
        'PSIRA registration tracking',
        'PSIRA certificate renewal reminders',
        'Firearms license management',
        'SAPS firearm license tracking',
        'Gun license renewal notifications',
        'Vehicle license disc expiry tracking',
        'Driver license expiry alerts',
        'Training certificate management',
        'SOB registration tracking',
        'Private security compliance',
        'Expiry date reminders',
        'Compliance dashboard',
      ],
      keywords: [
        'firearms license South Africa',
        'SAPS firearm license',
        'gun license renewal',
        'PSIRA registration',
        'PSIRA compliance',
        'private security registration',
        'vehicle license disc',
        'compliance management South Africa',
        'license expiry tracker',
        'SOB registration',
      ],
    };

    setJsonLd('webapplication', schema);
  }, []);

  return null;
}

export function LocalBusinessSchema(): null {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${SEO_CONFIG.siteUrl}/#business`,
      name: SEO_CONFIG.siteName,
      description: SEO_CONFIG.defaultDescription,
      url: SEO_CONFIG.siteUrl,
      logo: `${SEO_CONFIG.siteUrl}/favicon.jpeg`,
      image: SEO_CONFIG.defaultImage,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'ZA',
      },
      geo: {
        '@type': 'GeoCoordinates',
        addressCountry: 'ZA',
      },
      areaServed: {
        '@type': 'Country',
        name: 'South Africa',
      },
      serviceType: [
        'Firearms License Management',
        'PSIRA Registration Tracking',
        'Compliance Management',
        'Vehicle License Tracking',
      ],
      priceRange: 'R50-R500',
    };

    setJsonLd('localbusiness', schema);
  }, []);

  return null;
}

interface FaqSchemaProps {
  faqs: FaqItem[];
}

export function FaqSchema({ faqs }: FaqSchemaProps): null {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    };

    setJsonLd('faqpage', schema);
  }, [faqs]);

  return null;
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps): null {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url,
      })),
    };

    setJsonLd('breadcrumb', schema);
  }, [items]);

  return null;
}
