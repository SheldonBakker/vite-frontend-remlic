import { Helmet } from '@dr.pogodin/react-helmet';
import { SEO_CONFIG } from '@/constants/seo';

export function OrganizationSchema(): React.JSX.Element {
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

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

export function WebSiteSchema(): React.JSX.Element {
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

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

export function WebApplicationSchema(): React.JSX.Element {
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
      'Firearms license management',
      'Vehicle license disc expiry tracking',
      'Training certificate management',
      'Expiry date reminders',
      'Compliance dashboard',
    ],
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}
