export const SEO_CONFIG = {
  siteName: 'Remlic',
  siteUrl: 'https://remlic.co.za',
  defaultTitle: 'Remlic - Firearms License Management',
  defaultDescription:
    'South Africa\'s leading firearms license and PSIRA registration tracker. Manage gun license renewals, PSIRA certificates, vehicle license discs, and compliance records. Never miss an expiry date.',
  defaultImage: 'https://remlic.co.za/og-image.png',
  locale: 'en_ZA',
  twitterHandle: '@remlic',
} as const;

export interface PageSeoConfig {
  title: string;
  description: string;
  path: string;
  noIndex?: boolean;
}

export const PAGE_SEO: Record<string, PageSeoConfig> = {
  home: {
    title: 'Remlic - Firearms License Management',
    description:
      'Manage your firearms licenses, vehicle registrations, and PSIRA records in one place. Track expiry dates and stay compliant with ease.',
    path: '/',
  },
  login: {
    title: 'Log In | Remlic',
    description:
      'Sign in to your Remlic account to manage your firearms licenses, PSIRA registrations, and vehicle compliance records.',
    path: '/login',
  },
  signup: {
    title: 'Sign Up | Remlic',
    description:
      'Create a Remlic account to start tracking your firearms licenses, PSIRA registrations, and vehicle compliance records.',
    path: '/signup',
  },
  forgotPassword: {
    title: 'Forgot Password | Remlic',
    description: 'Reset your Remlic account password.',
    path: '/forgot-password',
    noIndex: true,
  },
  resetPassword: {
    title: 'Reset Password | Remlic',
    description: 'Set a new password for your Remlic account.',
    path: '/reset-password',
    noIndex: true,
  },
  terms: {
    title: 'Terms and Conditions | Remlic',
    description:
      'Read the terms and conditions for using Remlic, the firearms license and compliance management platform.',
    path: '/terms',
  },
  privacy: {
    title: 'Privacy Policy | Remlic',
    description:
      'Learn how Remlic protects your personal information and handles your data in compliance with POPIA.',
    path: '/privacy',
  },
  faq: {
    title: 'FAQ | Remlic',
    description:
      'Frequently asked questions about Remlic - firearms license tracking, PSIRA registration management, and compliance solutions in South Africa.',
    path: '/faq',
  },
  notFound: {
    title: 'Page Not Found | Remlic',
    description: 'The page you are looking for does not exist.',
    path: '/404',
    noIndex: true,
  },
} as const;
