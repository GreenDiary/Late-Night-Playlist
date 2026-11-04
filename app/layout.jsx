import LegacyScripts from './legacy-scripts';

const description = 'Listen to Hindi, Bengali, Punjabi and lo-fi music in a free browser player for late-night listening. No sign-up or app download required.';
const title = 'Late Night Playlist | Hindi, Bengali, Punjabi & Lo-fi Music';
const roomImageAlt = 'A moonlit night room with a desk, open window and floating curtains';

export const metadata = {
  metadataBase: new URL('https://latenightplaylist.web.app'),
  title,
  description,
  robots: 'index, follow, max-image-preview:large',
  openGraph: {
    type: 'website',
    siteName: 'Late Night Playlist',
    title,
    description,
    images: [{ url: '/assets/room-night.png', alt: roomImageAlt }],
    locale: 'en_IN'
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [{ url: '/assets/room-night.png', alt: roomImageAlt }]
  },
  icons: {
    icon: [{ url: '/assets/favicon.png', type: 'image/png', sizes: '1024x1024' }]
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#111522'
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://latenightplaylist.web.app/#website',
      url: 'https://latenightplaylist.web.app/',
      name: 'Late Night Playlist',
      description: 'A free browser-based music player with Hindi, Bengali, Punjabi and lo-fi playlists for late-night listening.',
      inLanguage: 'en-IN',
    },
    {
      '@type': 'WebPage',
      '@id': 'https://latenightplaylist.web.app/#webpage',
      url: 'https://latenightplaylist.web.app/',
      name: title,
      description,
      isPartOf: { '@id': 'https://latenightplaylist.web.app/#website' },
      about: { '@id': 'https://latenightplaylist.web.app/#playlist' },
      primaryImageOfPage: 'https://latenightplaylist.web.app/assets/room-night.png',
      inLanguage: 'en-IN'
    },
    {
      '@type': 'MusicPlaylist',
      '@id': 'https://latenightplaylist.web.app/#playlist',
      name: 'Late Night Playlist',
      description: 'A browser-based collection of YouTube playlists for late-night listening: Hindi, Bengali, Punjabi, and lo-fi/instrumental music.',
      url: 'https://latenightplaylist.web.app/',
      genre: ['Hindi music', 'Bengali music', 'Punjabi music', 'Lo-fi and instrumental music'],
      inLanguage: ['en-IN', 'hi-IN', 'bn-IN', 'pa-IN']
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="canonical" href="https://latenightplaylist.web.app/" />
        <meta property="og:url" content="https://latenightplaylist.web.app/" />
        <link rel="preload" href="/assets/fonts/newsreader-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/assets/fonts/newsreader-italic-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="stylesheet" href="/css/base.css" />
        <link rel="stylesheet" href="/css/hero.css" />
        <link rel="stylesheet" href="/css/player.css" />
        <link rel="stylesheet" href="/css/about.css" />
        <link rel="stylesheet" href="/css/motion-responsive.css" />
        <link rel="stylesheet" href="/css/donation.css" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </head>
      <body>
        {children}
        <LegacyScripts />
      </body>
    </html>
  );
}
