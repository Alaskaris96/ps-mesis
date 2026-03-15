import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import { getSession } from '@/lib/auth';

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-serif'
});
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-sans'
});

export const metadata: Metadata = {
  metadataBase: new URL('https://ps-mesis.gr'),
  title: {
    template: '%s | Πολιτιστικός Σύλλογος Μέσης',
    default: 'Πολιτιστικός Σύλλογος Μέσης',
  },
  description: 'Επίσημη ιστοσελίδα του Πολιτιστικού Συλλόγου Μέσης. Ενημερωθείτε για τα νέα, τις εκδηλώσεις και την ιστορία μας.',
  keywords: ['πολιτιστικός σύλλογος', 'μέση', 'κομοτηνή', 'ροδόπη', 'πολιτισμός', 'mesi', 'komotini', 'cultural association', 'tradition', 'thrace', 'θράκη'],
  authors: [{ name: 'Πολιτιστικός Σύλλογος Μέσης' }],
  creator: 'Πολιτιστικός Σύλλογος Μέσης',
  openGraph: {
    type: 'website',
    locale: 'el_GR',
    url: 'https://ps-mesis.gr',
    siteName: 'Πολιτιστικός Σύλλογος Μέσης',
    title: 'Πολιτιστικός Σύλλογος Μέσης',
    description: 'Επίσημη ιστοσελίδα του Πολιτιστικού Συλλόγου Μέσης. Ενημερωθείτε για τα νέα, τις εκδηλώσεις και την ιστορία μας.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Πολιτιστικός Σύλλογος Μέσης',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Πολιτιστικός Σύλλογος Μέσης',
    description: 'Επίσημη ιστοσελίδα του Πολιτιστικού Συλλόγου Μέσης. Ενημερωθείτε για τα νέα, τις εκδηλώσεις και την ιστορία μας.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  alternates: {
    canonical: 'https://ps-mesis.gr',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="el">
      <body className={`${inter.variable} ${playfair.variable} font-sans min-h-screen flex flex-col bg-background antialiased`}>
        <Navbar user={session} />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
