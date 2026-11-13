import type { Metadata } from 'next';
import Script from 'next/script';
import '@/styles/_tokens.css';
import '@/styles/main.css';
import '@/styles/components.css';
import '@/styles/header.css';
import '@/styles/home.css';
import '@/styles/single.css';
import '@/styles/entrevista.css';
import '@/styles/assinantes.css';
import '@/styles/footer.css';
import '@/styles/ads.css';
import './globals.css';
import { SITE_CONFIG, generateOrganizationJsonLd } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} | O portal para quem decide os rumos da saúde`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    'Saúde Insider',
    'ANS',
    'Anvisa',
    'Saúde Suplementar',
    'Operadoras de Saúde',
    'Hospitais',
    'Farma',
    'Healthtech',
    'Inteligência em Saúde',
  ],
  authors: [{ name: 'Victor Hugo' }, { name: 'Edson Rossi' }, { name: 'Lana Pinheiro' }],
  creator: SITE_CONFIG.publisher,
  publisher: SITE_CONFIG.publisher,
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} | O portal para quem decide os rumos da saúde`,
    description: SITE_CONFIG.description,
    images: [
      {
        url: 'https://saudeinsider.com.br/wp-content/uploads/2026/08/logo-si.png',
        width: 519,
        height: 375,
        alt: SITE_CONFIG.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: SITE_CONFIG.twitterHandle,
    creator: SITE_CONFIG.twitterHandle,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgJsonLd = generateOrganizationJsonLd();

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;1,400&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {/* RD Station integration loader */}
        <script
          src="https://d335luupugsy2.cloudfront.net/js/loader-scripts/bb134171-6118-4702-bae2-72d0083cbe09-loader.js"
          async
        />
      </head>
      <body
        suppressHydrationWarning
        className="home blog wp-custom-logo wp-embed-responsive wp-theme-saude-insider"
      >
        {children}

        {/* Live interaction scripts */}
        <Script src="/js/navigation.js" strategy="afterInteractive" />
        <Script src="/js/agenda.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
