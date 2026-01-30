import { Helmet } from '@dr.pogodin/react-helmet';
import { SEO_CONFIG } from '@/constants/seo';

interface SeoProps {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  image?: string;
  type?: 'website' | 'article';
}

export function Seo({
  title,
  description,
  path,
  noIndex = false,
  image = SEO_CONFIG.defaultImage,
  type = 'website',
}: SeoProps): React.JSX.Element {
  const canonicalUrl = `${SEO_CONFIG.siteUrl}${path}`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content={SEO_CONFIG.siteName} />
      <meta property="og:locale" content={SEO_CONFIG.locale} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonicalUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
}
