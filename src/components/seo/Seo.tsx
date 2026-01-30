import { useEffect } from 'react';
import { SEO_CONFIG } from '@/constants/seo';

interface SeoProps {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
  image?: string;
  type?: 'website' | 'article';
}

function setMetaTag(property: string, content: string, isProperty = false): void {
  const attribute = isProperty ? 'property' : 'name';
  let element = document.querySelector(`meta[${attribute}="${property}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, property);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function setCanonicalUrl(url: string): void {
  let link = document.querySelector('link[rel="canonical"]');

  if (!link) {
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    document.head.appendChild(link);
  }

  link.setAttribute('href', url);
}

export function Seo({
  title,
  description,
  path,
  noIndex = false,
  image = SEO_CONFIG.defaultImage,
  type = 'website',
}: SeoProps): null {
  const canonicalUrl = `${SEO_CONFIG.siteUrl}${path}`;

  useEffect(() => {
    // Title
    document.title = title;
    setMetaTag('title', title);

    // Description
    setMetaTag('description', description);

    // Canonical
    setCanonicalUrl(canonicalUrl);

    // Robots
    if (noIndex) {
      setMetaTag('robots', 'noindex, nofollow');
    } else {
      setMetaTag('robots', 'index, follow');
    }

    // Open Graph
    setMetaTag('og:type', type, true);
    setMetaTag('og:url', canonicalUrl, true);
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', image, true);
    setMetaTag('og:site_name', SEO_CONFIG.siteName, true);
    setMetaTag('og:locale', SEO_CONFIG.locale, true);

    // Twitter
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:url', canonicalUrl);
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image);
  }, [title, description, canonicalUrl, noIndex, image, type]);

  return null;
}
