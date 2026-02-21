import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
  title: 'Πολιτιστικός Σύλλογος Μέσης',
  description: 'Official website of the Cultural Association of Mesi',
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
      </body>
    </html>
  );
}
